<template>
  <view class="index-card">
    <view class="title">
      <view class="weui-flex">
        <view class="weui-flex__item">微头条</view>
        <view class="weui-flex__item text-right">
          <text @tap="moreArticle" class="primary-color morelink">更多</text>
        </view>
      </view>
    </view>
    <view class="headline-box" style="background: #fff">
      <scroll-view
        class="index-headline"
        :scroll-y="false"
        :scroll-x="true"
        @scroll="onPageScroll"
      >
        <view
          class="item"
          :data-id="item.id"
          @tap="goToDetail"
          v-for="(item, index) in articleList"
          :key="index"
        >
          <view class="img">
            <image-auto :src="item.pic"></image-auto>
            <!-- <image-auto
						src="{{item && item.coverUrl ? item.coverUrl : item.pictureUrlList && item.pictureUrlList[0] ? item.pictureUrlList[0] : ''}}">
					</image-auto> -->
          </view>

          <view class="label-name">{{ item.title }}</view>
        </view>
        <no-data v-if="articleList.length === 0" />
      </scroll-view>
    </view>
  </view>
</template>

<script>
import imageAuto from "@/components/image-auto/image-auto";

import { WXAPI } from "../../../kek";

const app = getApp();
export default {
  components: {
    imageAuto,
  },
  data() {
    return {
      articleList: [],
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
      this.fetchNews()
  },
  methods: {
    goToDetail(e) {
      uni.navigateTo({
        url:
          "../../../apps-article/article-detail/article-detail?articleid=" +
          e.currentTarget.dataset.id,
      });
    },

    fetchNews() {
      WXAPI.cmsArticles({
        categoryId: uni.getStorageSync("news_category_dt").id,
        pageSize: 5,
      }).then((res) => {
        if (res.code === 0) {
          this.setData({
            articleList: res.data,
          });
        } else {
          this.setData({
            articleList: [],
          });
        }
      });
    },

    onPageScroll: function (_e) {},

    moreArticle() {
      app.globalData.discoverIndex = 2;
      uni.switchTab({
        url: "/pages/discover/discover/discover",
      });
    },
  },
};
</script>
<style scoped></style>
