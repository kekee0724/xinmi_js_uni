<template>
  <view :class="switcState == false ? 'phone-warp' : 'phone-warp showEdit'">
    <loading :hideLoading="loadingHidden" />
    <nav-bar page-name="服务" :show-nav="false"></nav-bar>
    <no-data v-if="contentData && contentData.length === 0" text="暂无服务" />
    <block v-if="contentData.length">
      <view class="whitespace-md dark"></view>
      <view class="phone-body service-main" :scroll-y="true">
        <view v-for="(item, index) in contentData" :key="index">
          <view class="tit">{{ item.moduleName }}</view>

          <view class="whitespace-md"></view>

          <view class="grid-box">
            <navigator
              class="row"
              :url="cell.routeKey"
              :data-item="cell"
              v-for="(cell, idx) in item.children"
              :key="idx"
            >
              <view class="addcut-box">
                <text
                  :class="
                    'icon ' +
                    (cell.isExist
                      ? 'icon-smalljian type-cut-off'
                      : 'icon-smalladd type-add')
                  "
                ></text>
              </view>

              <view class="bd">
                <view><text :class="cell.iconUrl"></text></view>
                <view class="omit omit-1">{{ cell.moduleName }}</view>
              </view>
            </navigator>
          </view>
        </view>

        <!-- <block> -->
        <!-- <view class="tit">服务</view>
			<view class="whitespace-md"></view>
			<view class="grid-box">
				<navigator class="row" wx:for="{{server}}" url="{{cell.openpath}}" hover-class="none" open-type="navigate"
					wx:for-item="cell" wx:for-index="idx" wx:key="idx">
					<view class="addcut-box">
						<text class="icon {{cell.isExist ? 'icon-smalljian type-cut-off' : 'icon-smalladd type-add'}}"></text>
					</view>
					<view class="bd">
						<view><text class="{{cell.img}}"></text></view>
						<view class="omit omit-1">{{cell.text}}</view>
					</view>
				</navigator>
			</view> -->
        <!-- </block> -->
      </view>
    </block>
  </view>
</template>

<script>
// "use strict";
import noData from "@/components/no-data/no-data";
import navBar from "@/components/nav-bar/nav-bar";
import loading from "@/components/loading/loading";

import { getLocalStorage, setStorageObject } from "../../core/funcs/storage";
// console.log(getLocalStorage, setStorageObject)
import { parkAppModule, parkHomeModule } from "./mock";

export default {
  components: {
    noData,
    navBar,
    loading,
  },
  data() {
    return {
      headData: [], // 首页自定义区应用列表
      switcState: false, // 是否编辑状态
      server: [],
      loadingHidden: false,
      contentData: [],

      cell: {
        routeKey: "",
        idx: "",
        isExist: false,
        iconUrl: "",
        moduleName: "",
      },
    };
  },
  onShow() {
    this.setData({ switcState: false });
    this.getAppModules();
  },
  methods: {
    judgeIsExist(menu, headList) {
      return menu.map((item) => {
        item.children = (item.children || []).map((x) => {
          if (headList.find((y) => y.id === x.id)) {
            x.isExist = true;
          } else {
            x.isExist = false;
          }
          return x;
        });
        return item;
      });
    },

    /**
     * 获取服务应用列表
     * @param params
     */
    async getAppModules() {
      try {
        let data = {},
          headData,
          list,
          contentData;

        // await db
        //   .collection("parkAppModule")
        //   .doc(getLocalStorage("parkId"))
        //   .get()
        //   .then((res) => {
        //     //res.data 包含该记录的数据
        //     data = res.data;
        //   });
        data = parkAppModule;

        headData = parkHomeModule;
        //   await db
        //     .collection("parkHomeModule")
        //     .doc(getLocalStorage("parkId"))
        //     .get()
        //     .then((res) => {
        //       //res.data 包含该记录的数据
        //       headData = res.data.homeList;
        //     });

        (list = data.serviceList || []),
          (contentData = this.judgeIsExist(list, headData));
        setStorageObject("servicecacheModules", data);
        this.setData({
          loadingHidden: true,
          contentData: contentData || [],
          headData,
        });
      } catch (e) {
        uni.showToast({
          title: `${e?.errmsg || e}`,
          icon: "none",
          duration: 2000,
        });
      }
    },
  },
};
</script>
<style>
.sever-box {
  padding: 14px 15px;
  background-color: #fff;
  font-size: 14px;
}
.type-cut {
  color: #f15a4a;
}
.type-add {
  color: #02b8cd;
}
.type-cut-off {
  color: #d3d3d3;
}
.sever-box .bd {
  flex: 1 1;
}
.sever-box .bd text {
  margin-left: 15px;
}
.sever-box .sever-btn {
  font-size: 14px;
  color: #02b8cd;
}
.color-1 {
  color: #ee5a40;
}
.color-2 {
  color: #85c920;
}
.color-3 {
  color: #ffa200;
}
.color-4 {
  color: #00b2c6;
}
.color-5 {
  color: #0c8ef2;
}
.color-6 {
  color: #27c5a6;
}
.color-7 {
  color: #55a892;
}
.color-8 {
  color: #536480;
}
.color-9 {
  color: #b54fe0;
}
.color-10 {
  color: #333333;
}
.grid-box {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(auto);
  grid-gap: 10px;
  place-items: center;
  margin: 0 10px 10px 10px;
}
.grid-box .row {
  position: relative;
  width: 100%;
  height: 65px;
  display: flex;
  justify-content: center;
  box-sizing: border-box;
  padding-top: 8px;
}
.grid-box .row .bd {
  position: relative;
  z-index: 1;
  text-align: center;
}
.grid-box .row .bd .icon {
  font-size: 20px;
}
.addcut-box {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  display: none;
  background-color: #f6f6f6;
  border-radius: 4px;
}
.addcut-box text {
  position: absolute;
  font-size: 20px;
  right: -6px;
  top: -7px;
}
.showEdit .addcut-box {
  display: block;
}
.service-main .tit {
  font-size: 16px;
  font-weight: bold;
  padding: 15px 10px 0 10px;
}
</style>
