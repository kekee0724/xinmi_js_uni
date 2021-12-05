<template>
  <view class="index-card">
    <view class="title">
      <view class="weui-flex">
        <view class="weui-flex__item">热门活动</view>
        <view class="weui-flex__item text-right">
          <text @tap="moreActivity" class="primary-color morelink">更多</text>
        </view>
      </view>
    </view>
    <view class="activity-list" v-if="newsList.length" style="background: #fff">
      <view
        class="item"
        :data-id="item.id"
        @tap="goToDetail"
        v-for="(item, index) in newsList"
        :key="index"
      >
        <view class="activity-img-box">
          <image-auto
            cutWidth="384"
            cutHeight="233"
            :src="item.pic"
          ></image-auto>
          <view :class="'label ' + item.statusIcon">{{ item.statusType }}</view>
        </view>

        <view class="content pb0">
          <view class="title omit omit-1">{{ item.title }}</view>
          <view class="weui-flex" style="margin-left: -50rpx">
            <view class="weui-flex__item gray-four-color omit omit-1 size-12">
              <text class="icon icon-newtime size-12 mr5"></text>
              {{ item.descript }}
            </view>
            <view class="gray-four-color size-12">
              <text class="icon icon-newren1 size-12 mr5"></text>
              <text class="color-blue">{{ item.paixu || 0 }}</text>
              人报名
            </view>
          </view>
          <view
            v-if="item.video !== ''"
            class="size-13 gray-four-color omit omit-1"
            style="margin-left: -50rpx"
          >
            <text class="icon icon-newadds size-13 mr5 gray-four-color"></text>
            {{ item.video }}
          </view>
        </view>
      </view>
      <no-data v-if="newsList.length === 0" />
    </view>
    <no-data v-if="!newsList.length" />
  </view>
</template>

<script>
import noData from "@/components/no-data/no-data";
import imageAuto from "@/components/image-auto/image-auto";

import { WXAPI } from "../../../kek";

const app = getApp();
export default {
  components: {
    noData,
    imageAuto,
  },
  data() {
    return {
      newsList: [],
    };
  },
  options: {
    addGlobalClass: true,
  },
  props: {},
  mounted() {
    this.fetchNews();
  },
  methods: {
    goToDetail(e) {
      uni.navigateTo({
        url:
          "../../../apps-activity/activity-detail/activity-detail?activityId=" +
          e.currentTarget.dataset.id,
      });
    },

    fetchNews() {
      WXAPI.cmsArticles({
        categoryId: uni.getStorageSync("news_category_zs").id,
        pageSize: 3,
      }).then((res) => {
        console.log("fetchNews", res.data);

        if (res.code === 0) {
          this.setData({
            newsList: res.data,
          });
        } else {
          this.setData({
            newsList: [],
          });
        }
      });
    },

    moreActivity() {
      app.globalData.discoverIndex = 1;
      uni.switchTab({
        url: "/pages/discover/discover/discover",
      });
    },
  },
};
</script>
<style scoped></style>
