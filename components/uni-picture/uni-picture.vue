<template>
  <view class="weui-uploader__bd">
    <view class="weui-uploader__files" id="uploaderFiles">
      <block v-for="(item, index) in files" :key="index">
        <view
          class="weui-uploader__file"
          v-if="!item.isdel && index === 0"
          @click="previewImage"
          :id="item.url"
        >
          <image
            class="weui-uploader__img"
            :src="item.url"
            mode="aspectFill"
          />
          <text
            class="icon icon-cuo del"
            @click.stop.prevent="del"
            :data-index="index"
            v-if="!readonly"
          ></text>
        </view>
      </block>
      <block v-if="files.length === 0">
        <view class="weui-uploader__file">
          <image
            class="weui-uploader__img"
            :src="'../../static/components/picture/error.png'"
            mode="aspectFill"
          />
          <text
            class="icon icon-cuo del"
            @click.stop.prevent="del"
            :data-index="index"
            v-if="!readonly"
          ></text>
        </view>
      </block>
      <view class="weui-uploader__input-box" v-if="!readonly && showAdd">
        <view class="weui-uploader__input" @click="chooseImage"></view>
      </view>
    </view>
  </view>
</template>

<script>
const { transformAssetsUrl } = require("../../core/funcs/transform.url");
const { getCurrentToken } = require("../../core/http/token");
const { formatNow } = require("../../core/funcs/formatTime");
const { pictureService } = require("../../core/service/picture.service");
export default {
  data() {
    return {
      files: [],
      uid: "",
      uploadsuccess: true,
      localImage: {
        addimgsbtn: uni.server.localImageUrl + "addimgsbtn.png",
      },
      showAdd: true,
      count: 0,
    };
  },
  options: {
    addGlobalClass: true,
    multipleSlots: true,
  },
  props: {
    tableId: {
      type: String,
      default: undefined,
    },
    tableName: {
      type: String,
      default: undefined,
    },
    customType: {
      type: Number,
      default: undefined,
    },
    readonly: {
      type: Boolean,
      default: undefined,
    },
    maxLength: {
      type: Number,
      default: undefined,
    },
  },
  mounted: function () {
    this.setData({
      uid: this.guid()("uploader"),
    });
  },
  watch: {
    tableId: {
      handler: function (tableId) {
        if (tableId) {
          var { tableName, customType } = this;

          var _this = this;

          pictureService
            .getPictureList({
              bindTableName: tableName,
              bindTableId: tableId,
              customType: customType,
            })
            .then((d) => {
              _this.setData({
                files: d.map((s) => ({
                  url: transformAssetsUrl(s.filePath),
                  key: s.id,
                  isdetail: true,
                  size: s.fileSize,
                })),
              });
            })
            .catch((e) => {
              uni.showToast({
                title: `${
                  (e === null || e === void 0 ? void 0 : e.errmsg) || e
                }`,
                icon: "none",
                duration: 2000,
              });
            });
        }
      },

      immediate: true,
      deep: true,
    },
  },
  methods: {
    guid() {
      let counter = 0;
      return (prefix) => {
        let uid = (+new Date()).toString(32);
        let i = 0;
        for (; i < 5; i++) {
          uid += Math.floor(Math.random() * 65535).toString(32);
        }

        return (prefix || "wu_") + uid + (counter++).toString(32);
      };
    },

    saveAttach: function (id) {
      var { tableName, customType } = this;
      var files = this.files.filter(
        (x) => !x.isdetail && x.key && !x.isdel && x.id
      );

      if (!files.length) {
        return;
      }

      var data = {
        addIds: files.map((x) => x.id),
        bindTableId: id,
        bindTableName: tableName,
        customType: customType,
        deleteIds: this.files.filter((x) => x.isdel).map((x) => x.id),
        fileUsage: files.map((x, index) => ({
          attachId: x.id,
          fileUsage: "",
          sequence: index,
        })),
        uploadId: this.uid,
      };
      pictureService
        .post(data)
        .then((d) => {
          if (d) {
            this.$emit("saveAttachSuccess", {
              detail: d,
            });
          }
        })
        .catch((e) => {
          console.log("uploadFile", e);
          uni.showToast({
            title: `${(e === null || e === void 0 ? void 0 : e.errmsg) || e}`,
            icon: "none",
            duration: 2000,
          });
        });
    },

    hasAddFiles() {
      var { files } = this;

      if (files) {
        const fileterArr = files.filter((item) => {
          return !item.isdel;
        });
        return fileterArr.length ? true : false;
      } else {
        return false;
      }
    },

    del: function (e) {
      var { files } = this;
      files[e.currentTarget.dataset.index].isdel = true;
      let fileLength = (files.filter((x) => !x.isdel) || []).length;

      if (fileLength < this.maxLength) {
        this.setData({
          showAdd: true,
        });
      }

      this.setData({
        files,
      });
    },
    updata: function () {
      var { files, count } = this;
      files.forEach((file) => {
        if (file.key) {
          return;
        }

        file.key = this.guid()("uploader");
        var that = this;
        var type = file.url.split(".")[1];
        uni.uploadFile({
          url: `${uni.server.url}attach/picture/upload-chunk/${this.uid}`,
          header: {
            Authorization: getCurrentToken(),
          },
          filePath: file.url,
          name: "file",
          formData: {
            id: file.key,
            name: file.key + `.${type}`,
            type: `image/${type}`,
            lastModifiedDate: formatNow("yyyy-MM-dd hh:mm:ss"),
            size: file.size,
          },
          success: (res) => {
            that.$emit("upAttachSuccess", {
              detail: JSON.parse(res.data || "{}"),
            });
            file.id = JSON.parse(res.data || "{}").fileId;
            count++;

            if (count === files.length) {
              that.setData({
                files,
                uploadsuccess: true,
              });
            }

            that.setData({
              count,
            });
          },
          fail: (e) => {
            console.log("uploadFile", e);
          },
        });
      });
    },

    checkPicture(res) {
      let files = this.files;

      if (files) {
        files.forEach((element) => {
          let tem;
          res.tempFiles.forEach((e, i) => {
            if (element.size === e.size) {
              tem = `${i}`;
            }
          });

          if (tem) {
            res.tempFiles.splice(+tem, 1);
          }
        });
      }
    },

    chooseImage: function () {
      var that = this;
      uni.chooseImage({
        sizeType: ["original", "compressed"],
        sourceType: ["album", "camera"],
        success: function (res) {
          that.checkPicture(res);
          let files = [];
          let maxLength = that.maxLength || 9;
          let fileLength = (that.files.filter((x) => !x.isdel) || []).length;
          let tempFilePaths = res.tempFiles;
          if (fileLength + res.tempFilePaths.length < maxLength) {
            files = tempFilePaths.map((s) => ({
              url: s.path,
              size: s.size,
            }));
            that.setData({
              showAdd: true,
            });
          } else {
            if (
              fileLength <= maxLength &&
              fileLength + tempFilePaths.length >= maxLength
            ) {
              tempFilePaths.map((s, index) => {
                if (index < maxLength - fileLength) {
                  files.push({
                    url: s.path,
                    size: s.size,
                  });
                }
              });
              that.setData({
                showAdd: false,
              });
            } else {
              if (fileLength >= maxLength) {
                that.setData({
                  showAdd: false,
                });
              } else {
                that.setData({
                  showAdd: true,
                });
              }
            }
          }

          that.setData({
            uploadsuccess: false,
          });
          that.setData(
            {
              files: that.files.concat(files),
            },
            that.updata.bind(that)
          );
        },
      });
    },
    previewImage: function (e) {
      uni.previewImage({
        current: e.currentTarget.id,
        urls: this.files.map((s) => s.url),
      });
    },

    checkState() {
      if (!this.uploadsuccess) {
        return false;
      }

      return true;
    },
  },
};
</script>
<style scoped>
@import "./uni-picture.css";
</style>
