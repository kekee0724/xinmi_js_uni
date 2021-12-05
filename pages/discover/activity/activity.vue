<template>
  <view>
    <super-scroll-view
      class="phone-body"
      @lower="onReachBottom"
      @pulldown="onPullDownRefresh"
      :refreshertriggered="refreshertriggered"
    >
      <loading :hideLoading="loadingHidden" />
      <view class="activity-list weui-cells">
        <block v-if="newsList.length">
          <view
            class="weui-cell"
            :data-id="item.id"
            @tap="goToDetail"
            v-for="(item, index) in newsList"
            :key="index"
          >
            <view class="item">
              <view class="activity-img-box">
                <image-auto
                  cutWidth="384"
                  cutHeight="233"
                  :src="item.pic"
                ></image-auto>
                <view :class="'label ' + item.statusIcon">{{
                  item.statusType
                }}</view>
              </view>
              <view class="content pb0">
                <view class="title omit omit-1">{{ item.title }}</view>
                <view class="mb8 omit omit-1">
                  <text class="size-12 mr5 primary-color"
                    >#{{ item.tags }}</text
                  >
                  <text
                    v-if="item.activityTagArr.length"
                    class="size-12 mr5 primary-color"
                    v-for="(iten, idx) in item.activityTagArr"
                    :key="iten.idx"
                  >
                    #{{ iten }}
                  </text>
                </view>
                <view class="weui-flex">
                  <view
                    class="weui-flex__item gray-four-color omit omit-1 size-12"
                  >
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
                >
                  <text
                    class="icon icon-newadds size-13 mr5 gray-four-color"
                  ></text>
                  {{ item.video }}
                </view>
              </view>
            </view>
          </view>
        </block>
        <no-data v-if="newsList.length === 0" />
      </view>
    </super-scroll-view>
  </view>
</template>

<script>
import navBar from "@/components/nav-bar/nav-bar";
import noData from "@/components/no-data/no-data";
import superScrollView from "@/components/super-scroll-view/super-scroll-view";
import imageAuto from "@/components/image-auto/image-auto";
import loading from "@/components/loading/loading";

import { WXAPI } from "../../../kek";

export default {
  components: {
    navBar,
    noData,
    superScrollView,
    imageAuto,
    loading,
  },
  data() {
    return {
      pageIndex: 1,
      newsList: [],
      loadingHidden: false,
      refreshertriggered: false,
      activity: "",

      iten: {
        idx: "",
      },
    };
  },
  options: {
    addGlobalClass: true,
  },
  props: {
    activityTypeValue: String,
  },
  mounted() {
    this.fetchNews();
  },
  onPageShow() {
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
        tagsLike: this.activityTypeValue,
      }).then((res) => {
        console.log("fetchNews", res.data);
        const list = ([...res.data] || []).map((item) => {
          if (item.keywords) {
            item.activityTagArr = item.keywords.split(",");
          } else {
            item.activityTagArr = [];
          }

          return item;
        });

        if (res.code === 0) {
          this.setData({
            newsList: list,
          });
        } else {
          this.setData({
            newsList: [],
          });
        }
      });
      this.setData({
        loadingHidden: true,
        refreshertriggered: false,
      });
    },

    onPullDownRefresh() {
      this.fetchNews();
    },

    onReachBottom() {
      this.fetchNews();
    },
  },
};
</script>
<style>
.primary-color {
  color: #02b8cd;
}
</style>
