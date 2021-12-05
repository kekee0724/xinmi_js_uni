<template>
  <!-- <cu-custom bgColor="se">
  <view slot="content">可可书库</view>
</cu-custom> -->
  <view class="page-box">
    <view class="ans_bst">
      <view class="cu-bar bg-white solid-bottom">
        <view class="action sub-title">
          <text class="text-xl text-bold text-tree">笔试题 105题</text>
          <text class="bg-tree"></text>
        </view>
        <navigator class="ntp" url="/api-tree/pages/answer/fl_problem/index">
          查看更多
          <van-icon name="arrow" />
        </navigator>
      </view>
      <view class="scroll_box">
        <scroll-view scroll-x>
          <navigator
            hover-class="item-hover"
            :url="'/api-tree/pages/details/details_pro/index?id=' + items._id"
            class="item_list"
            v-for="(items, index) in xw_list"
            :key="index"
          >
            <view class="item_list_ds">
              <view class="dis2">
                <view class="item_top_Wz">热</view>
                <view class="item_top_Wz2">{{ items.problem }}</view>
              </view>
            </view>
          </navigator>
        </scroll-view>
      </view>
    </view>
    <view class="whitespace-md dark"></view>
    <view class="ans_xzt">
      <view class="cu-bar bg-white solid-bottom">
        <view class="action sub-title">
          <text class="text-xl text-bold text-tree">选择题</text>
          <text class="bg-tree"></text>
          <!-- last-child选择器-->
        </view>
      </view>
      <view class="order">
        <view class="top">
          <view class="left">
            <view class="cuIcon-titles text-blue"></view>
            <view class="store">JavaScript</view>
          </view>
          <view class="right">
            <text class="text-blue"></text>
            <view class="progressBox">
              <view class="cu-progress radius striped active">
                <view
                  class="bg-tree"
                  :style="'width:' + (loading ? '25%' : '') + ';'"
                  >25%</view
                >
              </view>
            </view>
          </view>
        </view>
        <view class="item" :wx-for="dataList.goodsList" :key="index">
          <view class="left">
            <image
              src="cloud://dev-4gju2hza605fd6b2.6465-dev-4gju2hza605fd6b2-1304525964/worldTree/JavaScript.png"
              mode="aspectFill"
            ></image>
          </view>
          <view class="content">
            <view class="type"
              >JavaScript是一种属于网络的高级脚本语言,已经被广泛用于Web应用开发,常用来为网页添加各式各样的动态功能,为用户提供更流畅美观的浏览效果</view
            >
          </view>
        </view>
        <view class="fgx" color="#f1f1f1" margin="24rpx 0 15rpx 0"></view>
        <view class="bottom">
          <view>
            <text class="text-tree">题库题目{{ js_L }}道</text>
          </view>
          <navigator
            class="btnBox"
            url="/api-tree/pages/answer/details_ans/index?id=Js"
          >
            <view @tap="goClass" class="evaluate btn">开始答题</view>
          </navigator>
        </view>
      </view>

      <view class="whitespace-md dark"></view>

      <view class="order">
        <view class="top">
          <view class="left">
            <view class="cuIcon-titles text-blue"></view>
            <view class="store">HTML+CSS</view>
          </view>
          <view class="right">
            <text class="text-blue"></text>
            <view class="progressBox">
              <view class="cu-progress radius striped active">
                <view
                  class="bg-tree"
                  :style="'width:' + (loading ? '30%' : '') + ';'"
                  >30%</view
                >
              </view>
            </view>
          </view>
        </view>
        <view class="item" :wx-for="dataList.goodsList" :key="index">
          <view class="left">
            <image
              src="cloud://dev-4gju2hza605fd6b2.6465-dev-4gju2hza605fd6b2-1304525964/worldTree/HTML.png"
              mode="aspectFill"
            ></image>
          </view>
          <view class="content">
            <view class="type">
              HTML称为超文本标签语言，是一种标识性的语言。它包括一系列标签．通过这些标签可以将网络上的文档格式统一，使分散的Internet资源连接为一个逻辑整体
            </view>
          </view>
        </view>
        <view class="fgx" color="#f1f1f1" margin="24rpx 0 15rpx 0"></view>
        <view class="bottom">
          <view>
            <text class="text-tree">题库题目{{ CS_L }}道</text>
          </view>
          <navigator
            class="btnBox"
            url="/api-tree/pages/answer/details_ans/index?id=CSS"
          >
            <view @tap="goClass" class="evaluate btn">开始答题</view>
          </navigator>
        </view>
      </view>
    </view>

    <view class="whitespace-md dark"></view>

    <view class="study_list">
      <view class="cu-bar bg-white solid-bottom">
        <view class="action sub-title">
          <text class="text-xl text-bold text-tree">面试精讲</text>
          <text class="bg-tree"></text>
          <!-- last-child选择器-->
        </view>
      </view>
      <list :list="wz_list"></list>
    </view>

    <!-- <view class="whitespace-md dark"></view> -->
  </view>
</template>

<script>
"use strict";
import list from "@/components/tree_list/index";

