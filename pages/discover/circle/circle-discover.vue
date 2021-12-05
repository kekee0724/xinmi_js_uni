<template>
  <view>
    <super-scroll-view
      :refreshdisable="true"
      class="phone-body"
      @lower="lower"
      @pulldown="pulldown"
      :refreshertriggered="refreshertriggered"
    >
      <loading :hideLoading="loadingHidden" />
      <view class="weui-cells">
        <view class="topic-header">
          <view class="weui-flex align-center">
            <view class="weui-flex__item main-title">热门推荐</view>
            <view class="weui-flex__item text-right">
              <text @tap="moreCircle" class="morelink size-12">更多</text>
            </view>
          </view>
        </view>
        <!-- <view class="weui-cells  no-border topic-list weui-cells_after-title">
      <block wx:if="{{hotCircle.length}}">
        <navigator wx:for="{{hotCircle}}" wx:key="id" url="/apps-circle/circle-details/circle-details?id={{item.id}}"
          class="weui-cell weui-cell_example">
          <view class="weui-cell__hd mr15">
            <image-auto className="radius-6" styles="height:120rpx;width:120rpx" src="{{item.avatarPictureUrl}}">
            </image-auto>
          </view>
          <view class="weui-cell__bd">
            <view class="list-container">
              <view class="title mb12 omit omit-1">{{item.topicName}}</view>
              <view class="content">
                <view class="weui-flex">
                  <view class="weui-flex__item">成员<text class="primary-color ml5">{{item.memberCount}}</text></view>
                  <view class="weui-flex__item">动态<text class="primary-color ml5">{{item.postCount}}</text></view>
                </view>
              </view>
            </view>
          </view>
          <view class="weui-cell__ft">
            <view wx:if="{{item.isSubscribe}}" id="{{item.id}}" class="tag disabled" catchtap="outJoin">已参与</view>
            <view wx:if="{{!item.isSubscribe}}" id="{{item.id}}" class="tag" catchtap="toJoin">去参与</view>
          </view>
        </navigator>
      </block>
      <block wx:if="{{hotCircle && hotCircle.length === 0}}">
        <no-data />
      </block>
    </view> -->

        <swiper
          class="swipers"
          :circular="true"
          previous-margin="30rpx"
          duration="300"
          next-margin="30rpx"
        >
          <swiper-item
            class="swiper-items"
            v-for="(item, index) in cmsRecommendCategories"
            :key="item.id"
          >
            <view class="swiper-item" @tap="goArticleList" :data-id="item.id">
              <image :src="item.icon" mode="aspectFill" class="slide-image" />
              <view class="article-info">
                <text class="title">{{ item.name }}</text>
                <text class="discription">{{ item.key }}</text>
              </view>
            </view>
          </swiper-item>
        </swiper>

        <view
          class="classify"
          v-if="bigCategory.level == 1"
          v-for="(bigCategory, index) in cmsCategories"
          :key="bigCategory.id"
        >
          <!-- <view class="classify-title">{{ bigCategory.name }}
        <navigator class="view-all" url='/api-photography/classify/classify?pid={{bigCategory.id}}'
          class="morelink size-12">更多</navigator>
      </view> -->

          <view class="topic-header">
            <view class="weui-flex align-center">
              <view class="weui-flex__item small-title">{{
                bigCategory.name
              }}</view>
              <view class="weui-flex__item text-right">
                <navigator
                  @tap="moreCircle"
                  class="morelink size-12"
                  :url="
                    '/api-photography/classify/classify?pid=' + bigCategory.id
                  "
                  >更多</navigator
                >
              </view>
            </view>
          </view>

          <swiper
            :circular="true"
            previous-margin="30rpx"
            duration="300"
            next-margin="30rpx"
            class="article-warp"
          >
            <swiper-item
              v-for="(swiperItem, index1) in bigCategory.swiperItems"
              :key="index1"
            >
              <block
                v-for="(smallCategory, index2) in swiperItem"
                :key="index2"
              >
                <navigator
                  hover-class="none"
                  class="article-item"
                  :url="
                    '/api-photography/classify/classify?pid=' + smallCategory.id
                  "
                >
                  <image
                    class="article-clover"
                    :src="smallCategory.icon"
                  ></image>
                  <view class="article-info">
                    <text class="article-title">{{ smallCategory.name }}</text>
                    <text class="article-description">{{
                      smallCategory.remark
                    }}</text>
                    <view class="article-view">{{ smallCategory.key }}</view>
                  </view>
                </navigator>
              </block>
            </swiper-item>
          </swiper>
        </view>

        <!-- <view class="topic-header infor-popver">
      <text bindtap="downContent" data-state="{{downState}}">{{tabs[tabIndex].title}}</text>
      <text class="triangle {{downState ? '' : 'active'}}"></text>
      <view class="bd {{downState ? 'show' : ''}}">
        <text bindtap="tabChange" data-value="{{index}}" wx:for="{{tabs}}" wx:key="index"
          class="{{tabIndex === index ? 'active' : ''}}">{{item.title}}</text>
      </view>
    </view> -->

        <!-- <view class="weui-cells comment-list">
      <block wx:if="{{topicList.length}}">
        <navigator wx:for="{{topicList}}" wx:key="id" url="/apps-circle/dynamic-details/dynamic-details?id={{item.id}}"
          class="weui-cell weui-cell_example ">
          <view class="list-container">
            <view class="weui-flex width-full align-center">
              <view class="mr15" id="{{item.publisherId}}" catchtap="toAccountHome">
                <image-auto className="radius-full" styles="height:70rpx;width:70rpx "
                  src="{{item.avatarPictureUrl ? item.avatarPictureUrl : thumb}}">
                </image-auto>
              </view>
              <view class="weui-flex__item" id="{{item.publisherId}}" catchtap="toAccountHome">
                <view class="omit omit-1">{{item.publisher}}</view>
              </view>
              <block wx:if="{{item.publisherId !== currentUserId}}">
                <view class="tag disabled" id="{{item.publisherId}}" wx:if="{{item.follow}}" catchtap="followOut">已关注
                </view>
                <view class="tag" id="{{item.publisherId}}" wx:if="{{!item.follow}}" catchtap="toFollow">关注</view>
              </block>
            </view>
            <view class="mt10 mb5 omit omit-3">
              <html-content html="{{item.postContent}}" />
            </view>
            <image-auto wx:if="{{item.pictureUrlList.length === 1}}" className="radius-8 width-full"
              src="{{item.pictureUrlList[0]}}">
            </image-auto>
            <view class="weui-flex flex-img" wx:if="{{item.pictureUrlList.length === 2}}">
              <view class="weui-flex__item" wx:for="{{item.pictureUrlList}}" wx:for-item="iten" wx:key="iten">
                <image-auto styles="height: 200rpx" className="width-full radius-8" src="{{iten}}">
                </image-auto>
              </view>
            </view>
            <view class="grid-img" wx:if="{{item.pictureUrlList.length > 2}}">
              <view class="rows" wx:for="{{item.pictureUrlList}}" wx:for-item="iten" wx:key="iten">
                <image-auto className="radius-8" src="{{iten}}">
                </image-auto>
              </view>
            </view>
            <view class="weui-flex mt10 mb6">
              <view class="weui-flex__item">
                <text class="gray-three-color">{{item.publishTime}}</text>
              </view>
              <view class="text-right weui-flex">
                <text class="gray-three-color">
                  <text class="icon icon-huifu size-12 mr5"></text>{{item.commentNum || 0}}
                </text>
                <text catchtap="giveLike" data-item="{{item}}" class="ml20 gray-three-color">
                  <text class="icon icon-newzan size-12 mr5"
                    style="{{item.agree ? 'color: rgb(5, 184, 205);' : ''}}"></text>{{item.agreeNum || 0}}
                </text>
              </view>
            </view>
          </view>
        </navigator>
      </block>
      <block wx:if="{{topicList && topicList.length === 0}}">
        <no-data />
      </block>
    </view> -->
      </view>
    </super-scroll-view>
    <!-- <view bindtap="toAddDynamic" class="btn-edit">
  <text class="icon icon-jiahao"></text>
