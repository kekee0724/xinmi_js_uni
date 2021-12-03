<template>
  <view>
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
          <view class="blod flex size-18">
            新密市
            <text class="ieb ieb-right blod link-color margin-h"></text>
            <picker
              @change="bindPickerChange"
              :value="resourceRegionIndex"
              :range="lowRegions"
              v-if="lowRegions.length > 0"
              range-key="tagName"
              :data-index="0"
            >
              {{ info.resourceName }}
              <text class="ieb ieb-down size-12 pull-right blod"></text>
            </picker>
          </view>
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
        <block v-if="tabIndex === 0">
          <view class="list-card">
            <view class="card-list-item pv-0">
              <view class="header size-18">{{ info.resourceName }}概览</view>
              <view class="card dark">
                <view class="title">产业竞争力</view>
                <view class="body">
                  <view
                    class="text-list"
                    v-for="(item, index) in industryCompetitiveness"
                    :key="index"
                  >
                    <view class="li" v-if="item">{{ item }}</view>
                  </view>
                </view>
              </view>
              <view class="card dark">
                <view class="title">产业定位</view>
                <view class="body">
                  <view class="select-tag">
                    <text
                      :class="tagSelected === index ? '' : ''"
                      :data-index="index"
                      v-for="(item, index) in tagList"
                      :key="index"
                      >{{ item }}</text
                    >
                  </view>
                </view>
              </view>

              <view class="card dark">
                <view class="title">产业概况</view>
                <view class="body">
                  <view
                    :class="(down === false ? 'omit omit-5' : '') + ' size-14'"
                  >
                    <text>{{ info.industrySummary }}</text>
                  </view>
                  <view class="text-center size-14 mt10">
                    <text
                      class="link-color"
                      @click="downText"
                      :data-index="!down"
                      >{{ down === false ? "+展开" : "—收起" }}</text
                    >
                  </view>
                </view>
              </view>

              <view class="card dark">
                <view class="title">空间区域基本介绍</view>
                <view class="body">
                  <view
                    :class="(down2 === false ? 'omit omit-5' : '') + ' size-14'"
                  >
                    <text>{{ info.summary }}</text>
                  </view>
                  <view class="text-center size-14 mt10">
                    <text
                      class="link-color"
                      @click="downText2"
                      :data-index="!down2"
                      >{{ down2 === false ? "+展开" : "—收起" }}</text
                    >
                  </view>
                </view>
              </view>

              <view class="card dark">
                <view class="title">龙头企业</view>
                <view class="body mt5">
                  <view class="ent-list">
                    <view
                      class="list-item"
                      v-for="(item, index) in info.ents"
                      :key="index"
                    >
                      <text class="link-color">{{ item.entName }}</text>
                    </view>
                  </view>
                </view>
              </view>
              <view class="card dark">
                <view class="title">联系方式</view>
                <view class="body mt10">
                  <view class="flex">
                    <image
                      class="mr10"
                      :src="image"
                      style="height: 160rpx; width: 160rpx"
                      @click="showPic"
                    ></image>
                    <view class="flex-item size-12 pl10">
                      <view class="omit omit-1">
                        <text class="ieb ieb-party mr5"></text>
                        {{ info.contactPerson }}
                      </view>
                      <view class="omit omit-1">
                        <text class="ieb ieb-marker_fill mr5"></text>
                        {{ info.contactAddress }}
                      </view>
                      <view class="omit omit-1">
                        <text class="ieb ieb-mobile mr5"></text>
                        {{ info.contactTel }}
                      </view>
                    </view>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </block>

        <block v-if="tabIndex !== 0">
          <view class="list-card">
            <view class="card-list-item pv-0">
              <view class="header size-18"
                >{{ info.resourceName }}{{ tabsButton[tabIndex] }}</view
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
                <block v-for="(item, index) in selectData" :key="index">
                  <view
                    class="flex-item"
                    v-if="
                      index !== 0 &&
                      (tabIndex === 1 || (tabIndex === 2 && index !== 2))
                    "
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
                      <view class="omit omit-1 mt5" v-if="tabIndex < 3">
                        <text
                          class="default-tag"
                          v-for="(log, idx) in item.tags"
                          :key="idx"
                          >{{ log }}</text
                        >
                      </view>
                      <view
                        class="omit omit-1 size-12 mt10"
                        v-if="tabIndex === 1"
                      >
                        <text class="gray-three-color">面积：</text>
                        {{ item.resourceArea || "-" }}㎡
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
        </block>
      </view>
    </super-scroll-view>
  </view>
