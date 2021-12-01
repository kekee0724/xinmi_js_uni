<template>
  <view>
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
      <view class="map-search flex">
        <text>新密市</text>
        <navigator class="flex-item" url="/xinmi/resource/resource?show=true">
          <view class="search-box">
            <text class="ieb ieb-search search-icon"></text>
            <input
              class="weui-input"
              placeholder-class="weui-input__placeholder"
              placeholder="搜索资源/项目选址"
            />
          </view>
        </navigator>
      </view>
    </view>
    <view class="radius-body">
      <view class="list">
        <navigator class="list-item" url="/xinmi/resource/resource?tabIndex=0">
          <view class="flex">
            <view class="flex-item">
              <view>空间资源</view>
            </view>
            <text class="ieb ieb-right"></text>
          </view>
        </navigator>
        <navigator class="list-item" url="/xinmi/resource/resource?tabIndex=1">
          <view class="flex">
            <view class="flex-item">
              <view>创新资源</view>
            </view>
            <text class="ieb ieb-right"></text>
          </view>
        </navigator>
        <navigator class="list-item" url="/xinmi/resource/resource?tabIndex=2">
          <view class="flex">
            <view class="flex-item">
              <view>配套资源</view>
            </view>
            <text class="ieb ieb-right"></text>
          </view>
        </navigator>
      </view>
      <view class="tabset">
        <view
          :class="'flex-item tab-bar ' + (selected == index ? 'active' : '')"
          @click="changTabs"
          :data-index="index"
          v-for="(item, index) in tabs"
          :key="item.key"
        >
          {{ item.name }}
        </view>
        <view></view>
      </view>
      <block v-if="selected == 0">
        <picture
          class="images-auto kk"
          :tableId="info.resourceId"
          tableName="BILocationResource"
          :readonly="true"
        ></picture>
        <view class="whitespace-md dark"></view>
        <view class="list-card">
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
            <view class="title">GDP增长</view>
            <view class="body">
              <canvas canvas-id="columnCanvas" class="canvas"></canvas>
            </view>
          </view>

          <view class="card dark">
            <view class="title">产业概况</view>
            <view class="body">
              <view
                :class="(down1 === false ? 'omit omit-5' : '') + ' size-14'"
              >
                <text>{{ info.industrySummary }}</text>
              </view>
              <view class="text-center size-14 mt10">
                <text
                  class="link-color"
                  @click="downText1"
                  :data-index="!down1"
                  >{{ down1 === false ? "+展开" : "—收起" }}</text
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
        </view>
      </block>
      <block v-if="selected == 1">
        <view class="list-card">
          <view class="select-tag">
            <text
              :class="tagSelected === index ? 'active' : ''"
              @click="selectTag"
              :data-index="index"
              v-for="(item, index) in importantIndustry"
              :key="item.index"
            >
              {{ item.industryName }}
            </text>
          </view>
          <view class="card-list-item">
            <view class="header">{{ industry }}产业介绍</view>
            <view class="card dark">
              <view class="body">
                <view
                  :class="(down3 === false ? 'omit omit-5' : '') + ' size-14'"
                >
                  {{ importantIndustryDetail.summary }}
                </view>
                <view class="text-center size-14 mt10">
                  <text
                    class="link-color"
                    @click="downText3"
                    :data-index="!down3"
                    >{{ down3 === false ? "+展开" : "—收起" }}</text
                  >
                </view>
              </view>
            </view>
          </view>
          <view class="card-list-item">
            <view class="header">{{ industry }}相关产业区域</view>
            <navigator
              class="card dark"
              :url="'/xinmi/second/second?markerId=' + item.resourceId"
              v-for="(item, index) in resourceRegionList"
              :key="index"
            >
              <view class="flex">
                <view class="flex-item">
                  <view class="title omit omit-1">{{ item.resourceName }}</view>
                  <view class="omit omit-1 mt20">
                    <text
                      class="default-tag"
                      v-for="(t, idx) in item.industryLocations"
                      :key="idx"
                      >{{ t }}</text
                    >
                  </view>
                  <view class="omit omit-1 size-12 mt10">
                    <text class="gray-three-color">投资热线：</text>
                    0371-87051769
                  </view>
                </view>
                <uni-picture
                  class="images-auto"
                  :tableId="item.resourceId"
                  tableName="BILocationResource"
                  :readonly="true"
                ></uni-picture>
                <!-- <image class="images-auto" style="width: 123px; height: 84px"
									src="https://img2.baidu.com/it/u=3922526097,2180692065&fm=26&fmt=auto&gp=0.jpg">
								</image> -->
              </view>
            </navigator>
          </view>
        </view>
        <view></view>
      </block>
    </view>
  </view>
