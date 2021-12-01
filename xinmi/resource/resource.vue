<template>
  <view>
    <view class="phone-warp" v-if="!show">
      <view class="page-body">
        <super-scroll-view
          :showFooter="showFooter"
          class="phone-body"
          @lower="lower"
          @pulldown="pulldown"
          :refreshertriggered="refreshertriggered"
        >
          <view class="map-box">
            <map
              id="myMap"
              style="width: 100%; height: 800rpx"
              :scale="10"
              :polyline="polygons"
              :latitude="latitude"
              :longitude="longitude"
              :show-location="true"
              :markers="markers"
              @regionchange="handleRegionchange"
              @markertap="markertap"
              @callouttap="markertap"
            ></map>
            <view class="map-search">
              <view class="blod size-18">新密市</view>
              <view class="tabs-button mt5">
                <text
                  :class="tabIndex == index ? 'active' : ''"
                  @click="selectIndex"
                  :data-index="index"
                  v-for="(item, index) in tabsButton"
                  :key="item.key"
                >
                  {{ item }}
                </text>
              </view>
            </view>
          </view>
          <view class="radius-body">
            <view class="list-card">
              <view class="card-list-item pv-0">
                <view class="header size-18"
                  >新密市{{ tabsButton[tabIndex] }}</view
                >
                <view class="tabs-button">
                  <text
                    :class="tabIndex2 == index ? 'active' : ''"
                    @click="selectIndex2"
                    :data-index="index"
                    v-for="(item, index) in resourceType"
                    :key="item.key"
                  >
                    {{ item.resourceType }}({{ item.totalCount }})
                  </text>
                </view>
                <view class="flex down-box mt15">
                  <block
                    v-if="
                      tabIndex === 0 ||
                      (tabIndex === 1 && index == TagTypeEnum.resourceArea) ||
                      (tabIndex === 2 && index === TagTypeEnum.resourceRegion)
                    "
                  >
                    <view
                      class="flex-item"
                      v-for="(item, index) in selectData"
                      :key="index"
                    >
                      <view class="size-12">{{ item }}</view>

                      <view class="pick-box">
                        <picker
                          @change="bindPickerChange"
                          :data-index="index"
                          :value="
                            index === TagTypeEnum.resourceRegion
                              ? resourceRegionIndex
                              : index === TagTypeEnum.industryLocation
                              ? industryLocationIndex
                              : index === TagTypeEnum.resourceArea
                              ? resourceAreaIndex
                              : servicePackIndex
                          "
                          :range="
                            index === TagTypeEnum.resourceRegion
                              ? lowRegions
                              : index === TagTypeEnum.industryLocation
                              ? industryLocation
                              : index === TagTypeEnum.resourceArea
                              ? resourceArea
                              : servicePack
                          "
                          range-key="label"
                        >
                          <view class="flex">
                            <view class="flex-item">
                              <text class="size-12 omit omit-1">
                                {{
                                  index === TagTypeEnum.resourceRegion
                                    ? lowRegions[resourceRegionIndex].tagName
                                    : index === TagTypeEnum.industryLocation
                                    ? industryLocation[industryLocationIndex]
                                        .tagName
                                    : index === TagTypeEnum.resourceArea
                                    ? resourceArea[resourceAreaIndex].tagName
                                    : servicePack[servicePackIndex].tagName
                                }}
                              </text>
                            </view>
                            <view class="text-right">
                              <text
                                class="ieb ieb-down size-12 pull-right blod"
                              ></text>
                            </view>
                          </view>
                        </picker>
                      </view>
                    </view>
                  </block>
                </view>

                <view class="whitespace-md dark"></view>

                <block
                  @click.native="readItem"
                  :data-item="item"
                  v-for="(item, index) in resourceList"
                  :key="index"
                >
                  <navigator
                    :url="
                      '/xinmi/details/details?markerId=' +
                      item.id +
                      '&resourceTypeValue=' +
                      item.resourceTypeValue
                    "
                    class="card dark"
                  >
                    <view class="flex">
                      <view class="flex-item">
                        <view class="title omit omit-1">{{
                          item.resourceName
                        }}</view>
                        <view class="omit omit-1 mt5" v-if="tabIndex < 2">
                          <text
                            class="default-tag"
                            v-for="(log, idx) in item.tags"
                            :key="idx"
                            >{{ log }}</text
                          >
                        </view>
                        <view
                          class="omit omit-1 size-12 mt10"
                          v-if="tabIndex === 0"
                        >
                          <text class="gray-three-color">面积：</text>
                          {{ item.resourceArea || "-"
                          }}{{ item.resourceTypeValue === "5" ? "k" : "" }}㎡
                        </view>
                        <view class="omit omit-1 size-12 mt10">
                          <text class="gray-three-color">地址：</text>
                          {{ item.address }}
                        </view>
                      </view>
                      <view class="vr-tag">
                        <uni-picture
                          class="images-auto"
                          :tableId="item.id"
                          tableName="BILocationResource"
                          :readonly="true"
                          :maxLength="1"
                        ></uni-picture>
                      </view>
                    </view>
                  </navigator>
                </block>
                <no-data v-if="resourceList.length === 0" />
              </view>
            </view>
          </view>
        </super-scroll-view>
      </view>
    </view>

    <view class="phone-warp" v-if="show">
      <view class="page-body">
        <view class="select-list">
          <view
            class="select-item"
            v-for="(item, index) in selectDatas"
            :key="index"
          >
            <view class="title">{{ item.title }}</view>

            <view class="body">
              <text
                :class="
                  'tag ' +
                  (selectDatas[index].tag[idx].isChecked ? 'active' : '')
                "
                @click="selectChange"
                :data-index="index"
                :data-idx="idx"
                v-for="(tag, idx) in item.tag"
                :key="tag.idx"
              >
                {{ tag.tagName }}
              </text>
            </view>
          </view>
        </view>
      </view>
      <view class="weui-flex footer flex-collapse">
        <view class="weui-flex__item">
          <a class="weui-btn weui-btn_primary" @click.native="reset">重置</a>
        </view>
        <view class="weui-flex__item">
          <a class="weui-btn weui-btn_primary" @click.native="submit">确定</a>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
