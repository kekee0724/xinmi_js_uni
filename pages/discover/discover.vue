<template>
  <view>
    <view v-if="!openChange" class="phone-warp">
      <nav-bar :show-nav="false" :show-search="false" :nav-style="topStyle">
        <view class="disover-tabs">
          <view
            :class="'item ' + (selectIndex == index ? 'active' : '')"
            @tap="tabsOnChang"
            :data-index="index"
            v-for="(item, index) in tab"
            :key="item.key"
          >
            <text>{{ item }}</text>
          </view>
        </view>
      </nav-bar>

      <!-- 话题 -->
      <block v-if="selectIndex == 0">
        <circle-discover
          class="phone-body"
          :categoryValue="categoryValue"
        ></circle-discover>
      </block>
      <!-- 话题--end -->

      <!-- 活动 -->
      <block v-if="selectIndex == 1">
        <activity-list
          class="phone-body"
          :activityTypeValue="activityTypeValue"
        ></activity-list>
      </block>
      <!-- 活动--end -->

      <!--资讯-->
      <block v-if="selectIndex == 2">
        <article-discover class="phone-body" :articleTagValue="articleTagValue">
        </article-discover>
      </block>
      <!--资讯-end-->

      <!--题库-->
      <!-- <block v-if="selectIndex == 2">
        <dictionaries class="phone-body"></dictionaries>
      </block> -->
      <!--题库-end-->

      <!--云库-->
      <block v-if="selectIndex == 3">
        <warehouse class="phone-body"></warehouse>
      </block>
      <!--云库-end-->
    </view>

    <view v-if="openChange" class="phone-warp market-tag-list">
      <nav-bar
        :navBackIntercept="true"
        @navBackIntercept="navBackIntercept"
        page-name=""
        :show-nav="true"
        :show-search="false"
      ></nav-bar>
      <view class="service-screen-title">话题</view>
      <view class="pt10 size-16 search-tag">
        <text
          @tap="changeTag"
          :data-index="0"
          :data-name="item.tagName"
          :data-value="item.tagValue"
          :class="(tagName === item.tagName ? 'active item' : 'item') + ' tag'"
          v-for="(item, index) in cirecletag"
          :key="index"
        >
          <text>{{ item.tagName }}</text>
        </text>
      </view>
      <view class="service-screen-title">活动</view>
      <view class="pt10 size-16 search-tag">
        <text
          @tap="changeTag"
          :data-index="1"
          :data-name="item.tagName"
          :data-value="item.tagValue"
          :class="(tagName === item.tagName ? 'active item' : 'item') + ' tag'"
          v-for="(item, index) in activitytag"
          :key="index"
        >
          <text>{{ item.tagName }}</text>
        </text>
      </view>
      <view class="service-screen-title">资讯</view>
      <view class="pt10 size-16 search-tag">
        <text
          @tap="changeTag"
          :data-index="2"
          :data-name="item.tagName"
          :data-value="item.tagValue"
          :class="(tagName === item.tagName ? 'active item' : 'item') + ' tag'"
          v-for="(item, index) in articletag"
          :key="index"
          ><text>{{ item.tagName }}</text></text
        >
      </view>
    </view>

    <view class="suspension-box" style="opacity: 1">
      <view :class="'menu-list ' + (type ? 'show' : 'false')">
        <block v-if="selectIndex == 0">
          <view class="item" @tap="toAddDynamic">
            <view class="icon icon-jiahao"></view>
            <view>发布</view>
          </view>
        </block>
        <view @tap="searchClick" class="item">
          <view class="icon icon-sousuo"></view>
          <view>搜索</view>
        </view>
        <view @tap="changeOpen" class="item">
          <view class="icon icon icon-newsever"></view>
          <view>筛选</view>
        </view>
      </view>
      <view class="suspension-btn" @tap="drawer" :data-state="type"
        >快捷导航</view
      >
    </view>
  </view>
</template>

<script>
"use strict";
import activityList from './activity/activity';
import articleDiscover from './article/article-discover';
import circleDiscover from './circle/circle-discover';
// import warehouse from './warehouse/index';
// import dictionaries from './answer/index';

import { isAnonymous, isAuth } from "../../core/http/auth";

import { DiscoverTypeEnum } from "./common/common";

