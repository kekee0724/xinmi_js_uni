<template>
  <view>
    <swiper
      class="swiper_box"
      @change="swiperchange"
      :indicator-dots="true"
      indicator-active-color="#fff"
    >
      <swiper-item v-for="(item, index) in banners" :key="item.id">
        <image mode="aspectFill" @tap="imgClick" :src="item.picUrl" />
      </swiper-item>
    </swiper>
    <view class="btn">
      <button
        v-if="swiperCurrent + 1 == swiperMaxNumber"
        type="primary"
        size="mini"
        @tap="goToIndex"
        class="weui-btn mini-btn"
      >
        进入园区
      </button>
    </view>
  </view>
</template>

<script>
const { CONFIG, WXAPI } = require("../../kek");

var app = getApp();
export default {
  data() {
    return {
      banners: [],
      swiperMaxNumber: 0,
      swiperCurrent: 0,
    };
  },
  onLoad: function () {
    uni.setNavigationBarTitle({
      title: uni.getStorageSync("mallName"),
    });
    let shopMod = uni.getStorageSync("shopMod");

    if (!shopMod) {
      shopMod = 0;
    }

    const app_show_pic_version = uni.getStorageSync("app_show_pic_version");

    if (app_show_pic_version && app_show_pic_version == CONFIG.version) {
      if (shopMod == 1) {
        uni.redirectTo({
          url: "/pages/start/select",
        });
      } else {
        uni.navigateTo({
          url: "/pages/example/components",
          // pages/index/index
        });
      }
    } else {
      WXAPI.banners({
        type: "app",
      })
        .then((res) => {
          if (res.code == 700) {
            if (shopMod == 1) {
              uni.redirectTo({
                url: "/api-mall/shop/select",
              });
            } else {
              uni.navigateTo({
                url: "/api-main/index/index",
              });
            }
          } else {
            this.setData({
              banners: res.data,
              swiperMaxNumber: res.data.length,
            });
          }
        })
        .catch(function (_e) {
          if (shopMod == 1) {
            uni.redirectTo({
              url: "/api-mall/shop/select",
            });
          } else {
            uni.navigateTo({
              url: "/api-main/index/index",
            });
          }
        });
    }
  },
  onShow: function () {},
  methods: {
    swiperchange: function (e) {
      this.setData({
        swiperCurrent: e.detail.current,
      });
    },

    goToIndex: function (_e) {
      let shopMod = uni.getStorageSync("shopMod");

      if (!shopMod) {
        shopMod = 0;
      }

      if (app.globalData.isConnected) {
        uni.setStorage({
          key: "app_show_pic_version",
          data: CONFIG.version,
        });

        if (shopMod == 1) {
          uni.redirectTo({
            url: "/api-mall/shop/select",
          });
        } else {
          uni.navigateTo({
            url: "/api-main/index/index",
          });
        }
      } else {
        uni.showToast({
          title: "当前无网络",
          icon: "none",
        });
      }
    },

    imgClick() {
      if (this.swiperCurrent + 1 != this.swiperMaxNumber) {
        uni.showToast({
          title: "左滑进入",
          icon: "none",
        });
      }
    },
  },
};
</script>
<style>
swiper {
  width: 100vw;
  height: 100vh;
}

swiper-item {
  width: 100vw;
  height: 100vh;
}

image {
  width: 100vw;
  height: 100vh;
}

.btn {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 50rpx;
  display: flex;
  justify-content: center;
  width: 100%;
  background-color: transparent;
}
</style>
