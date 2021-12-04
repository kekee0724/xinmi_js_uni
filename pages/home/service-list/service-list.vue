<template>
  <view class="garid">
    <navigator
      class="garid-item"
      :data-item="item"
      :url="item.routeKey"
      v-for="(item, index) in garid"
      :key="index"
    >
      <view class="icon-bg">
        <text :class="item.iconUrl"></text>
      </view>

      <view class="garid-label">{{ item.moduleName }}</view>
    </navigator>
  </view>
</template>

<script>
import { getLocalStorage, setStorageObject } from "../../../core/funcs/storage";

import { parkHomeModule } from "../../service/mock";
export default {
  data() {
    return {
      garid: [],
      member: "",
    };
  },
  options: {
    addGlobalClass: true,
  },
  props: {},
  onPageShow() {
    
  },
  mounted() {
      this.getUserProfile();
  },
  methods: {
    async getUserProfile() {
      try {
        let result = [];
        // await db
        //   .collection("parkHomeModule")
        //   .doc(getLocalStorage("parkId"))
        //   .get()
        //   .then((res) => {
        //     result = res.data.homeList;
        //   });
        result = parkHomeModule;
        result.push({
          iconUrl: "icon icon-qita color-0",
          moduleName: `更多`,
          routeKey: `/service`,
          openType: 0,
        });
        this.setData({
          garid: result,
        });
        setStorageObject("homecacheService", result);
      } catch (e) {
        uni.showToast({
          title: `${(e === null || e === void 0 ? void 0 : e.errmsg) || e}`,
          icon: "none",
          duration: 2000,
        });
      }
    },
  },
};
</script>
<style>
.garid .garid-item {
  padding: 25rpx 0;
  width: 25%;
  display: inline-block;
  text-align: center;
}
.garid .garid-item .icon-bg {
  position: relative;
  width: 84rpx;
  height: 84rpx;
  border-radius: 50%;
  margin: 0 auto;
  text-align: center;
  line-height: 84rpx;
  color: #ffffff;
}
.garid .garid-item .icon-bg text {
  font-size: 32rpx;
}
.garid .garid-item .garid-label {
  position: relative;
  display: block;
  font-size: 26rpx;
  padding-top: 15rpx;
  color: #666;
}
.garid .garid-item:nth-of-type(1) .icon-bg {
  background-image: -webkit-linear-gradient(120deg, #2f60d2 0%, #4c9bf9 100%);
}
.garid .garid-item:nth-of-type(2) .icon-bg {
  background-image: -webkit-linear-gradient(120deg, #00a591 0%, #00d4be 100%);
}
.garid .garid-item:nth-of-type(3) .icon-bg {
  background-image: -webkit-linear-gradient(120deg, #e68a28 0%, #ffc47f 100%);
}
.garid .garid-item:nth-of-type(4) .icon-bg {
  background-image: -webkit-linear-gradient(120deg, #e0453d 0%, #ff8781 100%);
}
.garid .garid-item:nth-of-type(5) .icon-bg {
  background-image: -webkit-linear-gradient(120deg, #00acc4 0%, #12d5ee 100%);
}
.garid .garid-item:nth-of-type(6) .icon-bg {
  background-image: -webkit-linear-gradient(120deg, #0da2e6 0%, #5dd1ff 100%);
}
.garid .garid-item:nth-of-type(7) .icon-bg {
  background-image: -webkit-linear-gradient(120deg, #5b67f0 0%, #8996fe 100%);
}
.garid .garid-item:nth-of-type(8) .icon-bg {
  background-image: -webkit-linear-gradient(120deg, #bfbfbf 0%, #bfbfbf 100%);
}
</style>