const app = getApp();
export default {
  components: {
    activityList,
    articleDiscover,
    circleDiscover,
    // warehouse,
    // dictionaries
  },
  data() {
    return {
      selectIndex: 0,
      tags: [],
      tab: ["摄影", "活动", "资讯", "云库"],
      openChange: false,
      type: false,
      categoryValue: "",
      activityTypeValue: "",
      articleTagValue: "",
      tagName: "",
      activitytag: "",
      cirecletag: "",
      articletag: "",
      toLeft: "",
      tabIndex: "",
      topStyle: "",
    };
  },
  onLoad() {},
  onReady() {},
  onShow() {
    this.setData({
      selectIndex: app.globalData.discoverIndex,
    });
  },
  methods: {
    clear() {
      this.setData({
        categoryValue: "",
        activityTypeValue: "",
        articleTagValue: "",
        tagName: "",
      });
    },

    tabsOnChang: function (e) {
      var _a;

      this.setData({
        type: false,
      });
      this.clear();
      let selectIndex = e.currentTarget.dataset.index;
      app.globalData.discoverIndex = selectIndex;
      this.setData({
        selectIndex,
      });

      if (
        (_a = e.target.dataset) === null || _a === void 0 ? void 0 : _a.name
      ) {
        let tagName = e.target.dataset.name;
        let tagValue = e.target.dataset.value;
        if (this.tagName === tagName) {
          this.clear();
          this.setData({
            tagName: "",
          });
          tagValue = "";
        }

        if (selectIndex === DiscoverTypeEnum.circle) {
          this.setData({
            categoryValue: tagValue,
            activityTypeValue: "",
            articleTagValue: "",
          });
        } else {
          if (selectIndex === DiscoverTypeEnum.activityDiscover) {
            this.setData({
              categoryValue: "",
              activityTypeValue: tagName,
              articleTagValue: "",
            });
          } else {
            if (selectIndex === DiscoverTypeEnum.articleHome) {
              this.setData({
                categoryValue: "",
                activityTypeValue: "",
                articleTagValue: tagName,
              });
            }
          }
        }
      }
    },

    searchClick() {
      this.clear();
      this.setData({
        type: false,
      });

      if (!isAuth()) {
        uni.navigateTo({
          url: "/apps-auth/login/login",
        });
        return;
      }

      uni.navigateTo({
        url: "/apps-search/search/search?isDiscover=true",
      });
    },

    navBackIntercept() {
      this.setData({
        openChange: false,
      });
    },

    changeOpen() {
      this.setData({
        openChange: true,
        type: false,
      });
    },

    changeTag(e) {
      const tagName = e.target.dataset.name;
      const tagValue = e.target.dataset.value;
      this.tabsOnChang(e);
      this.setData({
        tagName,
        toLeft: 74 * +tagValue,
        openChange: false,
        tabIndex: tagValue,
      });
    },

    toAddDynamic() {
      this.setData({
        type: false,
      });

      if (isAnonymous()) {
        uni.navigateTo({
          url: "/apps-auth/login/login",
        });
      } else {
        uni.navigateTo({
          url: "/apps-circle/add-dynamic/add-dynamic?isList=" + true,
        });
      }
    },

    drawer: function (e) {
      this.setData({
        type: !e.currentTarget.dataset.state,
      });
    },
  },
};
</script>
<style>
.disover-tabs {
  display: flex;
  align-items: center;
  padding: 16rpx 180rpx 0 30rpx;
  box-sizing: border-box;
  position: relative;
  z-index: 99;
}
.disover-tabs .item {
  position: relative;
  font-size: 32rpx;
  color: #666666;
  display: inline-block;
  width: 20%;
  text-align: center;
  top: -10rpx;
  transform: translate3d(0, 0, 0);
}
.disover-tabs .item text {
  transition: 0.2s;
  display: inline-block;
}
.disover-tabs .item.active text {
  transform: scale3d(1.3, 1.3, 1.3);
  color: #000000;
}
.disover-tabs .item.active::after {
  content: "";
  position: absolute;
  width: 30rpx;
  height: 6rpx;
  background-color: #05b8cd;
  border-radius: 30px;
  bottom: -14rpx;
  left: 50%;
  margin-left: -15rpx;
}
.weui-cells.warp .weui-cell {
  align-items: flex-start;
}
.topic-list {
  padding: 0 32rpx;
  margin: 0;
}
.topic-list > .weui-cell {
  background-color: #fbfbfb;
  border-radius: 12rpx;
  margin-bottom: 32rpx;
}
.topic-list > .weui-cell:last-child {
  margin-bottom: 0;
}
.topic-header {
  padding: 30rpx 30rpx 18rpx 30rpx;
  color: #000;
  font-size: 36rpx;
}
.infor-popver {
  position: relative;
}
.infor-popver .triangle {
  position: absolute;
  left: 180rpx;
  top: 63rpx;
  display: inline-block;
  width: 0;
  height: 0;
  border-bottom: 10rpx solid #555;
  border-left: 10rpx solid transparent;
  transition: 0.4s;
  z-index: 2;
}
.infor-popver .triangle.active {
  transform: matrix(0, -1, 1, 0, 0, 0);
}
.infor-popver .bd {
  position: absolute;
  left: 10rpx;
  top: 36rpx;
  display: block;
  background-color: #fff;
  box-shadow: 0 0 10rpx #00000036;
  transition: 0.3s;
  height: 0;
  overflow: hidden;
  opacity: 0;
  transform: translate(0, -16rpx);
  box-sizing: border-box;
  border-radius: 6rpx;
  z-index: 9;
}
.infor-popver .bd::after {
  content: "";
  position: absolute;
  top: -7rpx;
  left: 50%;
  width: 14rpx;
  height: 14rpx;
  border-radius: 2rpx;
  background-color: #fff;
  transform: rotate(45deg);
  margin-left: -7rpx;
  z-index: 0;
  box-shadow: 0 0 8rpx rgba(26, 8, 8, 0.2);
}
.infor-popver .bd text {
  position: relative;
  z-index: 1;
  display: block;
  font-size: 14px;
  padding: 10px 14px 0 14px;
  background-color: #fff;
  color: #aaa;
  border-radius: 3px;
}
.infor-popver .bd text.active {
  color: #333;
}
.infor-popver .bd.show {
  top: 90rpx;
  height: 136rpx;
  overflow: initial;
  opacity: 1;
  transform: translate(0, 0);
}
.grid-img {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(auto);
  grid-gap: 16rpx;
  place-items: center;
  margin: 0 0 20rpx 0;
}
.grid-img .rows {
  position: relative;
  width: 100%;
}
.grid-img .rows image {
  width: 100%;
  height: 180rpx;
}
.flex-img .weui-flex__item {
  padding: 0 10rpx;
}
.phone-warp /deep/ .activity-list .item {
  width: 100%;
}
.phone-warp /deep/ .activity-list .item:last-child {
  margin-bottom: 0;
}
.phone-warp /deep/ .activity-list .activity-img-box {
  position: relative;
  height: 405rpx;
  border-radius: 12rpx;
  overflow: hidden;
}
.phone-warp /deep/ .activity-list .activity-img-box images {
  border-radius: 12rpx;
}
.phone-warp /deep/ .activity-list .activity-img-box .label {
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
.phone-warp /deep/ .activity-list .activity-img-box .label.end {
  background-color: #a4a4a4;
}
.phone-warp /deep/ .activity-list .activity-img-box .label.in {
  background-color: #05b8cd;
}
.phone-warp /deep/ .activity-list .activity-img-box .label.regist {
  background-color: #ff7600;
}
.phone-warp /deep/ .activity-list .activity-img-box image {
  /* height: 100%; */
  width: 100%;
}
.phone-warp /deep/ .activity-list .content {
  padding: 20rpx 0;
}
.phone-warp /deep/ .activity-list .content .title {
  font-size: 32rpx;
  margin-bottom: 15rpx;
}
.more {
  width: 100rpx;
  height: 100%;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}
.more text {
  font-size: 36rpx;
  color: #666;
}
.market-tag-list .icon-guanbi::before {
  color: #252525;
}
.market-tag-list .flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.market-tag-list .search-tag {
  margin: 10rpx 20rpx;
}
.market-tag-list .search-tag .item {
  display: inline-block;
  width: 33.33333333%;
  background-color: #ffffff;
  height: 72rpx;
  text-align: center;
}
.market-tag-list .search-tag .item text {
  height: 52rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6d6a6a;
  background-color: #eaecec;
  border-radius: 40rpx;
  margin: 10rpx auto;
}
.market-tag-list .search-tag .item.active text {
  background-color: #eaf8fa;
  color: #05b8cd !important;
}
.service-screen-title {
  padding-bottom: 0rpx;
  font-size: 40rpx;
  color: #000000;
  margin: -14rpx 42rpx;
}
.suspension-btn {
  height: 150rpx;
  width: 150rpx;
  border-radius: 50%;
  background-color: #02b8cd;
  color: #ffffff;
  padding: 12px 40rpx;
  box-sizing: border-box;
  display: flex;
  align-content: center;
  justify-content: center;
  font-size: 32rpx;
  position: relative;
  z-index: 9;
}
.suspension-box {
  box-shadow: 0 0 16rpx 0 rgba(0, 0, 0, 0.3);
  position: fixed;
  bottom: 110rpx;
  right: 30rpx;
  width: 150rpx;
  background-color: #ffffff;
  border-radius: 100rpx;
  z-index: 2;
}
.menu-list {
  position: relative;
  z-index: 8;
  padding: 16rpx 0;
  box-sizing: border-box;
  transition: 0.2s;
  opacity: 1;
  height: "auto";
}
.menu-list.false {
  height: 0;
  padding: 0;
  overflow: hidden;
  opacity: 0;
}
.menu-list .item {
  padding: 12rpx 0;
  text-align: center;
}
.menu-list .item .icon {
  font-size: 46rpx;
  color: #888888;
}
.menu-list .item .icon.hint {
  position: relative;
}
.menu-list .item .icon.hint::after {
  content: "";
  position: absolute;
  height: 15rpx;
  width: 15rpx;
  border-radius: 50%;
  background-color: red;
  top: 15rpx;
  right: 56rpx;
}
</style>
