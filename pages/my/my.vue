<template>
  <view>
    <view class="cu-modal show" v-if="show">
      <view class="cu-dialog">
        <view class="cu-bar bg-white justify-end">
          <view class="content">微信登录</view>
          <view class="action" @tap="hideModal">
            <text class="icon icon-cuo del text-red"></text>
          </view>
        </view>
        <view class="padding">
          <view class="logo">
            <image
              src="cloud://dev-4gju2hza605fd6b2.6465-dev-4gju2hza605fd6b2-1304525964/worldTree/loding.gif"
            ></image>
          </view>
          <view class="content2">
            <view>可可申请获取以下权限</view>
            <text>获得你的公开信息(昵称，头像等)</text>
          </view>
        </view>
        <view class="cu-bar bg-white">
          <view class="actic">
            <button class="cu-btn bg_kl3" @tap="hideModal">取消</button>
            <button @tap="getUserProfile" size="default" class="cu-btn b_kl4">
              确定
            </button>
          </view>
        </view>
      </view>
    </view>
    <view class="phone-warp">
      <nav-bar :show-nav="false" page-name="我的"></nav-bar>

      <scroll-view class="phone-body" :scroll-y="true" @scroll="onPageScroll">
        <view class="wx-card">
          <block v-if="userInfoStatus == 2">
            <view class="weui-flex user-box" @tap="toLogin">
              <image-auto
                className="user-image"
                :src="
                  apiUserInfoMap.base.avatarUrl
                    ? apiUserInfoMap.base.avatarUrl
                    : headImage
                "
              ></image-auto>
              <view class="weui-flex__item align-center">
                <view>
                  <text class="user-text">{{
                    apiUserInfoMap.base.nick || "请点击登录"
                  }}</text>
                  <view>
                    <view
                      v-if="apiUserInfoMap.base.nick"
                      @tap.stop.prevent="goScore"
                      class="weui-badge"
                    >
                      {{ score ? (score > 99999 ? "99999+" : score) : 0 }}积分
                    </view>
                  </view>
                </view>
              </view>
            </view>
            <view class="weui-flex text-center">
              <view
                @tap="goToUrl"
                data-url="/api-mall/packageFx/pages/index/index"
                class="weui-flex__item pt8"
              >
                <view class="icon-image">
                  <view class="t-icon t-icon-myicon3"></view>
                </view>
                <text class="icon-text">服务</text>
              </view>
              <view
                @tap="goToUrl"
                data-url="/api-mall/packageFx/pages/myusers/index"
                class="weui-flex__item pt8"
              >
                <view class="icon-image">
                  <view class="t-icon t-icon-myicon4"></view>
                </view>
                <text class="icon-text">团队</text>
              </view>
              <view
                @tap="goToUrl"
                data-url="/api-mall/sign/index"
                class="weui-flex__item pt8"
              >
                <view class="icon-image">
                  <view class="t-icon t-icon-shengqing"></view>
                </view>
                <text class="icon-text">签到</text>
              </view>
              <view
                v-if="!userin.gitee_token"
                @tap="tz"
                data-a="user/gitee_login/index"
                class="weui-flex__item pt8"
              >
                <view class="icon-image">
                  <view class="t-icon t-icon-youhuijuan"></view>
                </view>
                <text class="icon-text">绑定码云</text>
              </view>
              <view
                v-else
                @tap="logout"
                data-a="user/gitee_login/index"
                class="weui-flex__item pt8"
              >
                <view class="icon-image">
                  <view class="t-icon t-icon-youhuijuan"></view>
                </view>
                <text class="icon-text">切换仓库</text>
              </view>
            </view>
          </block>
        </view>

        <view class="wx-card">
          <view class="min_height cu-bar">
            <view class="action sub-title">
              <text class="text-xl text-bold text-tree text-keke"
                >可可助手</text
              >
              <text class="text-ABC text-tree text-boutique">KeHelper</text>
            </view>
          </view>
          <view class="user_jx">
            <navigator
              hover-class="none"
              url="/api-tree/pages/user/plan/index"
              class="nav-li bg_te"
            >
              <view class="nav-title">学习计划</view>
              <view class="nav-name">温故而知新</view>
              <text class="icon icon-qiandao"></text>
            </navigator>
            <navigator
              hover-class="none"
              url="/api-tree/pages/user/plan/index"
              class="nav-li bg_fe"
            >
              <view class="nav-title">学习计划</view>
              <view class="nav-name">了解自我</view>
              <text class="icon icon-dingdan"></text>
            </navigator>
          </view>
        </view>

        <!-- <role-func v-if="isAuth"></role-func> -->

        <view class="wx-card">
          <view class="weui-cells weui-cells_after-title weui-card-cells">
            <view
              @tap="goToUrl"
              data-url="/api-ai/ai-card/main"
              class="weui-cell weui-cell_access"
              hover-class="weui-cell_active"
            >
              <view class="weui-cell__bd">
                <view class="t-icon t-icon-mylist2"></view>
                我的名片
              </view>
              <view class="weui-cell__ft weui-cell__ft_in-access"></view>
            </view>
          </view>
        </view>
        <view class="wx-card">
          <view class="weui-cells weui-cells_after-title weui-card-cells">
            <navigator
              url="/apps-system/setting/setting"
              class="weui-cell weui-cell_access"
              hover-class="weui-cell_active"
            >
              <view class="weui-cell__bd">
                <view class="icon icon-newset"></view>
                设置
              </view>
              <view class="weui-cell__ft weui-cell__ft_in-access"></view>
            </navigator>
          </view>
        </view>
      </scroll-view>
      <!-- <float-menu /> -->
    </view>
  </view>