// pages/index/index.js
// 新密市边界
const {
  industrialMapHttpService,
} = require("../../pages/index/service/index.service");

const { city } = require("../../pages/index/common");
const { ResourceTypeEnum, TagTypeEnum } = require("./common");

export default {
  data() {
    return {
      TagTypeEnum: TagTypeEnum,
      resourceRegionIndex: 0,
      industryLocationIndex: 0,
      resourceAreaIndex: 0,
      servicePackIndex: 0,
      resourceRegionName: "",
      industryLocationValues: "",
      resourceAreaBegin: "",
      resourceAreaEnd: "",
      servicePackValues: "",
      selectData: ["所在区域", "产业定位", "面积", "服务配套"],
      tabIndex: 0,
      tabIndex2: 0,
      tabsButton: ["空间资源", "创新资源", "配套资源"],
      down: false,
      tagName: "",
      selectDatas: [],

      mapData: [],

      index: 0,
      type: false,
      selected: 0,
      markers: [],
      customMarkers: [],
      points: [],
      polygons: [],

      setting: {
        scale: "9.8",
        longitude: 113.42507561061822,
        latitude: 34.54309932463642,
      },

      longitude: 113.42507561061822,
      latitude: 34.54309932463642,
      tagList: ["新材料"],

      tabs: [
        {
          name: "新密概览",
          id: "1",
        },
        {
          name: "重点产业",
          id: "2",
        },
      ],

      show: false,
      resourceTypeValues: Number,
      industryLocationLabel: "",
      industryLocationArr: [],

      resourceList: [],

      pageIndex: Number,
      showFooter: true,
      loadingHidden: false,
      refreshertriggered: false,
      info: {},
      resourceType: [],
      tags: {},
      industryLocationArrValue: [],

      industryLocation: [{ tagName: "不限", label: "不限", children: [] }],

      resourceArea: [{ tagName: "不限", label: "不限", children: [] }],

      servicePack: [{ tagName: "不限", label: "不限", children: [] }],

      lowRegions: [{ tagName: "不限", label: "不限", children: [] }],

      fullLowRegions: [],

      isChecked: false,
    };
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let index = +options.tabIndex || ResourceTypeEnum.resourceSpace;
    this.setData({
      show: options.show,
      tabIndex: index,
    });
    this.getLowRegion(index + 1);
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log(this);
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getSpaceResourcePage({
      pageIndex: this.pageIndex + 1,
    });
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (opts) {
    console.log(opts.target);
    return {};
  },
  methods: {
    /**
     * 项目选址
     * @param e
     */
    selectChange: function (e) {
      const state = this;
      let selectDatas = state.selectDatas,
        resourceType = state.resourceType,
        fullLowRegions = state.fullLowRegions,
        industryLocation = state.industryLocation,
        resourceArea = state.resourceArea,
        servicePack = state.servicePack;

      /**
       * index 标签项序号
       * idx 标签序号
       */
      let idx = +e.currentTarget.dataset.idx,
        index = +e.currentTarget.dataset.index;

      /**
       * 选中的标签设为true
       */
      selectDatas = (selectDatas || []).map((item, i) => {
        if (i === index) {
          item.tag = (item.tag || []).map((it, _i) => {
            it.isChecked = false;
            if (_i === idx) {
              it.isChecked = true;
            }
            return it;
          });
        }
        return item;
      });

      this.setData({
        selectDatas,
      });

      if (index === TagTypeEnum.resourceType + 1) {
        /**
         * 资源类型
         */
        if (idx > 0) {
          this.getSpaceResourcePage({
            resourceTypeValues: resourceType[idx - 1].resourceTypeValue,
          });
          this.setData({ tabIndex2: idx - 1 });
        } else {
          this.getSpaceResourcePage({
            resourceTypeValues: resourceType[0].resourceTypeValue,
          });
          this.setData({ tabIndex2: "" });
        }
      } else if (index === TagTypeEnum.resourceRegion + 1) {
        /**
         * 位置
         */
        let resourceRegionName = fullLowRegions[idx].tagValue;
        this.getSpaceResourcePage({ resourceRegionName });
        this.setData({ resourceRegionIndex: idx, resourceRegionName });
      } else if (index === TagTypeEnum.industryLocation + 1) {
        /**
         * 产业定位
         */
        let industryLocationValues =
          industryLocation[idx].tagFullValues || industryLocation[idx].tagValue;
        this.getSpaceResourcePage({ industryLocationValues });
        this.setData({ industryLocationIndex: idx, industryLocationValues });
      } else if (index === TagTypeEnum.resourceArea + 1) {
        /**
         * 用地面积
         */
        let tagValue = resourceArea[idx].tagValue || "";
        let data = { resourceAreaBegin: "", resourceAreaEnd: "" };
        if (tagValue.endsWith("d")) {
          data = {
            resourceAreaBegin: "",
            resourceAreaEnd: tagValue.split("d")[0],
          };
        } else if (tagValue.endsWith("u")) {
          data = {
            resourceAreaBegin: tagValue.split("u")[0],
            resourceAreaEnd: "",
          };
        } else if (tagValue.length > 0) {
          data = {
            resourceAreaBegin: tagValue.split("-")[0],
            resourceAreaEnd: tagValue.split("-")[1],
          };
        }
        this.getSpaceResourcePage(data);
        this.setData({ resourceAreaIndex: idx, ...data });
      } else {
        /**
         * 服务配套
         */
        let servicePackValues = servicePack[idx].tagValue;
        this.getSpaceResourcePage({ servicePackValues });
        this.setData({ servicePackIndex: idx, servicePackValues });
      }
    },

    reset: function () {
      const state = this;
      let selectDatas = state.selectDatas;

      /**
       * 第一个标签设为true
       */
      selectDatas = (selectDatas || []).map((item, _i) => {
        item.tag = (item.tag || []).map((it, _i) => {
          it.isChecked = false;
          if (_i === 0) {
            it.isChecked = true;
          }
          return it;
        });
        return item;
      });

      /**
       * 数据重置
       */
      this.setData({
        selectDatas,
        resourceRegionName: "",
        industryLocationValues: "",
        resourceAreaBegin: "",
        resourceAreaEnd: "",
        servicePackValues: "",
      });
    },

    submit() {
      // this.getSpaceResourcePage({})
      this.setData({
        show: false,
      });
    },

    mapMaker: function (mapDatas) {
      let markerList = [];
      let customList = [];
      // 新密市坐标行政区边界
      const state = this,
        mapData = mapDatas || state.mapData;
      mapData.map((item, _i) => {
        markerList.push({
          iconPath: "https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png", // connectlocalUrl("marker.svg"),
          id: item.id,
          longitude: item.longitude,
          latitude: item.latitude,
          callout: {
            content: item.name + " >>",
            color: "#fff",
            fontSize: 12,
            borderRadius: 3,
            // 'BYCLICK':点击显示; 'ALWAYS':常显
            display: "BYCLICK",
            bgColor: "#3399ff",
            padding: 6,
            anchorY: 10,
          },
          width: 18,
          height: 24,
        });
        customList.push({
          id: item.id,
          name: item.name,
        });
      });
      setTimeout(() => {
        let path = [];
        city.map((item, _i) => {
          path.push({
            latitude: item.lat,
            longitude: item.lng,
          });
        });
        this.setData({
          markers: markerList,
          customMarkers: customList,
          polygons: [
            {
              points: path,
              color: "#3399ff", //线的颜色
              width: 1, //线的宽度
              dottedLine: false, //是否虚线
              arrowLine: true, //带箭头的线 开发者工具暂不支持该属性
            },
          ],
        });
      }, 1000);
    },

    handleRegionchange: function (_ev) {
      this.mapCtx = uni.createMapContext("myMap");
      this.mapCtx.getCenterLocation({
        success(res) {
          console.log(res.longitude, "经度", res.latitude, "纬度");
        },
      });
    },

    /**
     * marker点击事件
     */
    markertap(e) {
      /**
       * 手机上
       */
      let id = e.detail.markerId;
      const state = this,
        mapData = state.mapData;
      let find = mapData.find((item) => item.id === id);
      let resourceTypeValue = find.resourceTypeValue;
      uni.navigateTo({
        url: `/xinmi/details/details?markerId=${e.detail.markerId}&resourceTypeValue=${resourceTypeValue}`,
      });
      /**
       * 开发工具调试 开发者工具上获取的markerId并非绑定的id
       */
      // let index = e.detail.markerId - 900000000;
      // const state = this,
      //   mapData = state.mapData;
      // index = index % mapData.length;
      // let id = mapData[index].id,
      //   resourceTypeValue = mapData[index].resourceTypeValue;
      // console.log(index, id)
      // uni.navigateTo({
      //   url: `/xinmi/details/details?markerId=${id}&resourceTypeValue=${resourceTypeValue}`
      // })
    },

    changTabs: function (e) {
      this.setData({
        selected: e.currentTarget.dataset.index,
      });
    },

    //   标签选中效果
    selectIndex: function (e, idx) {
      this.setData({
        resourceRegionIndex: 0,
        industryLocationIndex: 0,
        resourceAreaIndex: 0,
        servicePackIndex: 0,
        resourceRegionName: "",
        industryLocationValues: "",
        resourceAreaBegin: "",
        resourceAreaEnd: "",
        servicePackValues: "",
        tabIndex2: 0,
      });
      const index = idx
        ? +idx
        : e.currentTarget.dataset.index
        ? e.currentTarget.dataset.index
        : 0;
      this.getLowRegion(index + 1);
      this.setData({
        tabIndex: index,
      });
    },

    //   标签选中效果
    selectIndex2: function (e) {
      this.setData({
        resourceRegionIndex: 0,
        industryLocationIndex: 0,
        resourceAreaIndex: 0,
        servicePackIndex: 0,
        resourceRegionName: "",
        industryLocationValues: "",
        resourceAreaBegin: "",
        resourceAreaEnd: "",
        servicePackValues: "",
      });
      let index = e.currentTarget.dataset.index;
      this.getTags(null, null, null, index);
      this.getOneRegion(this.tabIndex + 1, null, index);
      let resourceTypeValues = this.resourceType[index].resourceTypeValue;
      this.getSpaceResourcePage({ resourceTypeValues });
      this.setData({
        tabIndex2: index,
        resourceTypeValues,
      });
    },

    // 选择器
    bindPickerChange: function (e) {
      const state = this;
      let lowRegions = state.lowRegions,
        industryLocation = state.industryLocation,
        resourceArea = state.resourceArea,
        servicePack = state.servicePack;

      this.setData({
        index: e.detail.value,
      });
      const index = e.currentTarget.dataset.index,
        value = +e.detail.value;
      if (index === TagTypeEnum.resourceRegion) {
        /**
         * 位置
         */
        let resourceRegionName = lowRegions[value].tagValue;
        console.log("resourceRegionName", resourceRegionName);
        this.getSpaceResourcePage({ resourceRegionName });
        this.setData({ resourceRegionIndex: value, resourceRegionName });
      } else if (index === TagTypeEnum.industryLocation) {
        /**
         * 产业定位
         */
        let industryLocationValues =
          industryLocation[value].tagFullValues ||
          industryLocation[value].tagValue;
        this.getSpaceResourcePage({ industryLocationValues });
        this.setData({ industryLocationIndex: value, industryLocationValues });
      } else if (index === TagTypeEnum.resourceArea) {
        /**
         * 用地面积
         */
        let tagValue = resourceArea[value].tagValue || "";
        let data = { resourceAreaBegin: "", resourceAreaEnd: "" };
        if (tagValue.endsWith("d")) {
          data = {
            resourceAreaBegin: "",
            resourceAreaEnd: tagValue.split("d")[0],
          };
        } else if (tagValue.endsWith("u")) {
          data = {
            resourceAreaBegin: tagValue.split("u")[0],
            resourceAreaEnd: "",
          };
        } else if (tagValue.length > 0) {
          data = {
            resourceAreaBegin: tagValue.split("-")[0],
            resourceAreaEnd: tagValue.split("-")[1],
          };
        }
        this.getSpaceResourcePage(data);
        this.setData({ resourceAreaIndex: value, ...data });
      } else {
        /**
         * 服务配套
         */
        let servicePackValues = servicePack[value].tagValue;
        this.getSpaceResourcePage({ servicePackValues });
        this.setData({ servicePackIndex: value, servicePackValues });
      }
    },

    // 展开多选
    downText: function (e) {
      this.setData({
        down: e.currentTarget.dataset.index,
      });
    },

    bindRegionChange(e) {
      let detailValue = e.detail.value;
      let industryLocationArr = this.industryLocationArr[0];
      let industryLocation1 = industryLocationArr[detailValue[0]];
      let industryLocation2 = industryLocation1.children[detailValue[1]] || {};
      /**
       * 产业定位
       * ToDo：tagValue改为？？tagFullValues
       */
      let industryLocationValues =
        industryLocation2.tagFullValues ||
        industryLocation1.tagFullValues ||
        industryLocation2.tagValue ||
        industryLocation1.tagValue ||
        "";
      this.getSpaceResourcePage({ industryLocationValues });
      this.setData({
        industryLocationLabel:
          industryLocation2.label || industryLocation1.label || "",
        industryLocationValues,
      });
    },

    bindcolumnchange(e) {
      let detailValue = e.detail.value;
      let detailColumn = e.detail.column;
      let industryLocationArr = this.industryLocationArr[0];

      if (detailColumn === 0) {
        this.setData({
          industryLocationArr: [
            industryLocationArr,
            industryLocationArr[detailValue].children,
          ],
        });
      }
    },
    /**
     * 项目选址-空间资源查询
     * @param id
     */
    async getSpaceResourcePage(parm) {
      try {
        const state = this;
        let resourceRegionName = state.resourceRegionName || "新密市",
          industryLocationValues = state.industryLocationValues || "",
          servicePackValues = state.servicePackValues || "",
          resourceAreaBegin = state.resourceAreaBegin || "",
          resourceAreaEnd = state.resourceAreaEnd || "",
          resourceTypeValues = state.resourceTypeValues;

        console.warn(resourceRegionName);
        let info = await industrialMapHttpService.spaceResourcePage({
          pageSize: 25,
          resourceTypeValues,
          resourceRegionName,
          industryLocationValues,
          servicePackValues,
          resourceAreaBegin,
          resourceAreaEnd,
          ...parm,
        });
        (info.items || []).map((item) => {
          item.tags = item.industryLocations.split(",");
        });

        (info.items || []).map((item) => {
          item.name = item.resourceName;
          item.longitude = item.itude ? +item.itude.split(",")[0] : "";
          item.latitude = item.itude ? +item.itude.split(",")[1] : "";
          return item;
        });

        this.mapMaker(info.items);

        this.setData({
          resourceList:
            info.currentPage <= 1
              ? info.items
              : [...this.resourceList, ...info.items],
          pageIndex: info.currentPage,
          showFooter:
            info.totalPages > 0 && info.currentPage >= info.totalPages,
          loadingHidden: true,
          refreshertriggered: false, // 结束下拉刷新状态
        });
        this.setData({
          info,
          mapData: info.items,
          loadingHidden: true,
        });
      } catch (e) {
        uni.showToast({
          title: `${e.errmsg || e}`,
          icon: "none",
          duration: 2000,
        });
      }
    },

    /**
     * 获取资源类型数量统计
     * @param id
     */
    async resourceTypeCount(index, lowRegion) {
      try {
        let tags = await industrialMapHttpService.resourceTypeCount({
          tagClass: "LOCATION/ZIYLX",
          /**
           * 数据来源（1：资源上报，2：后台添加）
           */
          dataSources: 2,
          /**
           * 资源分组 1：空间资源 2：创新服务资源 3：生产生活资源
           */
          resourceGroup: index || 1,
          resourceRegionName: "新密市",
          /**
           * 资源状态（-999：暂存，-1：已下架，999：已上架）
           */
          resourceStatus: 999,
        });
        let resourceType = tags;
        resourceType = resourceType.filter((v) => v.resourceTypeValue !== "4");
        console.log("resourceType", resourceType);
        resourceType = resourceType.map((item) => {
          item.tagName = item.resourceType;
          item.tagValue = item.resourceTypeValue;
          item.resourceCount = item.totalCount;
          return item;
        });
        this.getTags(index, lowRegion, resourceType);
        this.getOneRegion(index, resourceType);
        this.getSpaceResourcePage({
          resourceTypeValues: resourceType[0].resourceTypeValue,
        });
        this.setData({
          resourceType: resourceType,
          resourceTypeValues: resourceType[0].resourceTypeValue,
        });
      } catch (e) {
        uni.showToast({
          title: `${e.errmsg || e}`,
          icon: "none",
          duration: 2000,
        });
      }
    },

    async getTags(index, lowRegion, resourceType, idx) {
      try {
        const state = this,
          lowRegions = lowRegion || state.lowRegions,
          resourceTypes = resourceType || state.resourceType;

        const tags = await industrialMapHttpService.getTagByTagClasses({
          tagClass:
            "LOCATION/CHANYDW,LOCATION/FUWPT,LOCATION/ZIYLX,INDUSTRIAL/YONGDMJ",
          /**
           * 数据来源（1：资源上报，2：后台添加）
           */
          dataSources: 2,
          /**
           * 资源分组 1：空间资源 2：创新服务资源 3：生产生活资源
           */
          resourceGroup: index || state.tabIndex + 1 || 1,
          resourceRegionName: "新密市",
          resourceTypeValues: resourceTypes[idx || 0].resourceTypeValue,
          /**
           * 资源状态（-999：暂存，-1：已下架，999：已上架）
           */
          resourceStatus: 999,
        });
        let location = tags["LOCATION/CHANYDW"];
        let industryLocation = tags["LOCATION/CHANYDW"]; //.filter((v: { resourceCount; }) => v.resourceCount > 0);
        industryLocation = industryLocation
          .filter((v) => v.parentId === "0")
          .map((item) => {
            item.children = [];
            industryLocation.map((s) => {
              // console.log(s)
              if (s.parentId === item.id) {
                s = {
                  ...s,
                  label: s.tagName
                    ? s.tagName + "(" + s.resourceCount + ")"
                    : "",
                  value: parseInt(s.tagValue, 10),
                };
                item.children.push(s);
              }
            });
            return (item = {
              ...item,
              label: item.tagName
                ? item.tagName + "(" + item.resourceCount + ")"
                : "",
              value: parseInt(item.tagValue, 10),
            });
          });

        tags["LOCATION/CHANYDW"] = industryLocation;

        (tags["INDUSTRIAL/YONGDMJ"] || []).map((item) => {
          item.label = item.tagName + "(" + item.resourceCount + ")";
          return item;
        });

        (tags["LOCATION/FUWPT"] || []).map((item) => {
          item.label = item.tagName + "(" + item.resourceCount + ")";
          return item;
        });

        let selectDatas = [
          {
            title: "资源类型",
            tag: [{ tagName: "不限", label: "不限", isChecked: true }].concat(
              resourceTypes
            ),
          },
          {
            title: "位置",
            tag: lowRegions,
          },
          {
            title: "产业定位",
            tag: [{ tagName: "不限", label: "不限", isChecked: true }].concat(
              location
            ),
          },
          {
            title: "用地面积",
            tag: [{ tagName: "不限", label: "不限", isChecked: true }].concat(
              tags["INDUSTRIAL/YONGDMJ"]
            ),
          },
          {
            title: "服务配套",
            tag: [{ tagName: "不限", label: "不限", isChecked: true }].concat(
              tags["LOCATION/FUWPT"]
            ),
          },
        ];

        tags["LOCATION/CHANYDW"] = [
          { tagName: "不限", label: "不限", children: [] },
        ].concat(tags["LOCATION/CHANYDW"]);
        tags["INDUSTRIAL/YONGDMJ"] = [
          { tagName: "不限", label: "不限" },
        ].concat(tags["INDUSTRIAL/YONGDMJ"]);
        tags["LOCATION/FUWPT"] = [{ tagName: "不限", label: "不限" }].concat(
          tags["LOCATION/FUWPT"]
        );

        // location = location.filter((v: { resourceCount; layer }) => v.resourceCount > 0);
        (location || []).map((item) => {
          item.label = item.tagName + "(" + item.resourceCount + ")";
          return item;
        });
        this.setData({
          selectDatas,
          tags: tags,
          industryLocationArrValue: [0, 0],
          industryLocationArr: [
            tags["LOCATION/CHANYDW"],
            tags["LOCATION/CHANYDW"][0].children,
          ],
          industryLocation: [
            { tagName: "不限", label: "不限", children: [] },
          ].concat(location),
          resourceArea: tags["INDUSTRIAL/YONGDMJ"],
          servicePack: tags["LOCATION/FUWPT"],
        });
      } catch (e) {
        uni.showToast({
          title: `${e.errmsg || e}`,
          icon: "none",
          duration: 2000,
        });
      }
    },

    /**
     * 获取一级空间区域信息
     * @param id
     */
    async getOneRegion(index, resourceType, idx) {
      try {
        const state = this,
          resourceTypes = resourceType || state.resourceType;
        let info = await industrialMapHttpService.resourceRegionCount({
          /**
           * 数据来源（1：资源上报，2：后台添加）
           */
          dataSources: 2,
          /**
           * 资源分组 1：空间资源 2：创新服务资源 3：生产生活资源
           */
          resourceGroup: index || 1,
          resourceRegionName: "新密市",
          /**
           * 资源状态（-999：暂存，-1：已下架，999：已上架）
           */
          resourceStatus: 999,
          showZero: true,
          resourceTypeValues: resourceTypes[idx || 0].resourceTypeValue,
        });
        info = (info || []).map((item) => {
          item.tagName = item.resourceRegionName;
          item.label = item.resourceRegionName
            ? item.resourceRegionName + "(" + item.resourceCount + ")"
            : " ";
          item.tagValue = item.resourceRegionName;
          return item;
        });
        // info = info.filter((item: { tagValue; resourceCount; }) => item.tagValue && item.resourceCount > 0)
        let lowRegions = [
          { tagName: "不限", label: "不限", isChecked: true },
        ].concat(info);
        this.setData({
          lowRegions,
          loadingHidden: true,
        });
      } catch (e) {
        uni.showToast({
          title: `${e.errmsg || e}`,
          icon: "none",
          duration: 2000,
        });
      }
    },

    async getLowRegion(index) {
      try {
        let info = await industrialMapHttpService.resourceRegionCount({
          /**
           * 数据来源（1：资源上报，2：后台添加）
           */
          dataSources: 2,
          /**
           * 资源分组 1：空间资源 2：创新服务资源 3：生产生活资源
           */
          resourceRegionName: "新密市",
          /**
           * 资源状态（-999：暂存，-1：已下架，999：已上架）
           */
          resourceStatus: 999,
          showZero: true,
        });
        info = (info || []).map((item) => {
          item.tagName = item.resourceRegionName;
          item.label = item.resourceRegionName
            ? item.resourceRegionName + "(" + item.resourceCount + ")"
            : " ";
          item.tagValue = item.resourceRegionName;
          return item;
        });
        let lowRegions = [
          { tagName: "不限", label: "不限", isChecked: true },
        ].concat(info);
        this.resourceTypeCount(index, lowRegions);
        this.setData({
          fullLowRegions: lowRegions,
          loadingHidden: true,
        });
      } catch (e) {
        uni.showToast({
          title: `${e.errmsg || e}`,
          icon: "none",
          duration: 2000,
        });
      }
    },

    lower() {
      this.getSpaceResourcePage({
        pageIndex: this.pageIndex + 1,
      });
    },

    pulldown(e) {
      console.log("pulldown");
      this.setData({
        refreshertriggered: true, // 下拉刷新状态
      });

      this.getSpaceResourcePage({
        pageIndex: 1,
      });
      // uni.stopPullDownRefresh(); //刷新数据之后停止刷新效果
    },

    readItem() {
      console.log("占位：函数 readItem 未声明");
    },
  },
};
</script>
<style>
@import "./resource.css";
</style>