Object.defineProperty(exports, "__esModule", {
  value: true,
});

const api_1 = require("../../../utils/api");

const task = require("../../../utils/request");

let db;
if (!wx.cloud) {
  console.error("请使用 2.2.3 或以上的基础库以使用云能力");
} else {
  db = wx.cloud.database({
    env: "dev-4gju2hza605fd6b2",
  });
}
export default {
  components: {
    list,
  },
  data() {
    return {
      loading: true,
      wz_list: {},
      xw_list: "",
      js_L: "",
      CS_L: "",

      dataList: {
        goodsList: "",
      },
    };
  },
  props: {},
  created() {
    this.post();
  },
  methods: {
    tz: function (e) {
      console.log(e.currentTarget.dataset.id);
      uni.navigateTo({
        url:
          "/api-tree/pages/" +
          e.currentTarget.dataset.a +
          "?id=" +
          e.currentTarget.dataset.id +
          "&limt=" +
          e.currentTarget.dataset.limt,
      });
    },

    post() {
      if (!wx.cloud) {
        console.error("请使用 2.2.3 或以上的基础库以使用云能力");
      } else {
        task.Tree_get(api_1.api.GET_press_ms).then((res) => {
          this.setData({
            wz_list: res,
          });
        });
        task.Tree_get(api_1.api.GET_interview_ms).then((res) => {
          this.setData({
            xw_list: res,
          });
          console.log(this.xw_list);
        });
        db.collection("interview")
          .where({
            select: true,
            ly: "Js",
          })
          .count()
          .then((res) => {
            this.setData({
              js_L: res.total,
            });
          });
        db.collection("interview")
          .where({
            select: true,
            ly: "CSS",
          })
          .count()
          .then((res) => {
            this.setData({
              CS_L: res.total,
            });
          });
      }
    },

    goClass() {
      console.log("占位：函数 goClass 未声明");
    },
  },
};
</script>
<style>
/* @import "../../style/main.css";
@import "../../style/animated.css";
 */

.order {
  width: 710rpx;
  background-color: #ffffff;
  margin: 20rpx auto;
  margin-top: 0px;

  box-sizing: border-box;
  padding: 20rpx;
  font-size: 28rpx;
}

.order .top {
  display: flex;

  justify-content: space-between;
}
.page-box {
  animation: fadeIn 0.9s;
}

.order .top .left {
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;

  align-items: center;
}

.order .top .left .store {
  margin: 0 10rpx;
  font-size: 34rpx;
  font-weight: bold;
}

.order .top .right .progressBox {
  width: 200rpx;
  float: right;
}

.order .item {
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
  margin: 20rpx 0 0;
}

.order .item .left {
  margin-right: 20rpx;
}
.cuIcon-titles {
  height: 100%;
  width: 4px;
  border-radius: 4px;
  background-color: #1d4259;
}
.order .item .left image {
  width: 260rpx;
  height: 130rpx;
  border-radius: 10rpx;
}

.order .item .content .title {
  font-size: 28rpx;
  line-height: 45rpx;
}

.order .item .content .type {
  margin: 6rpx 0;
  font-size: 24rpx;
  color: #909399;
  text-overflow: -o-ellipsis-lastline;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
}

.order .item .content .delivery-time {
  color: #0081ff;
  font-size: 24rpx;
}

.order .item .right {
  margin-left: 10rpx;
  padding-top: 20rpx;
  text-align: right;
}

.order .item .right .decimal {
  font-size: 24rpx;
  margin-top: 4rpx;
}

.order .item .right .number {
  color: #909399;
  font-size: 24rpx;
}

.order .bottom {
  line-height: 70rpx;

  display: flex;

  justify-content: space-between;

  align-items: center;
}

.order .bottom .btnBox .btn {
  line-height: 52rpx;
  width: 140rpx;
  border-radius: 12rpx;
  font-size: 26rpx;
  text-align: center;
  color: #909399;
}

.order .bottom .btnBox .evaluate {
  color: #fff;
  background-color: #1d4259;
}

.fgx {
  margin: 12px 0px 7px;
  border-bottom: 1px solid rgb(241, 241, 241);
  width: 100%;
  transform: scaleY(0.5);
  border-top-color: rgb(241, 241, 241);
  border-right-color: rgb(241, 241, 241);
  border-left-color: rgb(241, 241, 241);
}

.item_list {
  width: 63%;
  height: 100%;
  padding: 20rpx;
  margin-right: 23rpx;
  display: inline-block;
  margin-left: 10px;
  background-color: rgb(240, 240, 240);
  border-radius: 7px;
}
.scroll_box {
  width: 100%;
  height: 157rpx;
  overflow: hidden;
  padding: 20rpx;
  margin-top: 20rpx;

  white-space: nowrap;
}

.item-hover {
  background: rgb(230, 230, 230) !important;
}
.item_list_ds {
  display: flex;
  justify-content: space-between;
}

