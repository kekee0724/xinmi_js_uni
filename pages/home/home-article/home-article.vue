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
            <scroll-view class="index-headline" :scroll-y="false" :scroll-x="true" @scroll="onPageScroll">
                <view class="item" :data-id="item.id" @tap="goToDetail" v-for="(item, index) in articleList" :key="index">
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
'use strict';
import imageAuto from '@/components/image-auto/image-auto';

Object.defineProperty(exports, '__esModule', {
    value: true
});

const index_1 = require('../../../core/index');

const index_2 = require('../../discover/service/index');

const app_1 = require('../../../kek');

const app = getApp();
export default {
    components: {
        imageAuto
    },
    data() {
        return {
            articleListhome: [],

            articleList: {
                length: 0
            }
        };
    },
    onPageShow: function () {},
    onPageHide: function () {},
    onPageResize: function () {},
    options: {
        addGlobalClass: true
    },
    props: {},
    mounted: function () {},
    methods: {
        goToDetail(e) {
            uni.navigateTo({
                url: '../../../apps-article/article-detail/article-detail?articleid=' + e.currentTarget.dataset.id
            });
        },

        fetchNews() {
            app_1.WXAPI.cmsArticles({
                categoryId: uni.getStorageSync('news_category_dt').id,
                pageSize: 5
            }).then((res) => {
                if (res.code === 0) {
                    this.setData({
                        articleList: res.data
                    });
                } else {
                    this.setData({
                        articleList: []
                    });
                }
            });
        },

        getArticleList() {
            index_2.articleHttpService
                .getPaged({
                    pageSize: 5,
                    orderBy: 'isTop desc,sequence asc,publishTime desc',
                    isPublish: true,
                    pageIndex: 1,
                    parkId: index_1.getLocalStorage('parkId'),
                    catalogueCode: 'DTZX'
                })
                .then((d) => {
                    let articleListhome = d.items;

                    if (articleListhome) {
                        articleListhome.map((item) => {
                            item.coverUrl = index_1.transformUrl((item && item.coverUrl) || (item && item.pictureUrlList && item.pictureUrlList[0]));
                        });
                    }

                    this.setData({
                        articleListhome
                    });
                })
                .catch((e) => {
                    uni.showToast({
                        title: `${(e === null || e === void 0 ? void 0 : e.errmsg) || e}`,
                        icon: 'none',
                        duration: 2000
                    });
                });
        },

        onPageScroll: function (_e) {},

        moreArticle() {
            app.globalData.discoverIndex = 2;
            uni.switchTab({
                url: '/pages/discover/discover/discover'
            });
        }
    }
};
</script>
<style></style>