</template>

<script>
// 新密市边界
const { city } = require("./common");

const {
  importantIndustryHttpService,
  industrialMapHttpService,
  resourceRegionHttpService,
} = require("./service/index.service");

var windowW = 0;
var windowH = 0;

var wxCharts = require("../../js/wxcharts-min");

export default {
  data() {
    return {
      down1: false,
      down2: false,
      down3: false,
      mapData: [],
      type: false,
      selected: 0,
      tagSelected: 0,
      markers: [],
      customMarkers: [],
      points: [],
      polygons: [],

      setting: {
        scale: "9.8",
        longitude: "113.42507561061822",
        latitude: "34.54309932463642",
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

      imageWidth: "",
      imageHeight: "",
      years: "",
      amounts: "",

      info: {
        resourceId: "",
        industrySummary: "",
        summary: "",
      },

      industryCompetitiveness: {},
      loadingHidden: false,
      importantIndustry: {},

      importantIndustryDetail: {
        summary: "",
      },

      industryNameValue: "",
      industry: {},
      resourceRegionList: {},
      pageIndex: "",
      showFooter: "",
      refreshertriggered: false,

      t: {
        index: "",
      },
    };
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (_options) {
    this.setData({
      imageWidth: uni.getSystemInfoSync().windowWidth,
      imageHeight: uni.getSystemInfoSync().windowHeight,
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getOneRegion();
    this.getImportantIndustry();
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
  onReachBottom: function () {},
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (opts) {
    console.log(opts.target);
    return {};
  },
  methods: {
    mapMaker: function (mapDatas) {
      let markerList = [];
      let customList = [];
      const state = this;
      const mapData = mapDatas || state.mapData;
      mapData.map((item, _i) => {
        markerList.push({
          iconPath: "https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
          id: item.id,
          longitude: item.longitude,
          latitude: item.latitude,
          callout: {
            content: item.name + " >>",
            color: "#fff", //文本颜色
            fontSize: 10, //文字大小
            borderRadius: 3, //callout边框圆角
            display: "ALWAYS", //'BYCLICK':点击显示; 'ALWAYS':常显
            bgColor: "#3399ff", //背景色
            padding: 6, //文本边缘留白
            textAlign: "center", //文本对齐方式。有效值: left, right, center,
            // anchorY: 10,
          },
          // label: {
          //   //为标记点旁边增加标签
          //   content: "", //标记点旁边的文字
          //   color: "#ff6600", //文本颜色
          //   fontSize: 12, //文字大小
          //   x: 0, //label的坐标，原点是 marker 对应的经纬度
          //   y: 0, //label的坐标，原点是 marker 对应的经纬度
          //   borderWidth: 1, //边框宽度
          //   borderColor: "", //边框颜色
          //   borderRadius: 10, //边框圆角
          //   bgColor: "red",
          //   padding: 6, //	文本边缘留白
          //   textAlign: "left", //文本对齐方式。有效值: left, right, center
          // },
          width: 18,
          height: 24,
          anchor: {
            //经纬度在标注图标的锚点，默认底边中点      {x, y}，x表示横向(0-1)，y表示竖向(0-1)。{x: .5, y: 1} 表示底边中点
            x: 0.5,
            y: 1,
          },
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

    changTabs: function (e) {
      this.drawWxCharts();
      this.setData({
        selected: e.currentTarget.dataset.index,
      });
    },

    handleRegionchange: function (_ev) {
      this.mapCtx = uni.createMapContext("myMap");
      this.mapCtx.getCenterLocation({
        success(res) {
          console.log(res.longitude, "经度", res.latitude, "纬度");
        },
      });
    },

    //地图点击事件
    markertap(e) {
      console.log("你点击的标记点id是:" + e.detail.markerId);
      console.log(e);
      uni.navigateTo({
        url: `/xinmi/second/second?markerId=${e.detail.markerId}`,
      });
    },

    selectTag: function (e) {
      this.drawWxCharts();
      let tagSelected = e.currentTarget.dataset.index;
      this.setData({
        tagSelected,
      });
      const state = this;
      const importantIndustry = state.importantIndustry;
      this.getImportantIndustryDetail(importantIndustry[tagSelected].id);
      this.getResourceRegionList(importantIndustry[tagSelected].fullValues, 1);
    },

    downText1: function (e) {
      this.setData({
        down1: e.currentTarget.dataset.index,
      });
    },

    downText2: function (e) {
      this.setData({
        down2: e.currentTarget.dataset.index,
      });
    },

    downText3: function (e) {
      this.setData({
        down3: e.currentTarget.dataset.index,
      });
    },

    drawWxCharts: function (year, amount) {
      const state = this;
      const years = year || state.years;
      const amounts = amount || state.amounts;
      windowW = state.imageWidth * 0.88;

      new wxCharts({
        canvasId: "columnCanvas",
        categories: years,
        series: [
          {
            name: "增长值",
            data: amounts, //设置某一个值为null会出现断层
            format: function (val) {
              return val.toFixed(2) + "亿";
            },
          },
        ],

        // 线图（circle）
        dataPointShape: "circle",
        type: "line",
        extra: {
          lineStyle: "curve", //线条的形状（弧形）
        },
        yAxis: {
          title: "金额 (亿)",
          format: function (val) {
            return val.toFixed(2);
          },
          disabled: true,
        },

        // 区域图（area）
        // type: 'area',
        // yAxis: {
        // 	format: function(val) {
        // 		return val + '亿';
        // 	},
        // 	disabled: true,
        // },

        // 雷达图（radar）
        // animation: true,
        // type: 'radar',
        // extra: {
        // 	radar: {
        // 		gridColor: '#00cc66',
        // 		labelColor: '#000',
        // 		max: 100 //雷达数值的最大值
        // 	}
        // },

        // 柱状图（column）
        // type: "column",
        // xAxis: {
        // 	disableGrid: false,
        // 	type: "calibration",
        // },
        // yAxis: {
        // 	min: 0,
        // 	disabled: true,
        // },
        // extra: {
        // 	column: {
        // 		width: 15,
        // 	},
        // },

        dataLabel: true,
        width: windowW,
        height: 260,
      });
    },

    /**
     * 获取一级空间区域信息
     * @param id
     */
    async getOneRegion() {
      try {
        const info = await industrialMapHttpService.oneRegion();
        let industryCompetitiveness =
          info?.industryCompetitiveness?.split("；");
        let tagList = info?.industryLocations?.split(",");
        let years = [],
          amounts = [];
        (info?.gdpDistributions || []).map((item, i) => {
          if (i < 6) {
            years.push(item?.year);
            amounts.push(item?.amount);
          }
        });
        this.drawWxCharts(years, amounts);
        (info?.lowRegions || []).map((item) => {
          let pattern = new RegExp("[\\[\\]]");
          item.itude = item.itude.replace(pattern, "");
          // console.log(item?.itude?.split(";"));
          item.name = item.resourceName;
          item.longitude = item?.itude
            ? item?.itude?.split(";")[0]?.split(",")[0]
            : "";
          item.latitude = item?.itude
            ? item?.itude?.split(";")[0]?.split(",")[1]
            : "";
          return item;
        });
        this.mapMaker(info?.lowRegions);
        this.setData({
          years,
          amounts,
          info,
          industryCompetitiveness,
          tagList,
          mapData: info?.lowRegions,
          loadingHidden: true,
        });
      } catch (e) {
        uni.showToast({
          title: `${e?.errmsg || e}`,
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
        const importantIndustry =
          await importantIndustryHttpService.listbyRegion({
            regionName: "新密市",
          });
        this.setData({
          importantIndustry,
        });
        this.getImportantIndustryDetail(importantIndustry[0].id);
        this.getResourceRegionList(importantIndustry[0].fullValues, 1);
      } catch (e) {
        uni.showToast({
          title: `${e?.errmsg || e}`,
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
          title: `${e?.errmsg || e}`,
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
          regionLevel: 2,
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
              : [...this.data.resourceRegionList, ...list],
          pageIndex: resourceRegionList.currentPage,
          showFooter:
            resourceRegionList.totalPages > 0 &&
            resourceRegionList.currentPage >= resourceRegionList.totalPages,
          loadingHidden: true,
          refreshertriggered: false, // 结束下拉刷新状态
        });
      } catch (e) {
        uni.showToast({
          title: `${e?.errmsg || e}`,
          icon: "none",
          duration: 2000,
        });
      }
    },

    videoErrorCallback() {
      console.log("占位：函数 videoErrorCallback 未声明");
    },
  },
};
</script>
<style>
@import "./index.css";
</style>