.problem_list {
  background-color: #fff;
  border-radius: 12px;
  margin: 5px;
  padding: 10px 13px;
}
.pro_wz1 {
  font-size: 20px;
}
.tille-1 {
  font-size: 18px;
  font-family: PingFang;
  font-weight: bold;
  margin-bottom: 15px;
  padding-left: 10px;
  color: rgba(51, 51, 51, 1);
  border-left: 2px solid rgb(246 150 4);
}
.pro_mec {
  display: flex;
}
.pro_mec_tl {
  color: #909399;
}
.pro_list {
  padding: 10px;
  padding-top: 0px;
  padding-left: 0px;
  background-color: #fff;
  margin: 10px;
  display: flex;
  border-radius: 4px;
}
.dis {
  display: flex;
}
.pro_list_wz {
  background: linear-gradient(to top left, #f7ce9e, #d69c63);

  display: flex;
  align-items: center;
  color: #fff;
  border-radius: 4px;
  padding: 0px 10px;
  font-size: 12px;
}
.ntp {
  height: 100%;
  padding: 7px;
  display: flex;
  align-items: center;
}
.bg-tree {
  background-color: #d69c63;
  color: #d69c63;
}
.pro_list_wz_mc {
  white-space: nowrap;
  text-overflow: ellipsis;
  color: #303133;
  padding-left: 10px;
  width: calc(100% - 50px);
  overflow: hidden;
  white-space: nowrap;
}
.pro_list_wz_rs {
  float: right;
  color: #606266;
}
.clean {
  clear: both;
}
.home-wntj {
  margin: 10px;
  padding: 10px;

  background: #fff;
  border-radius: 6px;
}
.home-wntj > view:nth-child(2) {
  display: flex;
  justify-content: space-between;
}

.home-fl {
  width: 48%;
  font-family: PingFang;
  line-height: 26px;
  text-align: center;
  color: rgba(51, 51, 51, 1);
}

.home-fl > view:nth-child(1) {
  height: 93px;
  border-radius: 3px;
}
.servic_top {
  padding-top: 14px;
  background: linear-gradient(to top, #1d4259, #122640);

  color: #fff;
  padding: 15px 15px;
  padding-top: 10px;
  border-radius: 0px 0px 10px 10px;
}
.servic_top_Img {
  width: 100px;
  height: 35px;
}
.servic_top_Dl {
  display: flex;
  justify-content: space-between;
}
.servic_top_Wz1 {
  font-size: 16px;
  margin-bottom: 5px;
  color: #f7ce9e;
}
.servic_top_Wz2 {
  border: 1px solid #f7ce9e;
  font-size: 20rpx;
  color: #f7ce9e;
  padding: 3px 5px;
}
.servic_top_tw {
  color: #f3c684;
  font-size: 30px;
  margin: 10px 0px;
}
.servic_top_tw2 {
  color: #a5a7ad;
}
.servic_top_tw3 {
  margin-top: 14px;
  color: #a5a7ad;
  font-size: 15px;
}
.item-hover {
  background: rgb(230, 230, 230) !important;
}
.item_list_ds {
  display: flex;
  justify-content: space-between;
}

.item_top_Wz2 {
  margin-left: 10rpx;
  word-break: break-all;
  height: 78rpx;
  white-space: pre-wrap;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;

  width: calc(100% - 27px);
}
.item_list_ds {
  display: flex;
  justify-content: space-between;
}
.dis > view {
  display: flex;
  line-height: 38rpx;
}
.icon_wz {
  padding-left: 5px;
  padding-right: 15px;
  font-size: 24rpx;
  overflow: hidden;
  height: 20px;
}
.home-list-bottom > view:nth-child(1) {
  color: rgba(153, 153, 153, 1);
  text-align: center;
  margin: 6px;
  margin-left: 0px;
  margin-top: 1px;
  padding-top: 2.5px;
  font-family: PingFang;
}
.dis2 {
  display: flex;
  height: 40px;
}
.ans_bst {
  margin: 10px;
  background-color: #fff;
  border-radius: 6px;
  overflow: hidden;
  padding-bottom: 20rpx;
}
.cu-bar {
  min-height: 90rpx;
}
.ans_xzt {
  margin: 10px;
  border-radius: 20rpx;
  overflow: hidden;
}
.study_list {
  margin: 10px;
  margin-top: 20rpx;
  border-radius: 6px;
  padding-top: 10rpx;
  background-color: #fff;
  margin-bottom: 120rpx;
}

.item_top_Wz {
  background-color: #fbbd08;
  width: 19px;
  text-align: center;
  height: 19px;
  display: inline-block;
  color: #fff;
  font-size: 24rpx;
  border-radius: 4rpx;
  font-weight: 700;
  padding: 2rpx;
}
.header_content {
  display: flex;

  flex-direction: row;
}
.title {
  font-size: 42rpx;
  font-weight: bold;
  color: rgba(255, 255, 255, 1);
}

.sub_title {
  margin-top: 3px;

  font-weight: 400;
  color: rgba(255, 255, 255, 1);

  background: linear-gradient(
    0deg,
    rgba(120, 255, 224, 1) 0%,
    rgba(255, 255, 255, 1) 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>