</template>

<script>
import navBar from "@/components/nav-bar/nav-bar";
// import roleFunc from '../role-func/role-func';
import imageAuto from "@/components/image-auto/image-auto";

import { AUTH, WXAPI } from "../../kek";

import { connectlocalUrl } from "../../core/funcs/transform.url";
import { isAuth } from "../../core/http/auth";

const app = getApp();
export default {
  components: {
    navBar,
    // roleFunc,
    imageAuto,
  },
  data() {
    return {
      headImage: connectlocalUrl(
        "/static/pages/my/my/wechat/myBackgroundview.png"
      ),
      currentUser: {},
      index: 0,
      topStype: "",
      textColor: "",
      isAuth: false,
      userInfoStatus: 2,
      score: 0,
      growth: 0,
      show: false,
      dz: "",
      sc: "",
      nt: "",
      tk: "",
      avatarUrl: "",
      nickName: "",

      userin: {
        gitee_token: "",
        sign: "",
      },

      apiUserInfoMap: {
        base: {
          avatarUrl: "",
          nick: "",
        },
      },
    };
  },
  onLoad: function () {
    AUTH.authorize().then((_res) => {
      AUTH.bindSeller();
    });
  },
  onShow() {
    this.onShowClone();
  },
  onPageScroll: function (_e) {},
  methods: {
    onShowClone() {
      AUTH.checkHasLogined().then((isLogined) => {
        console.log("isLogined", isLogined);
        if (!isLogined) {
          AUTH.login();
        }

        if (wx.cloud) {
          this.getUserApiInfo();
          this.getUserAmount();
        }

        // TOOLS.showTabBarBadge();
      });
    },

    hideModal() {
      this.setData({
        show: false,
      });
    },

    getUserProfile() {
      let db = wx.cloud.database();
      let userid = uni.getStorageSync("userid");
      uni.getUserProfile({
        desc: "展示用户信息",
        success: (res) => {
          this._updateUserInfo(res.userInfo);

          db.collection("user")
            .doc(userid)
            .update({
              data: {
                avatarUrl: res.userInfo.avatarUrl,
                nickName: res.userInfo.nickName,
              },
            })
            .then((_res) => {
              this.setData({
                show: false,
              });
            });
        },
        fail: (err) => {
          uni.showToast({
            title: err.errMsg,
            icon: "none",
          });
        },
      });
    },

    async getUserApiInfo() {
      const res = await WXAPI.userDetail(uni.getStorageSync("token"));
      if (res.code == 0) {
        let data = {};
        data.apiUserInfoMap = res.data;

        if (res.data.base.mobile) {
          data.userMobile = res.data.base.mobile;
        }

        if (res.data.base.nick && res.data.base.avatarUrl) {
          data.userInfoStatus = 2;
        } else {
          data.userInfoStatus = 1;
        }

        const adminUserIds = uni.getStorageSync("adminUserIds");

        if (adminUserIds && adminUserIds.indexOf(res.data.base.id) != -1) {
          data.isAdmin = true;
        }

        if (res.data.peisongMember && res.data.peisongMember.status == 1) {
          data.memberChecked = false;
        } else {
          data.memberChecked = true;
        }

        this.setData(data);
      } else {
        this.setData({
          show: true,
        });
      }
    },

    getUserAmount: function () {
      var that = this;
      WXAPI.userAmount(uni.getStorageSync("token")).then(function (res) {
        if (res.code == 0) {
          that.setData({
            score: res.data.score,
          });
        }
      });
    },

    async _updateUserInfo(userInfo) {
      const postData = {
        token: uni.getStorageSync("token"),
        nick: userInfo.nickName,
        avatarUrl: userInfo.avatarUrl,
        city: userInfo.city,
        province: userInfo.province,
        gender: userInfo.gender,
      };
      const res = await WXAPI.modifyUserInfo(postData);

      if (res.code != 0) {
        uni.showToast({
          title: res.msg,
          icon: "none",
        });
        return;
      }

      uni.showToast({
        title: "登陆成功",
      });
      this.onShowClone({});
    },

    goScore: function () {
      uni.navigateTo({
        url: "/api-mall/score/index",
      });
    },

    toLogin() {
      const currentUser = this.currentUser;

      if (!isAuth()) {
        uni.navigateTo({
          url: "/apps-auth/login/login",
        });
      } else {
        uni.navigateTo({
          url: "/apps-circle/account-home/account-home?id=" + currentUser.id,
        });
      }
    },

    goToUrl(e) {
      uni.navigateTo({
        url: e.currentTarget.dataset.url,
      });
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

    logout() {
      uni.showModal({
        title: "退出提醒",
        content: "是否退出当前登录的码云帐号？",
        showCancel: true,
        confirmText: "退出",
        confirmColor: "#ff4500",
        cancelText: "返回",

        success(res) {
          if (res.confirm) {
            app.globalData.logout();
            uni.navigateTo({
              url: "/api-tree/pages/user/gitee_login/index",
            });
          }
        },
      });
    },

    onPageScroll() {
      console.log("占位：函数 onPageScroll 未声明");
    },

    toCollect() {
      console.log("占位：函数 toCollect 未声明");
    },
  },
};
</script>
<style>
.apifmLogin {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 99999999999;
}
.apifmLogin .s-b {
  width: 70%;
  margin: 0 auto;
  height: 600rpx;
  background-color: #fff;
  margin-top: 40%;
  border-radius: 10rpx;
}
.apifmLogin .s-b .s-l-b {
  text-align: center;
  width: 80%;
  border-bottom: 1px solid #f5f5f5;
  margin: 0 auto;
  padding-top: 20px;
}
.apifmLogin .s-b .s-l-b image {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  display: block;
  margin: 0 auto;
}
.apifmLogin .s-b .s-l-b text {
  font-size: 32rpx;
  margin-top: 20rpx;
  margin-bottom: 20rpx;
  color: #333;
}
.apifmLogin .s-b .s-t-b {
  margin-top: 20rpx;
  margin-bottom: 40rpx;
  text-align: center;
}
.apifmLogin .s-b .s-t-b .s-t-n {
  font-size: 30rpx;
  color: #333;
  width: 80%;
  margin: 0 auto;
}
.apifmLogin .s-b .s-t-b .s-t-i {
  width: 80%;
  margin: 0 auto;
  font-size: 24rpx;
  color: #999;
  margin-top: 10rpx;
}
.apifmLogin .s-b .s-t-b .s-t-i text {
  margin-right: 10rpx;
  font-size: 26rpx;
}
.apifmLogin .s-b button::after {
  border-radius: 4rpx;
  border: 0;
}
.apifmLogin .s-b .l {
  width: 80%;
  height: 70rpx;
  line-height: 45rpx;
  font-size: 30rpx;
  background-color: #04be01;
  color: #fff;
}
.apifmLogin .s-b .c {
  margin-top: 20rpx;
  margin-bottom: 20rpx;
  width: 80%;
  height: 70rpx;
  line-height: 45rpx;
  font-size: 30rpx;
  background-color: #ccc;
  color: #333;
}
.title {
  text-align: center;
  font-size: 36rpx;
  font-weight: 400;
}
.user-box {
  position: relative;
  margin-bottom: 30rpx;
}
.user-box .user-text {
  font-size: 18px;
}
.user-box .weui-badge {
  background-color: #02b8cd;
}
.user-box /deep/ .user-image {
  position: relative;
  width: 124rpx;
  height: 124rpx;
  border-radius: 50%;
  background: #f4f4f4 no-repeat center;
  background-size: cover;
  border: 1rpx #f5f5f5 solid;
  margin-right: 30rpx;
}
.tag-text {
  display: inline-block;
  line-height: 40rpx;
  padding: 0 20rpx;
  border: #dfdfdf solid 1rpx;
  border-radius: 4rpx;
  color: #02b8cd;
  font-size: 24rpx;
}
.grid-box {
  margin-top: 30rpx;
}
.icon-text {
  margin-top: 16rpx;
}
.weui-flex__item.center {
  display: flex;
  align-items: center;
  padding-right: 30rpx;
}
.icon-image {
  text-align: center;
}
.icon-image .t-icon,
.icon-image .icon {
  font-size: 48rpx;
  width: 48rpx;
  height: 48rpx;
}
.swiper-box {
  height: 320rpx;
}
.weui-cell__bd {
  display: flex;
  align-items: center;
}
.weui-cell__bd .t-icon,
.weui-cell__bd .icon {
  width: 16px;
  margin-right: 16rpx;
}
.login-box .logo {
  height: 100rpx;
  width: 100rpx;
  margin: -12rpx 275rpx;
}
.login-box .line {
  height: 2rpx;
  width: 686rpx;
  background-color: #ebedf0;
  margin: 0 32rpx;
}
.login-box .title {
  margin: 2rpx 0 0 12rpx;
  color: #333;
  font-size: 36rpx;
}
.login-box .profile {
  margin: 12rpx 0 0 120rpx;
  color: #999;
  font-size: 28rpx;
}
.login-box .btn {
  margin: 2rpx 32rpx;
}
.user {
  background: #f8f8f8;
  width: 100%;
  animation: fadeIn 0.9s;
}
.header {
  margin: 20rpx 0 20rpx 20rpx;
  border-bottom: 1px solid #ccc;
  text-align: center;
}
.cu-dialog {
  width: 500rpx;
}
.actic button {
  width: 47%;
}
.actic {
  display: flex;
  padding: 0px 10px;
  width: 100%;
  justify-content: space-between;
}
.header image {
  width: 100rpx;
  height: 200rpx;
}
.content2 {
  margin-bottom: 20rpx;
}
/* .cu-modal{
  animation:fadeIn 1s ;
} */
.logo {
  width: 50px;
  height: 50px;
  margin: 0 auto;
  border-radius: 50%;
  overflow: hidden;
  margin-bottom: 10px;
  border: 2px solid #fff;
}
.bg_kl3 {
  border: 1px solid #f2bf80;
  background-color: #fff !important;
  color: #f2bf80;
}
.b_kl4 {
  background-color: #f2bf80 !important;
  color: #fff;
}
.content2 text {
  display: block;
  color: #9d9d9d;
  margin-top: 40rpx;
}
.tj-sction .tj-item,
.order-section .order-item {
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
  flex-direction: column;
  align-items: center;
}
button {
  font-weight: 400;
}
.tj-sction {
  padding-top: 10px;
  border-radius: 6px 6px 0px 0px;
  overflow: hidden;
  /* background-color:rgba(255,255,255,0.6); */
}
.tj-sction,
.order-section {
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
  padding: 0px;
  -webkit-justify-content: space-around;
  justify-content: space-around;
  -webkit-align-content: center;
  align-content: center;
}
.user-section {
  padding: 20rpx 30rpx;
  padding-bottom: 0px;
  position: relative;
  background-size: cover;
  background-position: center center;
  background-image: url("https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fc-ssl.duitang.com%2Fuploads%2Fblog%2F202010%2F09%2F20201009203101_7c5aa.thumb.400_0.jpeg&refer=http%3A%2F%2Fc-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1628927546&t=d5bb0ac4a5bf0337b6993ec0e5bb952b");
  background-color: #122640;
}
.user-section .bg {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 200px;
}
.cu-list {
  padding: 0px 30rpx;
}
.text-tree {
  font-size: 18px !important;
}
.cu-item {
  padding-left: 0px !important;
}
.user-info-box {
  height: 130rpx;
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
  -webkit-box-align: center;
  -webkit-align-items: center;
  align-items: center;
  position: relative;
  z-index: 1;
}
.user-info-box .portrait {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
}
.user-info-box .username {
  font-size: 38rpx;
  color: #fff;
  margin-left: 30rpx;
}
.user-info-box .username2 {
  font-size: 24rpx;
  color: #d69c63;
  margin-left: 30rpx;
}
.vip-card-box {
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -webkit-flex-direction: column;
  flex-direction: column;
  color: #f7d680;
  height: 40rpx;
  background: linear-gradient(to top left, #000000, #434343);
  border-radius: 16rpx 16rpx 0 0;
  overflow: hidden;
  position: relative;
  padding: 20rpx 24rpx;
}
.vip-card-box .card-bg {
  position: absolute;
  top: 20rpx;
  right: 0;
  width: 380rpx;
  height: 260rpx;
}
.vip-card-box .b-btn {
  position: absolute;
  right: 20rpx;
  top: 16rpx;
  width: 140rpx;
  height: 50rpx;
  text-align: center;
  line-height: 50rpx;
  font-size: 22rpx;
  color: #36343c;
  border-radius: 20px;
  background: -webkit-linear-gradient(left, #f9e6af, #ffd465);
  background: linear-gradient(left, #f9e6af, #ffd465);
  z-index: 1;
}
.vip-card-box .tit {
  font-size: 30rpx;
  color: #fff;
  margin-bottom: 28rpx;
}
.vip-card-box .tit .yticon {
  color: #122640;
  margin-right: 16rpx;
}
.vip-card-box .e-b {
  font-size: 24rpx;
  color: #d8cba9;
  margin-top: 10rpx;
}
button {
  padding: 0px;
  margin: 0px;
}
.min_height {
  min-height: 50rpx;
  font-size: 0.85rem;
  box-sizing: border-box;
}
.cu-bar {
  display: flex;
  position: relative;
  align-items: center;
  justify-content: space-between;
}
.bg_fe {
  background-color: #ffc168;
  color: #fff;
}
.bg_te {
  background-color: #56a0d3;
  color: #fff;
}
.cover-container {
  margin-top: -164rpx;
  padding-top: 23px;
  position: relative;
  background-color: #fff;
  height: calc(100vh - 680rpx);
  padding-bottom: 20rpx;
}
.user_jx {
  display: flex;
  padding: 20rpx 0;
  justify-content: space-between;
}
.cover-container .arc {
  position: absolute;
  left: 0;
  top: -34rpx;
  width: 100%;
  height: 36rpx;
}
.tj-sction .tj-item {
  flex-direction: column;
  font-size: 28rpx;
  margin: 20rpx 0px;
  width: 25%;
}
/* button{
  width: 100%!important;
font-weight: 400!important;
} */
.tj-sction .num {
  font-size: 50rpx;
  color: #fff;
  font-weight: 600;
  margin-bottom: 8rpx;
}
.tj-sction .num2 {
  font-size: 26rpx;
  color: #fff;
  margin-bottom: 8rpx;
}
.vip-card-box {
  display: flex;
  flex-direction: column;
  margin: 0px 10px;
  color: #f7d680;
  height: 80rpx;
  background-size: 100% 100%;
  border-radius: 16rpx 16rpx 0 0;
  overflow: hidden;
  position: relative;
  padding: 20rpx 24rpx;
}
.bg_ware {
  position: absolute;
  left: 0;
  bottom: -2rpx;
  width: 100%;
  mix-blend-mode: screen;
  height: 86rpx;
}
.user_form_s {
  display: flex;
  justify-content: space-between;
  width: 70%;
  margin: 0 auto;
  color: #fff;
  text-align: center;
}
.bd_user {
  position: absolute;
  right: 0rpx;
  padding: 0rpx 20rpx;
  background: linear-gradient(to top left, #f7ce9e, #d69c63);
  color: #fff;
  font-size: 12px;
  border-top-left-radius: 12px;
  border-bottom-left-radius: 12px;
}
.dlo {
  color: #fff;
  background: linear-gradient(to top left, #f7ce9e, #d69c63);
  animation: 1s fadeInLeft;
  padding: 0px;
  height: auto;
  padding: 2px 20px;
  font-size: 13px !important;
  margin-left: 30px;
  border-radius: 4px;
  width: 100px;
}
.buto {
  font-size: 12px;
  color: #fff;
  width: 100% !important;
  background: transparent;
  text-align: center !important;
  padding: 0px;
}
.height {
  height: 100%;
}
.nav-li {
  padding: 30rpx;
  width: calc(50% - 20rpx);
  background-image: url("https://image.weilanwl.com/color2.0/cardBg.png");
  background-size: cover;
  background-position: center;
  position: relative;
  z-index: 1;
  border-radius: 6px;
  box-sizing: border-box;
  margin-bottom: 20rpx;
}
.nav-li::after {
  content: "";
  position: absolute;
  z-index: -1;
  background-color: inherit;
  width: 100%;
  height: 100%;
  left: 0;
  bottom: -10%;
  border-radius: 10rpx;
  opacity: 0.2;
  transform: scale(0.9, 0.9);
}
.nav-li.cur {
  color: #fff;
  background: #5eb95e;
  box-shadow: 4rpx 4rpx 6rpx rgba(94, 185, 94, 0.4);
}
.nav-title {
  font-size: 28rpx;
  font-weight: 300;
}
.nav-title::first-letter {
  font-size: 36rpx;
  margin-right: 4rpx;
}
.nav-name {
  font-size: 24rpx;
  text-transform: Capitalize;
  margin-top: 10rpx;
  position: relative;
}
.nav-name::before {
  content: "";
  position: absolute;
  display: block;
  width: 40rpx;
  height: 6rpx;
  background: #fff;
  bottom: 0;
  right: 0;
  opacity: 0.5;
}
.nav-name::after {
  content: "";
  position: absolute;
  display: block;
  width: 100rpx;
  height: 1px;
  background: #fff;
  bottom: 0;
  right: 40rpx;
  opacity: 0.3;
}
.nav-name::first-letter {
  font-weight: bold;
  font-size: 36rpx;
  margin-right: 1px;
}
.nav-li text {
  position: absolute;
  right: 30rpx;
  top: 30rpx;
  font-size: 52rpx;
  width: 60rpx;
  height: 60rpx;
  text-align: center;
  line-height: 60rpx;
}
.logo image {
  height: 100%;
}
.bg_kl3 {
  font-weight: 400;
  margin: 0px;
  width: 47% !important;
}
.b_kl4 {
  font-weight: 400;
  margin: 0px;
  width: 47% !important;
}
</style>
