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
            <view class="item" :data-id="item.id" @tap="goToDetail" v-for="(item, index) in newsList" :key="index">
                <view class="activity-img-box">
                    <image-auto cutWidth="384" cutHeight="233" :src="item.pic"></image-auto>
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
                    <view v-if="item.video !== ''" class="size-13 gray-four-color omit omit-1" style="margin-left: -50rpx">
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
'use strict';
import noData from '@/components/no-data/no-data';
import imageAuto from '@/components/image-auto/image-auto';

var __awaiter =
    (this && this.__awaiter) ||
    function (thisArg, _arguments, P, generator) {
        function adopt(value) {
            return value instanceof P
                ? value
                : new P(function (resolve) {
                      resolve(value);
                  });
        }

        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) {
                try {
                    step(generator.next(value));
                } catch (e) {
                    reject(e);
                }
            }

            function rejected(value) {
                try {
                    step(generator['throw'](value));
                } catch (e) {
                    reject(e);
                }
            }

            function step(result) {
                if (result.done) {
                    resolve(result.value);
                } else {
                    adopt(result.value).then(fulfilled, rejected);
                }
            }

            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };

Object.defineProperty(exports, '__esModule', {
    value: true
});

const index_1 = require('../../../core/index');

const common_1 = require('../../discover/common/common');

const index_2 = require('../../discover/service/index');

const app_1 = require('../../../kek');

const app = getApp();
export default {
    components: {
        noData,
        imageAuto
    },
    data() {
        return {
            activity: [],
            newsList: []
        };
    },
    options: {
        addGlobalClass: true
    },
    props: {},
    mounted() {},
    methods: {
        goToDetail(e) {
            uni.navigateTo({
                url: '../../../apps-activity/activity-detail/activity-detail?activityId=' + e.currentTarget.dataset.id
            });
        },

        fetchNews() {
            app_1.WXAPI.cmsArticles({
                categoryId: uni.getStorageSync('news_category_zs').id,
                pageSize: 3
            }).then((res) => {
                console.log('fetchNews', res.data);

                if (res.code === 0) {
                    this.setData({
                        newsList: res.data
                    });
                } else {
                    this.setData({
                        newsList: []
                    });
                }
            });
        },

        getActivityStatus(status) {
            switch (status) {
                case common_1.ActivityTypeEnum.signUp:
                    return ['报名中', 'regist'];

                case common_1.ActivityTypeEnum.onGoing:
                    return ['进行中', 'in'];

                case common_1.ActivityTypeEnum.finish:
                    return ['已结束', 'end'];

                default:
                    return ['未发布', 'end'];
            }
        },

        getActivityList() {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    const data = yield index_2.activityHttpService.getPaged({
                        pageSize: 3,
                        pageIndex: 1,
                        isValid: true,
                        orderBy: 'applyNumber desc',
                        parkId: index_1.getLocalStorage('parkId')
                    });
                    const list = ([...data.items] || []).map((item) => {
                        item.startT = index_1.formatDateTime(item.startTime, 'yyyy-MM-dd hh:mm');
                        item.endT = index_1.formatDateTime(item.endTime, 'yyyy-MM-dd hh:mm');
                        item.statusType = this.getActivityStatus(item.status)[0];
                        item.statusIcon = this.getActivityStatus(item.status)[1];
                        return item;
                    });
                    this.setData({
                        activity: list
                    });
                } catch (e) {
                    uni.showToast({
                        title: `${(e === null || e === void 0 ? void 0 : e.errmsg) || e}`,
                        icon: 'none',
                        duration: 2000
                    });
                }
            });
        },

        moreActivity() {
            app.globalData.discoverIndex = 1;
            uni.switchTab({
                url: '/pages/discover/discover/discover'
            });
        }
    }
};
</script>
<style></style>
