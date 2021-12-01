<template>
  <view class="phone-warp">
    <view class="page-body">
      <view class="map-box">
        <map
          id="myMap"
          style="width: 100%; height: 800rpx"
          :setting="setting"
          :markers="markers"
          @regionchange="handleRegionchange"
          :polygons="polygons"
          @callouttap="markertap"
        ></map>
        <view class="map-search">
          <view class="blod flex size-18">
            新密市
            <text class="ieb ieb-right blod link-color margin-h"></text>
            <picker @change="bindPickerChange" :value="index" :range="array">
              超化镇
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
              <view class="header size-18">超化镇概览</view>
              <view class="card dark">
                <view class="title">产业竞争力</view>
                <view class="body">
                  <view class="text-list">
                    <view class="li">
                      超化镇境内已探明矿藏资源有煤和铝矾土，另有耐火黏土、石灰石，并有少量硅、硫铁、云母石分布。其中煤炭资源总储量为10.9亿吨，铝土矿总储量1370万吨，石灰石储量4亿吨。
                    </view>
                    <view class="li">
                      2011年，超化镇以煤炭、耐火材料、化工、塑料制品、建筑材料业为主导产业。2011年，工业生产总值175.9亿元，比上年增长16.8%，工业增加值占全镇生产总值的68.7%。
                    </view>
                  </view>
                </view>
              </view>
              <view class="card dark">
                <view class="title">产业定位</view>
                <view class="body">
                  <view class="select-tag">
                    <text
                      :class="tagSelected === index ? 'active' : ''"
                      @click="selectTag"
                      :data-index="index"
                      v-for="(item, index) in tagList"
                      :key="item.index"
                    >
                      {{ item }}
                    </text>
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
                <view class="title">龙头企业</view>
                <view class="body mt5">
                  <view class="ent-list">
                    <view class="list-item">
                      <text class="link-color">郑州豫华耐火材料有限公司</text>
                    </view>
                    <view class="list-item">
                      <text class="link-color"
                        >郑州东方耐火材料股份有限公司</text
                      >
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
                      src="@/static/images/key.png"
                      style="height: 136rpx; width: 136rpx"
                    ></image>
                    <view class="flex-item size-12 pl10">
                      <view class="omit omit-1">
                        <text class="ieb ieb-party mr5"></text>
                        超化镇人民政府
                      </view>
                      <view class="omit omit-1">
                        <text class="ieb ieb-marker_fill mr5"></text>
                        郑州市新密市超化镇政府(323省道旧南)
                      </view>
                      <view class="omit omit-1">
                        <text class="ieb ieb-mobile mr5"></text>
                        0371-69238601
                      </view>
                    </view>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </block>
        <block v-if="tabIndex === 1">
          <view class="list-card">
            <view class="card-list-item pv-0">
              <view class="header size-18">新密市空间资源</view>
              <view class="tabs-button">
                <text
                  :class="tabIndex2 == index ? 'active' : ''"
                  @click="selectIndex2"
                  :data-index="index"
                  v-for="(item, index) in tabsButton2"
                  :key="item.key"
                >
                  {{ item.name }}({{ item.number }})
                </text>
              </view>
              <view class="flex down-box mt15">
                <view
                  class="flex-item"
                  v-for="(item, index) in selectData"
                  :key="item.index"
                >
                  <view class="size-12">{{ item }}</view>

                  <view class="pick-box">
                    <picker
                      @change="bindPickerChange"
                      :value="index"
                      :range="array"
                    >
                      <view class="flex">
                        <view class="flex-item">
                          <text class="size-12">{{ array[index] }}</text>
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
              </view>
              <view class="mt10">
                <view
                  class="card dark"
                  v-for="(item, index) in listData"
                  :key="item.index"
                >
                  <view class="flex">
                    <view class="flex-item">
                      <view class="title omit omit-1">开发区工业园</view>
                      <view class="omit omit-1 mt5">
                        <text class="default-tag">新材料</text>
                        <text class="default-tag">品牌服装</text>
                      </view>
                      <view class="omit omit-1 size-12 mt10">
                        <text class="gray-three-color">面积：</text>
                        3000m²
                      </view>
                      <view class="omit omit-1 size-12 mt10">
                        <text class="gray-three-color">地址：</text>
                        舞阳街道塔山街901号
                      </view>
                    </view>
                    <view class="vr-tag">
                      <view class="item">
                        <image src="@/static/images/vr.svg"></image>
                        <text class="ml5">VR</text>
                      </view>
                      <image
                        class="images-auto"
                        style="width: 123px; height: 84px"
                        src="https://img2.baidu.com/it/u=3922526097,2180692065&fm=26&fmt=auto&gp=0.jpg"
                      >
                      </image>
                    </view>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </block>
      </view>
    </view>
  </view>
</template>

<script>
// pages/index/index.js
// 新密市边界
const { city } = require("../../pages/index/common");
let windowW = 0;

let wxCharts = require("../../js/wxcharts-min");

