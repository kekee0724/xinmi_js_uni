<template>
  <view>
    <view class="phone-warp">
      <view class="page-cont" v-if="isTiptrue">
        <view class="top">
          <image
            src="cloud://dev-4gju2hza605fd6b2.6465-dev-4gju2hza605fd6b2-1304525964/worldTree/jt.png"
          ></image>
          <view class="p_one">添加时光代理人，编程无忧</view>
        </view>
        <view class="cont">
          <view class="cont-p">
            <view class="text"><text>1</text></view>
            <view>点击右上角</view>
            <image
              src="cloud://dev-4gju2hza605fd6b2.6465-dev-4gju2hza605fd6b2-1304525964/worldTree/dian.png"
            ></image>
          </view>
          <view class="cont-p">
            <view class="text"><text>2</text></view>
            <view>点击“添加我的小程序”</view>
          </view>
          <view class="cont-p">
            <view class="text"><text>3</text></view>
            <view>回到微信首页下拉聊天列表，</view>
          </view>
          <view class="cont-p-lib">
            <view class="text" style="opacity: 0"><text>3</text></view>
            <view>从“我的小程序”里打开“时光代理人”</view>
          </view>
          <view class="cont-p-three">
            <view class="right">
              <view class="left-p">
                <view class="title">我的小程序</view>
                时光代理人
              </view>
              <view class="left-p">
                <view class="title" style="opacity: 0">我的小程序</view>
                <view
                  style="
                    color: #4c4c4e;
                    width: 27px;
                    height: 27px;
                    margin-top: 5px;
                    margin-bottom: 5px;
                    border-radius: 50%;
                    background: #4c4c4e;
                  "
                ></view>
                小程序
              </view>
            </view>
          </view>
        </view>
        <view class="bottom" @tap="closeThis">记住了 我去试试</view>
      </view>

      <loading :hideLoading="loadingHidden" />
      <nav-bar :show-nav="false" :nav-style="topStyle">
        <!-- 园区选择 -->
        <view class="nav-box align-left" id="top">
          <picker @change="bindPickerChange" :value="index" :range="array">
            <view class="picker">
              <text class="title" :style="textColor" @change="onPageScroll">
                {{ array[index] }}
                <text class="icon icon-xia"></text>
              </text>
            </view>
          </picker>
        </view>
      </nav-bar>
      <scroll-view
        style="margin-top: -64rpx"
        class="phone-body"
        :scroll-y="true"
        @scroll="onPageScroll"
        @scrolltolower="onReachBottom"
      >
        <swiper
          class="index-banner"
          :indicator-dots="indicatorDots"
          :autoplay="true"
          :interval="interval"
          :duration="duration"
        >
          <block v-for="(item, index) in banners" :key="index">
            <swiper-item>
              <image-auto
                cutWidth="414"
                cutHeight="233"
                :src="item.picUrl"
                alt=""
              />
            </swiper-item>
          </block>
          <block v-if="banners.length === 0">
            <swiper-item class="index-banner-image">
              <image-auto cutWidth="100" cutHeight="100" :src="''" alt="" />
            </swiper-item>
          </block>
        </swiper>
        <!-- 园区通告 -->
        <index-notice class="notice" />

        <service-list class="service-list" />

        <view class="home">
          <!-- 前端字典等 -->
          <view class="nav-list_df">
            <view class="nav-list-left">
              <navigator
                hover-class="none"
                url="/api-tree/pages/home/dictionaries/index"
                style="height: 96%"
                class="nav-li bg_kl"
              >
                <view class="nav-title">前端字典</view>
                <view class="mt10 nav-name">
                  千里之行
                  <view>始于足下</view>
                </view>
              </navigator>
            </view>
            <view class="nav-list-right">
              <navigator
                hover-class="none"
                url="/api-tree/pages/home/book/index"
                class="nav-li bg-cyan bg_kl2"
              >
                <view class="nav-title">大牛书籍</view>
                <view class="nav-name">天生我材必有用</view>
                <text class="cuIcon-newshotfill icon icon-dingdan"></text>
              </navigator>
              <navigator
                hover-class="none"
                url="/api-tree/pages/home/fl_answer/index"
                class="nav-li bg_kl3"
              >
                <view class="nav-title">难点问答</view>
                <view class="nav-name">人事有代谢，往来成古今</view>
                <text :class="'cuIcon-' + 'item.icon'"></text>
              </navigator>
            </view>
          </view>
          <view class="main_title">
            <view class="min_height cu-bar">
              <view class="action sub-title">
                <text class="text-xl text-bold text-tree">精选Top</text>
                <text class="text-ABC text-tree">kekee</text>
              </view>
            </view>
            <view></view>
          </view>

          <!-- 微头条 -->
          <home-article class="hot-article"></home-article>

          <!-- 热门活动 -->
          <hot-activity class="hot-activity" />

          <van-divider contentPosition="center"
            >到底啦，更多数据请跳转学习模块</van-divider
          >
        </view>
      </scroll-view>
    </view>
    <sus-panel :sus-style="susStyle" :is-home="true"></sus-panel>
  </view>
