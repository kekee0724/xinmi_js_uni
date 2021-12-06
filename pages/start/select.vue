<template>
  <view class="phone-warp">
    <!-- <loading hideLoading="{{loadingHidden}}" /> -->
    <nav-bar
      :nav-style="topStyle"
      :show-nav="true"
      :show-search="false"
      page-name="选择园区"
    ></nav-bar>
    <scroll-view class="phone-body" :scroll-y="true">
      <view class="search">
        <image
          class="icon"
          src="../../static/images/search.svg"
        ></image>
        <input placeholder="搜索园区" @input="searchChange" @confirm="search" />
      </view>
      <view class="shops" v-for="(item, index) in shops" :key="item.id">
        <view class="t">
          <view class="name">
            <image
              :src="
                'cloud://dev-4gju2hza605fd6b2.6465-dev-4gju2hza605fd6b2-1304525964/assets/images/icon/' +
                (index == 0 ? 'shop-on' : 'shop') +
                '/static/api-mall/shop/.svg'
              "
            ></image>
            <text :style="'color:' + (index == 0 ? '#FEB21C' : '#333333')">{{
              item.name
            }}</text>
          </view>
          <view v-if="index == 0" class="distance">
            {{ item.distance }}
            <text>km</text>
          </view>
        </view>

        <view class="p">
          <image
            src="cloud://dev-4gju2hza605fd6b2.6465-dev-4gju2hza605fd6b2-1304525964/assets/images/icon/pos-gray.svg"
          ></image>
          <text>{{ item.address }}</text>
        </view>

        <view class="p">
          <image
            src="cloud://dev-4gju2hza605fd6b2.6465-dev-4gju2hza605fd6b2-1304525964/assets/images/icon/time-gray.svg"
          ></image>
          <text>{{ item.openingHours }}</text>
        </view>

        <view class="p">
          <image
            src="cloud://dev-4gju2hza605fd6b2.6465-dev-4gju2hza605fd6b2-1304525964/assets/images/icon/tel-gray.svg"
          ></image>
          <text>{{ item.linkPhone }}</text>
        </view>

        <view
          v-if="index > 0"
          class="distance-black"
          @tap="goShop"
          :data-idx="index"
        >
          <text class="d">{{ item.distance }}</text>
          <text class="u">km</text>
          <image
            src="cloud://dev-4gju2hza605fd6b2.6465-dev-4gju2hza605fd6b2-1304525964/assets/images/icon/next.svg"
          ></image>
        </view>

        <button
          v-if="index == 0"
          class="goHotel"
          type="default"
          @tap="goShop"
          :data-idx="index"
          style="width: 700rpx; line-height: 70rpx"
        >
          进入园区
        </button>
      </view>
    </scroll-view>
    <!-- <float-menu /> -->
  </view>
</template>

<script>
const { AUTH, WXAPI } = require("../../kek");

const { setLocalStorage } = require("../../core/funcs/storage");

export default {
  data() {
    return {
      shops: "",
      searchValue: "",
      topStyle: "",
    };
  },
  onLoad: function (_options) {},
  onReady: function () {},
  onShow: function () {
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
  },
  onHide: function () {},
  onUnload: function () {},
  onPullDownRefresh: function () {},
  onReachBottom: function () {},
  methods: {
    async fetchShops(latitude, longitude, kw) {
      const res = await WXAPI.fetchShops({
        curlatitude: latitude,
        curlongitude: longitude,
        nameLike: kw,
      });

      if (res.code == 0) {
        res.data.forEach((ele) => {
          ele.distance = ele.distance.toFixed(3); // 距离保留3位小数
        });
        this.setData({
          shops: res.data,
        });
      } else {
        this.setData({
          shops: null,
        });
      }
    },

    searchChange(event) {
      this.setData({
        searchValue: event.detail.value,
      });
    },

    search(event) {
      this.setData({
        searchValue: event.detail.value,
      });
      this.fetchShops(this.latitude, this.longitude, event.detail.value);
    },

    goShop(e) {
      const idx = e.currentTarget.dataset.idx;
      uni.setStorageSync("shopInfo", this.shops[idx]);
      uni.setStorageSync("shopIds", this.shops[idx].id);
      setLocalStorage("parkId", this.shops[idx].number);
      setLocalStorage("parkName", this.shops[idx].name);
      console.log("goShop",idx)
      uni.switchTab({
        url: "/pages/home/home",
      });
    },
  },
};
</script>
<style>
.search {
  background: #eee;
  padding: 14rpx 24rpx;
  position: relative;
}
.search input {
  background: #ffffff;
  border-radius: 10rpx;
  height: 72rpx;
  padding-left: 56rpx;
}
.search .icon {
  position: absolute;
  width: 28rpx;
  height: 28rpx;
  top: 36rpx;
  left: 40rpx;
}
.shops {
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 28rpx 24rpx 24rpx 24rpx;
  border-bottom: 1rpx solid #ddd;
}
.shops .t {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.shops .t .name image {
  width: 26rpx;
  height: 32rpx;
}
.shops .t .name text {
  margin-left: 12rpx;
  font-family: PingFangSC-Medium;
  font-size: 28rpx;
  letter-spacing: 0.34rpx;
  text-align: center;
  line-height: 28rpx;
}
.shops .t .distance {
  font-family: PingFangSC-Medium;
  font-size: 32rpx;
  color: #feb21c;
  letter-spacing: 0.38rpx;
  text-align: right;
  line-height: 28rpx;
}
.shops .t .distance text {
  margin-left: 10rpx;
  font-family: PingFangSC-Regular;
  font-size: 24rpx;
  color: #feb21c;
  letter-spacing: 0.28rpx;
  text-align: right;
  line-height: 24rpx;
}
.shops .p {
  margin-top: 24rpx;
}
.shops .p {
  display: flex;
  align-items: center;
}
.shops .p image {
  width: 20rpx;
  height: 24rpx;
}
.shops .p text {
  margin-left: 14rpx;
  font-family: PingFangSC-Regular;
  font-size: 24rpx;
  color: #999999;
  letter-spacing: 0.28rpx;
  text-align: center;
  line-height: 24rpx;
}
.goHotel {
  margin-top: 28rpx;
  width: 700rpx;
  height: 72rpx;
  line-height: 72rpx;
  background: #feb21c !important;
  color: #ffffff !important;
  font-family: PingFangSC-Medium;
  font-size: 28rpx;
}
.distance-black {
  position: absolute;
  top: 100rpx;
  right: 24rpx;
}
.distance-black .d {
  font-family: PingFangSC-Medium;
  font-size: 32rpx;
  color: #333333;
  letter-spacing: 0.38rpx;
  text-align: right;
  line-height: 28rpx;
}
.distance-black .u {
  margin-left: 10rpx;
  font-family: PingFangSC-Regular;
  font-size: 24rpx;
  color: #333333;
  letter-spacing: 0.28rpx;
  text-align: right;
  line-height: 24rpx;
}
.distance-black image {
  margin-left: 12rpx;
  width: 14rpx;
  height: 24rpx;
}
</style>