</template>

<script>
// pages/index/index.js
// 新密市边界
const { city } = require("../../pages/index/common");
const {
  importantIndustryHttpService,
  industrialMapHttpService,
  resourceRegionHttpService,
} = require("../../pages/index/service/index.service");

const { TagTypeEnum } = require("../resource/common");

export default {
  data() {
    return {
      refreshertriggered: false, // 结束下拉刷新状态
      TagTypeEnum: TagTypeEnum,
      city: city,
      down: false,
      down2: false,
      mapData: [],
      type: false,
      selected: 0,
      tagSelected: 0,
      markers: [],
      customMarkers: [],
      pageIndex: 1,
      points: [],
      polygons: [],
      setting: {
        scale: "9.8",
        longitude: 113.3878554069446,
        latitude: 34.58342945110673,
      },
      longitude: 113.3878554069446, // 113.3878554069446
      latitude: 34.58342945110673, // 34.500659328587915
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
      selectData: ["所在区域", "产业定位", "面积", "服务配套"],
      tabIndex: 0,
      tabIndex2: 0,
      tabsButton: ["概览", "空间资源", "创新资源", "配套资源"],

      imageWidth: "",
      imageHeight: "",
      image: "",
      industryLocationIndex: 0,
      resourceAreaIndex: 0,
      servicePackIndex: 0,
      resourceRegionName: "",
      industryLocationValues: "",
      resourceAreaBegin: "",
      resourceAreaEnd: "",
      servicePackValues: "",
      resourceTypeValues: "",
      resourceRegionIndex: "",
      industryLocationLabel: "",
      industryLocationArr: [],

      resourceList: [],

      showFooter: true,
      loadingHidden: false,
      refreshertriggered: false,
      infos: [],
      resourceType: [],
      resourceGroup: "",
      tags: {},
      industryLocationArrValue: [],

      industryLocation: [{ tagName: "不限", label: "不限", children: [] }],

      resourceArea: [{ tagName: "不限", label: "不限", children: [] }],

      servicePack: [{ tagName: "不限", label: "不限", children: [] }],

      lowRegions: [{ tagName: "不限", label: "不限", children: [] }],

      lowMap: [],
      path: [],

      info: {
        resourceName: "",
        industrySummary: "",
        summary: "",
        ents: [],
      },

      industryCompetitiveness: [],
      importantIndustry: [],
      importantIndustryDetail: {},
      industryNameValue: "",
      industry: "",
      resourceRegionList: [],
      index: 0,
    };
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getLowRegion(options.markerId);
	if (!wx.cloud) {
	  console.warn("请使用 2.2.3 或以上的基础库以使用createQrCode");
	} else {
	  this.createQrCode(options.markerId);
	}
    this.getImportantIndustry();
    this.setData({
      imageWidth: uni.getSystemInfoSync().windowWidth,
      imageHeight: uni.getSystemInfoSync().windowHeight,
    });
    this.getOneRegion();
    this.resourceTypeCount();
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},
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
  onPullDownRefresh: function () {
    let state = this;
    let tabIndex = state.tabIndex;
    if (tabIndex) {
      this.getSpaceResourcePage({
        pageIndex: 1,
      });
    }

    if (!tabIndex) {
      this.setData({
        refreshertriggered: false,
      });
    }
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let state = this;
    let tabIndex = state.tabIndex;
    if (tabIndex) {
      this.getSpaceResourcePage({
        pageIndex: this.pageIndex + 1,
      });
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (opts) {
    console.log(opts.target);
    return {};
  },
  methods: {
    createQrCode(markerId) {
      wx.cloud
        .callFunction({
          // 请求云函数
          // 云函数getQRCode
          name: "getQRCode",
          data: {
            markerId,
          },
        })
        .then((res) => {
          let image = uni.arrayBufferToBase64(res.result.buffer);
          this.setData({
            image: "data:image/png;base64," + image,
          });
        });
    },

    showPic: function () {
      uni.previewImage({
        // 小程序码,生成后直接预览,前台展示
        urls: [this.image],
        current: this.image,
      });
    },

    mapMaker: function (mapDatas, cities) {
      let markerList = [];
      let customList = [];
      // 新密市坐标行政区边界
      let state = this,
        mapData = mapDatas || state.infos.items || state.mapData || [],
        lowMap = state.lowMap || [];
      mapData = mapData.concat(lowMap);
      // let show = mapData.length === lowMap.length
      // console.log(mapData, lowMap);
      mapData.map((item, _i) => {
        markerList.push({
          iconPath: "https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png", // connectlocalUrl("marker.svg"),
          id: item.id,
          longitude: item.longitude || 113.3878554069446,
          latitude: item.latitude || 34.58342945110673,
          callout: {
            content: item.name + " >>",
            color: "#fff",
            fontSize: 10,
            borderRadius: 3,
            // 'BYCLICK':点击显示; 'ALWAYS':常显
            display: item.id ? "BYCLICK" : "ALWAYS",
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
        let city = cities || state.path || state.city || [];
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
              // strokeWidth: 1,
              // strokeColor: "#3399ff",
              // fillColor: "#3399ff8a",
              // zIndex: 0,
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
      if (id) {
        const state = this,
          mapData = state.mapData;
        let resourceTypeValue = mapData.find(
          (item) => item.id === id
        ).resourceTypeValue;
        uni.navigateTo({
          url: `/xinmi/details/details?markerId=${e.detail.markerId}&resourceTypeValue=${resourceTypeValue}`,
        });
      }
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

    selectTag: function (e) {
      let tagSelected = e.currentTarget.dataset.index;
      this.setData({
        tagSelected,
      });
      const state = this;
      const importantIndustry = state.importantIndustry;
      this.getImportantIndustryDetail(importantIndustry[tagSelected].id);
      this.getResourceRegionList(
        importantIndustry[tagSelected].industryNameValue,
        1
      );
    },

    downText: function (e) {
      this.setData({
        down: e.currentTarget.dataset.index,
      });
    },

    downText2: function (e) {
      this.setData({
        down2: e.currentTarget.dataset.index,
      });
    },

    //   标签选中效果
    selectIndex: function (e, idx) {
      this.setData({
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

      this.resourceTypeCount(index);
      if (index !== 0) {
        this.setData({
          tabIndex: index,
        });
      } else {
        this.mapMaker([]);
        this.setData({
          tabIndex: index,
        });
      }
    },

    //   标签选中效果
    selectIndex2: function (e) {
      let index = e.currentTarget.dataset.index;
      this.getTags(null, null, index);
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
        servicePack = state.servicePack,
        tabIndex = this.tabIndex;
      this.setData({
        index: e.detail.value,
      });
      const index = e.currentTarget.dataset.index,
        value = +e.detail.value;

      let resourceRegionName = lowRegions[+e.detail.value].tagValue;
      if (+tabIndex > 0 && index === TagTypeEnum.resourceRegion)
        this.resourceTypeCount(this.tabIndex, resourceRegionName);

      if (index === TagTypeEnum.resourceRegion) {
        let resourceRegionName = lowRegions[value].tagValue;
        /**
         * 位置
         */
        this.getLowRegion(lowRegions[value].id);
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

    bindRegionChange(e) {
      let detailValue = e.detail.value;
      let industryLocationArr = this.industryLocationArr[0];
      let industryLocation1 = industryLocationArr[detailValue[0]];
      let industryLocation2 = industryLocation1.children[detailValue[1]] || {};
      /**
       * 产业定位
       */
      let industryLocationValues =
        industryLocation2.tagFullValues ||
        industryLocation1.tagFullValues ||
        industryLocation2.tagValue ||
        industryLocation1.tagValue ||
        "";
      this.getSpaceResourcePage({
        industryLocationValues,
      });
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
        let resourceRegionName =
            state.resourceRegionName || state.info.resourceName || "",
          industryLocationValues = state.industryLocationValues || "",
          servicePackValues = state.servicePackValues || "",
          resourceAreaBegin = state.resourceAreaBegin || "",
          resourceAreaEnd = state.resourceAreaEnd || "",
          resourceTypeValues = state.resourceTypeValues;

        if (resourceTypeValues || parm.resourceTypeValues) {
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
            infos: info,
            mapData: info.items || [],
            loadingHidden: true,
          });
        }
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
    async resourceTypeCount(index, regionName) {
      try {
        const state = this,
          info = state.info || {},
          resourceRegionName = regionName || state.resourceRegionName;
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
          resourceRegionName: resourceRegionName || info.resourceName || "",
          /**
           * 资源状态（-999：暂存，-1：已下架，999：已上架）
           */
          resourceStatus: 999,
        });
        let resourceType = tags;
        resourceType = resourceType.filter((v) => v.resourceTypeValue !== "4");
        resourceType = resourceType.map((item) => {
          item.tagName = item.resourceType;
          item.tagValue = item.resourceTypeValue;
          item.resourceCount = item.totalCount;
          return item;
        });
        let firstTypeValue =
          resourceType.length > 0 ? resourceType[0].resourceTypeValue : "";
        firstTypeValue && this.getTags(index, resourceType);
        firstTypeValue &&
          index &&
          this.getSpaceResourcePage({
            resourceTypeValues: firstTypeValue,
          });
        (!firstTypeValue || +index === 0) &&
          this.setData({
            infos: [],
            resourceList: [],
            showFooter: false,
            customMarkers: [],
            mapData: [],
            markers: [],
          });
        this.setData({
          resourceType: resourceType,
          resourceTypeValues: firstTypeValue,
          resourceGroup: index || 1,
        });
      } catch (e) {
        uni.showToast({
          title: `${e.errmsg || e}`,
          icon: "none",
          duration: 2000,
        });
      }
    },

    async getTags(index, resourceType, idx) {
      try {
        const state = this,
          info = state.info || {},
          resourceRegionName = state.resourceRegionName,
          resourceTypes = resourceType || state.resourceType,
          tabIndex = state.tabIndex;

        const tags = await industrialMapHttpService.getTagByTagClasses({
          tagClass: "LOCATION/CHANYDW,LOCATION/FUWPT,INDUSTRIAL/YONGDMJ",
          /**
           * 数据来源（1：资源上报，2：后台添加）
           */
          dataSources: 2,
          /**
           * 资源分组 1：空间资源 2：创新服务资源 3：生产生活资源
           */
          resourceGroup: index || tabIndex || 1,
          resourceRegionName: resourceRegionName || info.resourceName || "",
          resourceTypeValues: resourceTypes[idx || 0].resourceTypeValue,
          /**
           * 资源状态（-999：暂存，-1：已下架，999：已上架）
           */
          resourceStatus: 999,
        });
        let location = tags["LOCATION/CHANYDW"];

        let industryLocation = tags["LOCATION/CHANYDW"];
        industryLocation = industryLocation
          .filter((v) => v.parentId === "0")
          .map((item) => {
            item.children = [];
            industryLocation.map((s) => {
              if (s.parentId === item.id) {
                s = {
                  ...s,
                  label: s.tagName + "(" + s.resourceCount + ")",
                  value: parseInt(s.tagValue, 10),
                };
                item.children.push(s);
              }
            });
            return (item = {
              ...item,
              label: item.tagName + "(" + item.resourceCount + ")",
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

        tags["LOCATION/CHANYDW"] = [
          { tagName: "不限", label: "不限", children: [] },
        ].concat(tags["LOCATION/CHANYDW"]);
        tags["INDUSTRIAL/YONGDMJ"] = [
          { tagName: "不限", label: "不限" },
        ].concat(tags["INDUSTRIAL/YONGDMJ"]);
        tags["LOCATION/FUWPT"] = [{ tagName: "不限", label: "不限" }].concat(
          tags["LOCATION/FUWPT"]
        );

        // location = location.filter((v: { resourceCount: number; layer: number }) => v.resourceCount > 0);
        (location || []).map((item) => {
          item.label = item.tagName + "(" + item.resourceCount + ")";
          return item;
        });

        this.setData({
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
    async getOneRegion() {
      try {
        const info = await industrialMapHttpService.oneRegion();
        (info.lowRegions || []).map((item) => {
          item.tagName = item.resourceName;
          item.tagValue = item.resourceName;
          return item;
        });
        this.setData({
          lowRegions: info.lowRegions,
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
     * 获取二级空间区域信息
     * @param id
     */
    async getLowRegion(id) {
      try {
        const info = await industrialMapHttpService.lowRegion({
          resourceId: id,
        });
        let industryCompetitiveness = info.industryCompetitiveness.split("；");
        let tagList = info.industryLocations.split(",");
        let pattern = new RegExp("[\\[\\]]");
        info.itude = info.itude.replace(pattern, "");
        let itude = info.itude.split(";") || [];
        let path = [];
        itude.map((item, i) => {
          i + 1 < itude.length &&
            path.push({
              lng: item.split(",")[0],
              lat: item.split(",")[1],
            });
        });
        let lowMap = [
          {
            name: info.resourceName,
            longitude: itude[0].split(",")[0],
            latitude: itude[0].split(",")[1],
          },
        ];
        this.mapMaker(lowMap, path);
        this.setData({
          lowMap,
          path,
          longitude: itude[0].split(",")[0],
          latitude: itude[0].split(",")[1],
          info,
          industryCompetitiveness,
          tagList,
          mapData: info.lowRegions || [],
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
     * 获取重点产业
     * @param id
     */
    async getImportantIndustry() {
      try {
        const importantIndustry = await importantIndustryHttpService.getList();
        this.setData({
          importantIndustry,
        });
        this.getImportantIndustryDetail(importantIndustry[0].id);
        this.getResourceRegionList(importantIndustry[0].industryNameValue, 1);
      } catch (e) {
        uni.showToast({
          title: `${e.errmsg || e}`,
          icon: "none",
          duration: 2000,
        });
      }
    },

    /**
     * 获取重点产业详情
     * @param id
     */
    async getImportantIndustryDetail(id) {
      try {
        const importantIndustryDetail = await importantIndustryHttpService.get(
          id
        );
        this.setData({
          importantIndustryDetail,
          industryNameValue: importantIndustryDetail.industryNameValue,
          industry: importantIndustryDetail.industryName,
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
     * 获取重点产业相关产业区域
     * @param id
     */
    async getResourceRegionList(industryLocationValues, pageIndex) {
      try {
        const data = {
          pageIndex,
          pageSize: 25,
          // regionLevel: 1,
          // dataSources: 2,
          resourceStatus: 999,
          industryLocationValues: industryLocationValues || "",
        };
        const resourceRegionList = await resourceRegionHttpService.getPaged(
          data
        );
        const list = ([...resourceRegionList.items] || []).map((item, _i) => {
          item.industryLocations = item.industryLocations.split(",");
          return item;
        });
        this.setData({
          resourceRegionList:
            resourceRegionList.currentPage <= 1
              ? list
              : [...this.resourceRegionList, ...list],
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
      let state = this;
      let tabIndex = state.tabIndex;
      if (tabIndex) {
        this.getSpaceResourcePage({
          pageIndex: this.pageIndex + 1,
        });
      }
    },

    pulldown() {
      let state = this;
      let tabIndex = state.tabIndex;
      if (tabIndex) {
        this.setData({
          refreshertriggered: true, // 下拉刷新状态
        });
        this.getSpaceResourcePage({
          pageIndex: 1,
        });
      } else {
        this.setData({
          refreshertriggered: false,
        });
      }
    },

    readItem() {
      console.log("占位：函数 readItem 未声明");
    },
  },
};
</script>
<style>
@import "./second.css";
</style>