</template>


<script>
"use strict";
import imageAuto from "@/components/image-auto/image-auto";
import navBar from "@/components/nav-bar/nav-bar";
import susPanel from "@/components/suspension/suspension";
import loading from "@/components/loading/loading";

import serviceList from "./service-list/service-list";
import hotActivity from "./hot-activity/hot-activity";
import homeArticle from "./home-article/home-article";
import indexNotice from "./index-notice/index-notice";

import { AUTH, WXAPI } from "../../kek";

import { Notify } from "vant";

import { setLocalStorage, getLocalStorage } from "../../core/funcs/storage";

export default {
  components: {
    imageAuto,
    navBar,
    susPanel,
    loading,
    serviceList,
    hotActivity,
    homeArticle,
    indexNotice,
  },
  data() {
    return {
      array: [],
      parkList: [],
      index: 0,
      parkPictureList: [],
      banners: [],
      topStyle: `color: #9E9E9E`,
      textColor: `color: #9E9E9E`,
      indicatorDots: true,
      vertical: false,
      autoplay: false,
      interval: 2000,
      duration: 500,
      susStyle: `opacity: 1`,
      categories: [],
      activeCategoryId: 0,
      isAuth: false,
      tz_list: [],
      isTiptrue: false,
      loadingHidden: false,
      curPage: 0,
      xw_list: [],
      userlist: [],
      t_data_rs: {},
    };
  },
  onLoad(e) {
    let firstOpen = uni.getStorageSync("loadOpen");

    if (firstOpen == undefined || firstOpen == "") {
      this.setData({
        isTiptrue: true,
      });
    } else {
      this.setData({
        isTiptrue: false,
      });
    }

    uni.getLocation({
      type: "wgs84",
      success: (res) => {
        this.latitude = res.latitude;
        this.longitude = res.longitude;
        this.fetchShops(res.latitude, res.longitude, "");
      },

      fail(e) {
        console.error(e);
        AUTH.checkAndAuthorize("scope.userLocation");
      },
    });
    uni.showShareMenu({
      withShareTicket: true,
    });

    AUTH.authorize().then((_res) => {
      AUTH.bindSeller();
      // TOOLS.showTabBarBadge();
    });
    this.initBanners();
    this.categoriesFun();
  },
  onShow() {
    this.refreshHomeData();
  },
  methods: {
    closeThis() {
      uni.setStorageSync("loadOpen", true);
      this.setData({
        isTiptrue: false,
      });
    },

    refreshHomeData() {
      const child1 = this.$mp.page.selectComponent(".hot-activity");
      const child2 = this.$mp.page.selectComponent(".notice");
      const child3 = this.$mp.page.selectComponent(".service-list");

      console.log("child2", child2);
      child1 && child1.fetchNews();
      child2 && child2.getNotice();
      child3 && child3.getUserProfile();
    },

    async initBanners() {
      const data = {};
      // 读取头部轮播图
      const res = await WXAPI.banners({
        type: "index",
      });

      if (res.code == 700) {
        uni.showModal({
          title: "提示",
          content: "请在后台添加 banner 轮播图片，自定义类型填写 index",
          showCancel: false,
        });
      } else {
        data.banners = res.data;
      }
      this.setData(data);
    },

    async fetchShops(latitude, longitude, kw) {
      const res = await WXAPI.fetchShops({
        curlatitude: latitude,
        curlongitude: longitude,
        nameLike: kw,
      });
      console.log("fetchShops ", res.data);

      if (getLocalStorage("parkId")) {
        const index = res.data?.findIndex(
          (item) => item.number === getLocalStorage("parkId")
        );
        this.setData({ index });
      }

      this.setData({
        loadingHidden: true,
        array: res.data.map((item) => item.name),
        parkList: res.data,
      });

      if (res.code == 0) {
        res.data.forEach((ele) => {
          ele.distance = ele.distance.toFixed(3); // 距离保留3位小数
        });
        this.setData({
          parkList: res.data,
        });
        // 若没有园区，默认选择最近的园区
        if (!getLocalStorage("parkId")) {
          const park = res.data[0];
          setLocalStorage("parkId", park.number);
          setLocalStorage("parkName", park.name);
          uni.setStorageSync("shopInfo", park);
          uni.setStorageSync("shopIds", park.id);
        }
      } else {
        this.setData({
          parkList: null,
        });
      }
    },

    async categoriesFun() {
      const res = await WXAPI.goodsCategory();
      let categories = [];

      if (res.code == 0) {
        const _categories = res.data.filter((ele) => {
          return ele.level == 1;
        });

        categories = categories.concat(_categories);
      }

      this.setData({
        categories: categories,
        activeCategoryId: 0,
        curPage: 1,
      });
    },

    tabClick: function (e) {
      const category = this.categories.find((ele) => {
        return ele.id == e.currentTarget.dataset.id;
      });
      uni.setStorageSync("_categoryId", category.id);
      uni.navigateTo({
        url: "/api-main/category/category",
      });
    },

    bindPickerChange: function (e) {
      const index = e.detail.value;
      const park = this.parkList[index];
      setLocalStorage("parkId", park.number);
      setLocalStorage("parkName", park.name);
      uni.setStorageSync("shopInfo", park);
      uni.setStorageSync("shopIds", park.id);
      this.setData({
        index,
      });
      this.refreshHomeData();
    },

    tz(e) {
      uni.navigateTo({
        url:
          "/api-tree/pages/" +
          e.currentTarget.dataset.a +
          "?id=" +
          e.currentTarget.dataset.id,
      });
    },

    onPageScroll(e) {
      let top = e.scrollTop;
      this.setData({
        topStyle: `background-color: rgba(255, 255, 255, ${top * 0.01});
          color: ${top < 40 ? "#bdbdbd" : "rgba(0,0,0," + top * 0.01 + ")"};
          box-shadow: 0 0 4px rgba(0,0,0, ${
            top * 0.001 < 0.7 ? top * 0.001 : 0.7
          })`,
        textColor: `color: ${
          top < 40 ? "#bdbdbd" : "rgba(0,0,0," + top * 0.01 + ")"
        };`,
        susStyle: `opacity: ${1 - top * 0.01 <= 1 ? 1 - top * 0.01 : 1}`,
      });
    },

    onReachBottom() {
      Notify({
        type: "primary",
        background: "#f4c998",
        message: "到底啦，2秒后自动跳转学习页面",
      });

      setTimeout(
        uni.pageScrollTo({
          scrollTop: 0,
        }),
        1500
      );

      setTimeout(funcName, 2000);
      function funcName() {
        uni.switchTab({
          url: "/pages/example/components",
        });
      }
    },
  },
};
</script>
<style>
.icon-xia {
  font-size: 12px;
}
.box {
  height: 401px;
}
nav-bar {
  width: 100%;
  position: absolute;
}
.index-banner {
  position: relative;
  height: 400rpx;
}
.index-banner .index-banner-image .erro-class {
  margin-top: 30rpx;
}
.index-banner /deep/ uni-image {
  display: block;
  width: 100%;
}
.index-banner-image /deep/ uni-image {
  display: block;
  width: 100%;
  height: 276rpx;
  margin-top: 66rpx;
  margin: 0 auto;
}
.index-notice {
  position: relative;
  margin: -60rpx 30rpx 0;
  background-color: #ffffff;
  border-radius: 12rpx;
  box-shadow: 0 0 16rpx 0 rgba(0, 0, 0, 0.16);
  z-index: 1;
  padding: 26rpx 20rpx;
}
.index-notice /deep/ .tips {
  width: 76rpx;
  height: 67rpx;
}
.index-notice /deep/ swiper {
  height: 100%;
}
.index-notice /deep/ swiper swiper-item {
  vertical-align: middle;
  line-height: 66rpx;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.little-banner {
  height: 172rpx;
  margin: 0 30rpx;
}
.little-banner /deep/ uni-image {
  width: 100%;
  height: 100%;
}
.index-card /deep/ .title {
  background-color: #ffffff;
  color: #000;
  font-size: 16px;
  padding: 30rpx 30rpx 18rpx 30rpx;
}
.index-card /deep/ .morelink {
  display: inline-block;
  font-size: 12px;
  color: #02b8cd;
  margin-right: 5px;
}
.index-card /deep/ .morelink::after {
  content: " ";
  position: relative;
  top: -1px;
  display: inline-block;
  height: 7px;
  width: 7px;
  border-width: 1px 1px 0 0;
  border-color: #02b8cd;
  border-style: solid;
  transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
}
.index-card /deep/ .headline-box {
  padding: 0 15rpx;
}
.index-card /deep/ .index-headline {
  white-space: nowrap;
}
.index-card /deep/ .index-headline .item {
  width: 50%;
  padding: 15rpx;
  display: inline-block;
  box-sizing: border-box;
  vertical-align: text-top;
}
.index-card /deep/ .index-headline .item .label-name {
  font-size: 26rpx;
  color: #000;
  line-height: 1.5;
  white-space: normal;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  margin-top: 10rpx;
}
.index-card /deep/ .index-headline .item .img {
  width: 100%;
  height: 190rpx;
  border-radius: 12rpx;
  overflow: hidden;
  text-align: center;
}
.index-card /deep/ .index-headline .item .img uni-image {
  /* width: 100%;
  height: 100%; */
}
.index-card /deep/ .activity-list {
  padding: 0 30rpx;
}
.index-card /deep/ .activity-list .item {
  margin-bottom: 24rpx;
}
.index-card /deep/ .activity-list .item:last-child {
  margin-bottom: 0;
}
.index-card /deep/ .activity-list .activity-img-box {
  position: relative;
  height: 405rpx;
  border-radius: 12rpx;
  overflow: hidden;
}
.index-card /deep/ .activity-list .activity-img-box uni-image {
  border-radius: 12rpx;
  width: 100%;
}
.index-card /deep/ .activity-list .activity-img-box .label {
  width: 75px;
  height: 22px;
  color: #fff;
  font-size: 12px;
  position: absolute;
  bottom: 0;
  right: 0;
  text-align: center;
  line-height: 22px;
}
.index-card /deep/ .activity-list .activity-img-box .label.end {
  background-color: #a4a4a4;
}
.index-card /deep/ .activity-list .activity-img-box .label.in {
  background-color: #05b8cd;
}
.index-card /deep/ .activity-list .activity-img-box uni-image {
  /* height: 100%;
  width: 100%; */
}
.index-card /deep/ .activity-list .content {
  padding: 20rpx 0;
}
.index-card /deep/ .activity-list .content .title {
  font-size: 32rpx;
  margin-bottom: 15rpx;
}
.suspension-box {
  opacity: 0;
}
.category-container {
  padding: 0 0 10px 0;
  margin-top: 16rpx;
  position: relative;
  background-color: white;
}
.category-container .category-box {
  background-color: #fff;
  display: flex;
  flex-wrap: wrap;
  box-shadow: 0px 0px 18px 0px rgba(5, 5, 5, 0.15);
  width: 700rpx;
  margin-left: 25rpx;
  border-radius: 10px;
  padding: 20rpx 0;
  position: inherit;
}
.category-container .category-box .category-list {
  width: 175rpx;
  text-align: center;
  display: inline-block;
  overflow: hidden;
}
.category-container .category-box .category-list .type-item-on {
  color: #e64340;
  border-bottom: 1rpx solid #e64340;
}
.category-container .category-box .category-list .category-column {
  width: 100%;
  margin-top: 20rpx;
  overflow: hidden;
}
.category-container
  .category-box
  .category-list
  .category-column
  .category-imgbox {
  width: 100rpx;
  height: 100rpx;
}
.category-container
  .category-box
  .category-list
  .category-column
  .category-title {
  font-size: 24rpx;
  text-align: center;
}
.home {
  padding-bottom: 60px;
}
.min_height {
  min-height: auto;
  width: 98px;
}
.main_title {
  background-color: #fff;
  padding: 20rpx 0px;
  padding-bottom: 0px;
  margin: 0px 20rpx;
}
.dis_fl {
  display: flex;
  justify-content: space-between;
}
.text_r {
  margin-top: 2px;
  color: #666666;
  display: flex;
  align-items: center;
}
.home_sign {
  margin: 10px;
  border-radius: 6px;
  overflow: hidden;
}
.cu-avatar {
  margin-right: 10px;
}
.action {
  font-size: 50rpx;
}
.home-top {
  height: 135px;
  padding-top: 14px;
  background: linear-gradient(to top, #1d4259, #122640);
  width: 100%;
  position: absolute;
}
.search-form [class*="cuIcon-"] {
  margin: 0 0.5em 0 0.8em;
}
.search-form [class*="cuIcon-"]::before {
  top: 0rpx;
}
.search-form input {
  -webkit-box-flex: 1;
  -webkit-flex: 1;
  flex: 1;
  padding-right: 30rpx;
  height: 64rpx;
  line-height: 64rpx;
  font-size: 26rpx;
  background-color: initial;
}
.search-form {
  background-color: #f5f5f5;
  line-height: 64rpx;
  height: 64rpx;
  font-size: 24rpx;
  color: #333;
  -webkit-box-flex: 1;
  -webkit-flex: 1;
  flex: 1;
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
  -webkit-box-align: center;
  -webkit-align-items: center;
  align-items: center;
  margin: 0 30rpx;
}
.search-index {
  background: rgba(0, 0, 0, 0.1);
  opacity: 0.5;
}
.search-form input {
  -webkit-box-flex: 1;
  -webkit-flex: 1;
  flex: 1;
  text-align: left;
  padding-right: 30rpx;
  height: 64rpx;
  line-height: 64rpx;
  font-size: 26rpx;
  background-color: initial;
}
.search-round {
  border-radius: 5000rpx;
  border-bottom-right-radius: 20rpx;
}
.home-jfg2 {
  display: flex;
  justify-content: space-between;
  padding: 30rpx 50rpx;
  text-align: center;
  margin: 10px;
  color: #333333;
  background: #fff;
}
.index_tb {
  background-color: #122640;
  color: white;
}
.dis {
  display: flex;
}
.icon_wz {
  font-size: 24rpx;
  height: 18px;
  padding-left: 5px;
  padding-right: 15px;
}
.dis > view {
  display: flex;
}
.home-gg {
  margin: 10px;
  display: flex;
  background: #fff;
  height: 20px;
  border-radius: 6px;
  padding: 12px;
}
.home-gg2 {
  display: flex;
  padding-left: 5px;
}
.home-gg2 > view:nth-child(1) {
  transform: skewX(-30deg);
  width: 44px;
  height: 20px;
  background: linear-gradient(to top left, #f7ce9e, #d69c63);
  text-align: center;
  color: #fff;
  border-radius: 3px;
}
.home {
  background: #f8f8f8;
  height: 99.5%;
  width: 100%;
  animation: fadeIn 0.6s;
  min-height: 99.5vh;
}
.home-gg2 > view:nth-child(2) {
  font-size: 13px;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-family: PingFang;
  font-weight: 400;
  margin-left: 10px;
  width: 80%;
  overflow: hidden;
  color: #333333;
}
.home-gg2 > view:nth-child(1) view {
  display: inline-block;
  transform: skewX(30deg);
}
.home-jcly {
  margin: 10px;
  min-height: 400px;
  padding-top: 1px;
  background: #fff;
  margin-top: 0px;
}
.bg_kl {
  background: #c16550;
  color: #fff;
}
.bg_kl2 {
  background: #40749c;
  color: #fff;
}
.mt10 {
  margin-top: 20px !important;
}
.cuIcon-newshotfill {
  font-size: 30px;
}
.bg_kl3 {
  background: #f2bf80;
  color: #fff;
}
.cu-avatar-group {
  padding-left: 10rpx;
}
.page-cont,
.shadow-box {
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 99999;
  background-color: rgba(22, 23, 24, 0.8);
}
.page-cont .top {
  width: 100%;
  display: flex;
  flex-direction: column;
}
.page-cont .top /deep/ uni-image {
  width: 51px;
  height: 61px;
  margin: 15% 0 4% 74%;
  animation: jello 4s;
}
.page-cont .top .p_one {
  float: right;
  width: 80%;
  font-size: 28rpx;
  line-height: 72rpx;
  color: #fff;
  background: #2575f4;
  text-align: center;
  border-radius: 34rpx;
  margin: 0 0 0 15%;
  animation: fadeInLeft 1s;
}
.cont > view:nth-child(1) {
  animation: fadeInLeft 2s;
}
.cont > view:nth-child(2) {
  animation: fadeInLeft 3s;
}
.cont > view:nth-child(3) {
  animation: fadeInLeft 4s;
}
.page-cont .cont {
  width: 100%;
  margin-top: 30rpx;
  display: flex;
  flex-direction: column;
}
.page-cont .cont .cont-p {
  width: 80%;
  margin-left: 5%;
  margin-top: 30rpx;
  display: flex;
  color: #fff;
  font-size: 30rpx;
  line-height: 72rpx;
}
.page-cont .cont .cont-p .text {
  color: #fff;
  font-size: 30rpx;
  line-height: 40rpx;
  width: 40rpx;
  height: 40rpx;
  text-align: center;
  border-radius: 50%;
  background: #2575f4;
  margin-right: 20rpx;
  margin-top: 16rpx;
  display: flex;
  flex-direction: column;
}
.page-cont .cont .cont-p /deep/ uni-image {
  width: 41px;
  height: 28px;
  margin: 8rpx 0 0 20rpx;
  border: 1px dashed #fff;
}
.page-cont .cont .cont-p-lib {
  width: 90%;
  margin-left: 5%;
  display: flex;
  color: #fff;
  font-size: 30rpx;
}
.page-cont .cont .cont-p-lib .text {
  color: #fff;
  font-size: 30rpx;
  line-height: 40rpx;
  width: 40rpx;
  height: 40rpx;
  text-align: center;
  border-radius: 50%;
  background: #27c084;
  margin-right: 20rpx;
  margin-top: 16rpx;
  display: flex;
  flex-direction: column;
}
.page-cont .cont .cont-p-three {
  width: 80%;
  margin-left: 10%;
  margin-top: 30rpx;
  display: flex;
  align-items: center;
  color: #fff;
  font-size: 30rpx;
  line-height: 72rpx;
}
.page-cont .cont .cont-p-three /deep/ uni-image {
  width: 41px;
  height: 32px;
  margin-right: 20rpx;
}
.page-cont .bottom {
  width: 60%;
  animation: fadeIn 7s;
  font-size: 30rpx;
  line-height: 72rpx;
  text-align: center;
  border-radius: 44rpx;
  border: 1px solid #fff;
  margin: 10% auto 0 auto;
  color: #fff;
}
.cont-p-three .right {
  font-size: 18rpx;
  line-height: 46rpx;
  color: #fff;
}
.cont-p-three .right {
  width: 200px;
  height: 104px;
  padding: 10px 20px;
  background: #666769;
  border: 1px dashed #fff;
  display: flex;
  text-align: center;
  box-sizing: border-box;
  font-size: 18rpx;
  line-height: 46rpx;
  color: #fff;
}
.page-cont view {
  font-size: 0.85rem;
  box-sizing: border-box;
}
.cont-p-three .right .left-p {
  display: flex;
  flex-direction: column;
  flex: 1;
  text-align: center;
  align-items: center;
}
</style>