</view> -->
  </view>
</template>

<script>
import navBar from "@/components/nav-bar/nav-bar";
import htmlContent from "@/components/html-content/html-content";
import superScrollView from "@/components/super-scroll-view/super-scroll-view";
import imageAuto from "@/components/image-auto/image-auto";
import loading from "@/components/loading/loading";

import { isAnonymous } from "../../../core/http/auth";
import { connectlocalUrl } from "../../../core/funcs/transform.url";

import { WXAPI } from "../../../kek";

const maxSmallCategoryNumber = 3;
export default {
  components: {
    navBar,
    htmlContent,
    superScrollView,
    imageAuto,
    loading,
  },
  data() {
    return {
      tabs: [
        {
          title: "全部动态",
          value: 0,
        },
        {
          title: "我关注的",
          value: 1,
        },
      ],

      tabIndex: 0,
      pageIndex: 1,
      isMyFollow: false,
      thumb: connectlocalUrl(
        "/static/pages/discover/circle/wechat/myBackgroundview.png"
      ),
      cmsCategories: [],
      cmsRecommendCategories: [],
      loadingHidden: false,
      refreshertriggered: false,

      bigCategory: {
        level: 0,
        id: "",
        name: "",
        swiperItems: [],
      },

      swiperItem: [],

      smallCategory: {
        id: "",
        icon: "",
        name: "",
        remark: "",
        key: "",
      },
    };
  },
  options: {
    addGlobalClass: true,
  },
  props: {
    categoryValue: String,
  },
  beforeMount() {
    this.getPhotos();
  },
  onPageShow() {
    this.getPhotos();
  },
  methods: {
    async getPhotos() {
      // return __awaiter(this, void 0, void 0, function* () {
      const cmsCategories = await WXAPI.cmsCategories();

      if (cmsCategories.code == 0) {
        const _cmsCategories = cmsCategories.data;

        const cmsRecommendCategories = _cmsCategories.filter((entity) => {
          return entity.key == "Recommend";
        });

        _cmsCategories
          .filter((entity) => {
            return entity.level == 1;
          })
          .forEach((bigCategory) => {
            let tmpNumber = 0;
            console.log(tmpNumber);
            bigCategory.swiperItems = [];
            bigCategory.swiperItems.push([]);

            const smallCategories = _cmsCategories.filter((entity) => {
              return entity.pid == bigCategory.id;
            });

            while (smallCategories && smallCategories.length > 0) {
              const small = smallCategories.splice(0, 1);
              let swiperItemsLength = bigCategory.swiperItems.length;

              if (
                bigCategory.swiperItems[swiperItemsLength - 1].length >=
                maxSmallCategoryNumber
              ) {
                bigCategory.swiperItems.push([]);
                swiperItemsLength++;
              }

              bigCategory.swiperItems[swiperItemsLength - 1].push(small[0]);
            }
          });

        let result = _cmsCategories.filter((entity) => {
          return entity.key == "photos";
        });

        console.log(result, cmsRecommendCategories);
        this.setData({
          cmsCategories: result,
          cmsRecommendCategories: cmsRecommendCategories,
          loadingHidden: true,
          refreshertriggered: false,
        });
      }

      uni.setNavigationBarTitle({
        title: uni.getStorageSync("mallName"),
      });
      // });
    },

    goArticleList(e) {
      uni.navigateTo({
        url:
          "/api-photography/classify/classify?pid=" +
          e.currentTarget.dataset.id,
      });
    },

    pulldown() {
      this.getPhotos();
    },

    lower() {
      this.getPhotos();
    },

    toAddDynamic() {
      if (isAnonymous()) {
        uni.navigateTo({
          url: "/apps-auth/login/login",
        });
      } else {
        uni.navigateTo({
          url: "/apps-circle/add-dynamic/add-dynamic?isList=" + true,
        });
      }
    },

    toAccountHome(e) {
      uni.navigateTo({
        url: "/apps-circle/account-home/account-home?id=" + e.currentTarget.id,
      });
    },

    moreCircle() {
      this.categoryValue = "";
      uni.navigateTo({
        url: "/apps-circle/circle-list/circle-list",
      });
    },
  },
};
</script>
<style>
.top-title .main-title {
  padding: 25rpx 40rpx;
  font-size: 70rpx;
  font-weight: bold;
  display: block;
}
.swipers {
  height: 360rpx;
  margin-bottom: 30rpx;
}
.swiper-items {
  padding: 0 10rpx;
}
.swiper-items image {
  width: 100%;
  height: 360rpx;
  border-radius: 20rpx;
}
.swiper-item {
  position: relative;
  border-radius: 20rpx;
  overflow: hidden;
  height: 360rpx;
}
.swiper-item .article-info {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 20rpx 40rpx;
  background: -webkit-gradient(
    linear,
    0 0,
    0 bottom,
    from(rgba(0, 0, 0, 0)),
    to(rgba(0, 0, 0, 0.5))
  );
}
swiper-item .title {
  font-size: 36rpx;
  display: block;
  color: #fff;
  max-width: 460rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
swiper-item .discription {
  font-size: 28rpx;
  color: #fff;
  display: block;
  max-width: 460rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  opacity: 0.8;
}
.main-view {
  position: absolute;
  bottom: 20rpx;
  right: 40rpx;
  color: #fff;
  font-size: 28rpx;
}
.main-view image {
  width: 36rpx;
  height: 36rpx;
  display: inline-block;
  vertical-align: middle;
}
/* 分类模块 */
.classify {
  margin: 10rpx 0;
  padding-top: 20rpx;
}
.classify .classify-title {
  border-top: 1px solid #efefef;
  font-size: 40rpx;
  display: block;
  font-weight: bold;
  margin: 0 40rpx;
  padding: 20rpx 0;
}
.classify .classify-title .view-all {
  float: right;
  color: #5756c0;
  font-size: 28rpx;
  margin-top: 14rpx;
  font-weight: normal;
}
.article-warp {
  height: 500rpx;
}
.article-item {
  overflow: hidden;
  float: left;
  margin-bottom: 20rpx;
}
.article-item .article-clover {
  float: left;
  width: 120rpx;
  height: 120rpx;
  border-radius: 20rpx;
}
.article-item .article-info {
  float: left;
  padding-left: 20rpx;
  width: 500rpx;
  border-bottom: 1px solid #efefef;
  padding-bottom: 10rpx;
}
.article-item .article-title {
  font-size: 32rpx;
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.article-item .article-description {
  font-size: 28rpx;
  color: #666;
  display: block;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.article-view {
  color: #999;
  font-size: 24rpx;
  margin-top: 10rpx;
}
.article-view image {
  display: inline-block;
  width: 34rpx;
  height: 34rpx;
  vertical-align: middle;
}
.article-warp swiper-item .article-item:last-child .article-info {
  border: none;
}
page,
body {
  overflow: visible;
}
.main-title {
  font-size: 70rpx;
  font-weight: bold;
}
.small-title {
  font-size: 40rpx;
  font-weight: bold;
}
</style>
