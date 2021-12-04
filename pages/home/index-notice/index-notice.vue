<template>
  <view class="index-notice">
    <view class="weui-flex" style="height: 68rpx">
      <navigator url="../../../apps-article/notice/notice-list">
        <image class="tips" src="../../../static/images/secretary.png"></image>
      </navigator>
      <view class="weui-flex__item">
        <swiper
          :vertical="true"
          :indicator-dots="false"
          :autoplay="true"
          :interval="2000"
        >
          <block v-for="(item, index) in noticeList" :key="index">
            <swiper-item class="pl10">
              <view class="notice-item" @tap="goNotice" :data-id="item.id">
                <text :class="'omit omit-1 ' + (item.isRead ? 'active' : '')">{{
                  item.title
                }}</text>
                <!-- <view wx:if="{{!item.isRead}}" class="weui-badge_dot ml10">.</view> -->
              </view>
            </swiper-item>
          </block>
          <block v-if="noticeList.length === 0">
            <swiper-item class="pl10">暂无数据</swiper-item>
          </block>
        </swiper>
      </view>
    </view>
  </view>
</template>

<script>
import imageAuto from "@/components/image-auto/image-auto";

import { connectlocalUrl } from "../../../core/funcs/transform.url";

import { WXAPI } from "../../../kek";

export default {
  components: {
    imageAuto,
  },
  data() {
    return {
      noticeList: [],
    };
  },
  onPageShow: function () {},
  onPageHide: function () {},
  onPageResize: function () {},
  options: {
    addGlobalClass: true,
  },
  props: {},
  mounted: function () {
    this.getNotice();
  },
  methods: {
    goToDetail(e) {
      uni.navigateTo({
        url:
          `../../../apps-article/article-detail/article-detail?notice=true&articleid=` +
          e.currentTarget.dataset.id,
      });
    },

    getNotice: function () {
      WXAPI.noticeList({
        pageSize: 25,
      }).then((res) => {
        if (res.code == 0) {
          this.setData({
            noticeList: res.data.dataList,
          });
        }

        console.log("noticeList ", res.data.dataList);
      });
    },

    goNotice(e) {
      const id = e.currentTarget.dataset.id;
      uni.navigateTo({
        url: "/api-mall/notice/show?id=" + id,
      });
    },

    onPageScroll: function (_e) {},
  },
};
</script>
<style scoped>
.weui-badge {
  padding: 0.4em;
  min-width: 0;
}
.weui-badge_dot {
  display: inline-block;
  padding: 0.15em 0.4em;
  min-width: 8rpx;
  border-radius: 50rpx;
  background-color: var(--weui-RED);
  color: var(--weui-RED);
  line-height: 1.2;
  text-align: center;
  font-size: 10rpx;
  vertical-align: middle;
}
.notice-item {
  padding-right: 20rpx;
}
.notice-item text {
  position: relative;
  display: inline-block;
  width: 100%;
}
.notice-item text::after {
  content: "";
  position: absolute;
  height: 15rpx;
  width: 15rpx;
  border-radius: 50%;
  background-color: #ff5b05;
  top: 30rpx;
  right: 0;
}
.notice-item text.active::after {
  display: none;
}
</style>
