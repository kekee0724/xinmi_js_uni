<template>
  <view>
    <super-scroll-view
      class="phone-body"
      @lower="lower"
      @pulldown="pulldown"
      :refreshertriggered="refreshertriggered"
    >
      <loading :hideLoading="loadingHidden" />
      <no-data v-if="articleList && articleList.length === 0"></no-data>
      <view class="weui-cells warp weui-cells_after-title">
        <view
          :data-id="item.id"
          @tap="goToDetail"
          v-for="(item, index) in articleList"
          :key="index"
        >
          <!-- 单张图片 -->

          <navigator
            v-if="
              item.pic ||
              (item.pictureUrlList && item.pictureUrlList.length) === 1
            "
            url="/pages/discover/article/article"
            class="weui-cell"
          >
            <view class="list-container">
              <view class="weui-flex">
                <view class="weui-flex__item size-16 omit omit-3">
                  {{ item.title }}
                </view>
                <image-auto
                  className="radius-6"
                  styles="width: 210rpx; height: 160rpx"
                  :src="item.pic"
                ></image-auto>
              </view>
              <view class="size-12 gray-three-color mt6">
                <text v-if="item.isRecommend" class="mr17 red-color">推荐</text>
                <text class="adds mr7">{{ item.tags }}</text>
                <text class="time mr7">{{ item.dateAdd }}</text>
                <text class="adds mr7">{{ item.views }}浏览</text>
                <text class="adds">{{ item.commentNumber }}评论</text>
              </view>
            </view>
          </navigator>

          <!-- 多张图片 -->

          <view
            class="weui-cell"
            v-if="
              !item.pic &&
              (item.pictureUrlList && item.pictureUrlList.length) > 1
            "
          >
            <view class="list-container">
              <view class="title omit omit-3">
                {{ item.title }}
              </view>
              <view class="weui-flex">
                <view
                  :class="
                    index === 0 ? 'weui-flex__item' : 'weui-flex__item ml8'
                  "
                  v-for="(item, index1) in item.pictureUrlList"
                  :key="index1"
                >
                  <image-auto
                    className="radius-6"
                    styles="width: 100%; height: 202rpx"
                    :src="item"
                  ></image-auto>
                </view>
              </view>
              <view class="size-12 gray-three-color mt6">
                <text v-if="item.isRecommend" class="mr17 red-color">推荐</text>
                <text class="adds mr7">{{ item.tags }}</text>
                <text class="time mr7">{{ item.dateAdd }}</text>
                <text class="adds mr7">{{ item.views }}浏览</text>
                <text class="adds">{{ item.commentNumber }}评论</text>
              </view>
            </view>
          </view>

          <!-- 没有图片 -->

          <view
            class="weui-cell"
            v-if="
              !item.pic && !(item.pictureUrlList && item.pictureUrlList.length)
            "
          >
            <view class="list-container">
              <view class="title omit omit-3">
                {{ item.title }}
              </view>
              <view class="size-12 gray-three-color mt6">
                <text v-if="item.isRecommend" class="mr17 red-color">推荐</text>
                <text class="adds mr7">{{ item.tags }}</text>
                <text class="time mr7">{{ item.dateAdd }}</text>
                <text class="adds mr7">{{ item.views }}浏览</text>
                <text class="adds">{{ item.commentNumber }}评论</text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </super-scroll-view>
  </view>
</template>

<script>
import superScrollView from "@/components/super-scroll-view/super-scroll-view";
import imageAuto from "@/components/image-auto/image-auto";
import noData from "@/components/no-data/no-data";
import loading from "@/components/loading/loading";
import { WXAPI } from "../../../kek";

export default {
  components: {
    superScrollView,
    imageAuto,
    noData,
    loading,
  },
  data() {
    return {
      pageIndex: 1,
      articleList: [],
      loadingHidden: false,
      refreshertriggered: false,
      articleListhome: "",
    };
  },
  options: {
    addGlobalClass: true,
  },
  props: {
    articleTagValue: String,
  },
  mounted: function () {
    this.fetchNews();
  },
  onPageShow() {
    this.fetchNews();
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
        tagsLike: this.articleTagValue,
      }).then((res) => {
        console.log("fetchNews", res.data);

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
      this.setData({
        loadingHidden: true,
        refreshertriggered: false,
      });
    },

    pulldown() {
      console.log("pulldown");
      this.fetchNews();
    },

    lower() {
      console.log("lower");
      this.fetchNews();
    },
  },
};
</script>
<style></style>