export default {
  data() {
    return {
      array: ["不限", "选择一", "选择二", "选择三"],
      listData: ["", "", "", "", "", "", "", "", "", "", "", ""],
      selectData: ["所在区域", "产业定位", "面积", "服务配套"],
      tabIndex: 0,
      tabIndex2: 0,
      tabsButton: ["概览", "空间资源", "创新资源", "配套资源"],

      tabsButton2: [
        {
          name: "园区",
          number: "20",
        },
        {
          name: "地块",
          number: "20",
        },
        {
          name: "楼宇",
          number: "20",
        },
        {
          name: "厂房",
          number: "20",
        },
        {
          name: "仓库",
          number: "20",
        },
      ],

      down: false,

      mapData: [
        {
          id: "0",
          name: "曲梁镇",
          longitude: "113.390891",
          latitude: "34.539443",
        },
        {
          id: "1",
          name: "超化镇",
          longitude: "113.407986",
          latitude: "34.449421",
        },
        {
          id: "2",
          name: "大槐镇",
          longitude: "112.230887",
          latitude: "22.077016",
        },
        {
          id: "3",
          name: "岳村镇",
          longitude: "113.494952",
          latitude: "34.551906",
        },
        {
          id: "4",
          name: "青屏街街道",
          longitude: "113.370114",
          latitude: "34.54251",
        },
      ],

      type: false,
      selected: 0,
      tagSelected: 0,
      markers: [],
      customMarkers: [],
      points: [],
      polygons: [],

      setting: {
        scale: "9.8",
        longitude: "113.41053421296328",
        latitude: "34.500659328587915",
      },

      tagList: ["新材料", "清洁煤炭", "电力资源", "现代产业"],

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
      index: 0,
    };
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let markerList = [];
    let customList = []; // 新密市坐标行政区边界

    this.mapData.map((item, i) => {
      markerList.push({
        iconPath: "/static/images/make_l.svg",
        id: item.id,
        longitude: item.longitude,
        latitude: item.latitude,
        callout: {
          // content: item.name + ' >>',
          color: "#fff",
          fontSize: 12,
          borderRadius: 3,
          display: "BYCLICK",
          bgColor: "#3399ff",
          padding: 6,
          anchorY: 10,
        },
        width: 45,
        height: 45,
      });
      customList.push({
        id: item.id,
        name: item.name,
      });
    });
    setTimeout(() => {
      let path = [];
      city.map((item, i) => {
        path.push({
          latitude: item.lat,
          longitude: item.lng,
        });
      }); //  console.log(path);

      this.setData({
        markers: markerList,
        customMarkers: customList,
        polygons: [
          {
            points: path,
            strokeWidth: 1,
            strokeColor: "#3399ff",
            fillColor: "rgba(51,153,255,0.2)",
            zIndex: 10,
          },
        ],
      });
    }, 1000); // wcharts

    this.setData({
      imageWidth: uni.getSystemInfoSync().windowWidth,
    }); //计算屏幕宽度比列

    windowW = this.imageWidth / 375;
    new wxCharts({
      canvasId: "columnCanvas",
      type: "column",
      animation: true,
      categories: [2010, 2012, 2014, 2016, 2018, 2019],
      series: [
        {
          name: "增长值",
          data: [17438, 20559, 24068, 28068, 23280, 26800],
          format: function (val, name) {
            return val + "亿";
          },
        },
      ],
      xAxis: {
        disableGrid: false,
        type: "calibration",
      },
      extra: {
        column: {
          width: 15,
        },
      },
      width: 360 * windowW,
      height: 250 * windowW,
    });
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
  onPullDownRefresh: function () {},
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
  methods: {
    changTabs: function (e) {
      this.setData({
        selected: e.currentTarget.dataset.index,
      });
    },

    handleRegionchange: function (ev) {
      this.mapCtx = uni.createMapContext("myMap");
      this.mapCtx.getCenterLocation({
        success(res) {
          console.log(res.longitude, "经度");
          console.log(res.latitude, "纬度");
        },
      }); // console.log(this.mapCtx.getCenterLocation);
    },

    /**
     * marker点击事件
     */
    markertap(e) {
      console.log(e);
    },

    //   标签选中效果
    selectIndex: function (e) {
      this.setData({
        tabIndex: e.currentTarget.dataset.index,
      });
    },

    //   标签选中效果
    selectIndex2: function (e) {
      this.setData({
        tabIndex2: e.currentTarget.dataset.index,
      });
    },

    // 选择器
    bindPickerChange: function (e) {
      console.log("picker发送选择改变，携带值为", e.detail.value);
      this.setData({
        index: e.detail.value,
      });
    },

    selectTag: function (e) {
      console.log(e);
      this.setData({
        tagSelected: e.currentTarget.dataset.index,
      });
    },

    // 展开多选
    downText: function (e) {
      console.log(e.currentTarget.dataset.index);
      this.setData({
        down: e.currentTarget.dataset.index,
      });
    },
  },
};
</script>
<style>
@import "./second.css";
</style>
