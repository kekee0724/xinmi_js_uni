<template>
    <view>
        <view class="suspension-box" :style="susStyle">
            <view :class="'menu-list ' + (type ? 'show' : 'false')">
                <block v-if="isHome == true">
                    <view class="item" @click="scanClick">
                        <view class="icon icon-saoyisao"></view>
                        <view>扫一扫</view>
                    </view>
                    <navigator @click="messageClick" class="item">
                        <view :class="notificationCount > 0 ? 'icon icon icon-lingdang hint' : 'icon icon icon-lingdang'"></view>
                        <view>消息</view>
                    </navigator>
                </block>
                <!-- <view bindtap="toggleType" class="item" wx:if="{{isHome !== true}}">
      <view class="icon icon-home"></view>
      <view>首页</view>
    </view> -->
                <navigator @click="searchClick" class="item">
                    <view class="icon icon-sousuo"></view>
                    <view>搜索</view>
                </navigator>
                <!-- <view bindtap="toggleType" class="item">
      <view class="primary-color size-16">Ipark+</view>
      <view>去APP</view>
    </view> -->
            </view>
            <view class="suspension-btn" @click="drawer" :data-state="type">快捷导航</view>
        </view>

        <!-- 确认是否提交弹框 -->
        <view class="fadeIn" v-if="confirmModel">
            <view class="weui-mask"></view>
            <view class="weui-dialog">
                <view class="weui-dialog__hd"><strong class="weui-dialog__title">操作提示</strong></view>
                <view class="weui-dialog__bd text-center">
                    <view>确认授权登录吗?</view>
                </view>
                <view class="weui-dialog__ft">
                    <a class="weui-dialog__btn weui-dialog__btn_default" @click.native="confirmModelClose">取消</a>
                    <a class="weui-dialog__btn weui-dialog__btn_primary" @click.native="confirmModelSure">确认</a>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
'use strict';

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

const index_1 = require('../../core/index');

export default {
    data() {
        return {
            type: false,
            currentMember: '',
            notificationCount: {},
            confirmModel: false,
            loginCode: ''
        };
    },
    options: {
        addGlobalClass: true,
        multipleSlots: true
    },
    props: {
        susStyle: String,
        isHome: Boolean
    },
    onPageShow: function () {
        this.getInitData();
    },
    methods: {
        getInitData() {
            return __awaiter(this, void 0, void 0, function* () {
                let currentMember = yield index_1.memberService.getMember();
                let user = yield index_1.authService.getCurrentUser();
                let currentUser = user.currentUser || {};
                let result;

                if (currentUser.id) {
                    result = yield index_1.notificationService.getPaged({
                        isRead: 'false',
                        ownerID: currentUser.id,
                        notificationType: index_1.NotificationTypesEnum.unRead,
                        mailbox: index_1.MailBoxTypeEnum.mailBox,
                        parkId: index_1.getLocalStorage('parkId'),
                        sceneId: index_1.getStorageObject('allscenesIDS')
                    });
                    this.setData({
                        currentMember: currentMember,
                        notificationCount: result.totalItems
                    });
                }
            });
        },

        drawer: function (e) {
            this.setData({
                type: !e.currentTarget.dataset.state
            });
        },

        close() {
            this.setData({
                type: false
            });
        },

        searchClick() {
            this.setData({
                type: false
            });

            if (!index_1.isAuth()) {
                uni.navigateTo({
                    url: '/apps-auth/login/login'
                });
                return;
            }

            uni.navigateTo({
                url: '/apps-search/search/search'
            });
        },

        messageClick() {
            this.setData({
                type: false
            });

            if (!index_1.isAuth()) {
                uni.navigateTo({
                    url: '/apps-auth/login/login'
                });
                return;
            }

            uni.navigateTo({
                url: '/apps-message/message/message'
            });
        },

        scanClick() {
            this.setData({
                type: false
            });

            if (!index_1.isAuth()) {
                uni.navigateTo({
                    url: '/apps-auth/login/login'
                });
                return;
            }

            let _this = this;

            uni.scanCode({
                onlyFromCamera: true,
                scanType: ['qrCode'],

                success(res) {
                    console.log(res);
                    let result = res.result;

                    if (result.indexOf('articleDetail') !== -1) {
                        let id = result.split('articleDetail/')[1].split('?')[0];
                        uni.navigateTo({
                            url: `/apps-article/article-detail/article-detail?articleid=${id}&ispreview=true`
                        });
                    } else {
                        if (result.indexOf('activityDetail') !== -1) {
                            let id = result.split('activityDetail/')[1];
                            uni.navigateTo({
                                url: `/apps-activity/activity-detail/activity-detail?activityId=${id}`
                            });
                        } else {
                            if (result.indexOf('roomdetail') !== -1) {
                                if (!_this.isCertifyMeeting(_this.currentMember, index_1.getLocalStorage('parkName'))) {
                                    return;
                                }

                                let arr = result.split('/');
                                let id = arr[arr.length - 1];
                                uni.navigateTo({
                                    url: `/apps-order/meeting/meeting-detail?detailid=${id}&resourceType=32`
                                });
                            } else {
                                if (result.indexOf('weblogincode') !== -1) {
                                    let loginCode = result.split('weblogincode=')[1];

                                    _this.setData({
                                        confirmModel: true,
                                        loginCode
                                    });
                                } else {
                                    uni.showToast({
                                        title: `无法识别的二维码`,
                                        icon: 'none',
                                        duration: 2000
                                    });
                                }
                            }
                        }
                    }
                }
            });
        },

        confirmModelClose() {
            this.setData({
                confirmModel: false
            });
        },

        confirmModelSure() {
            return __awaiter(this, void 0, void 0, function* () {
                this.confirmModelClose();
                uni.request({
                    url: `${uni.server.url}authorization/qrcode/send-token`,
                    data: {
                        code: this.loginCode,
                        token: index_1.getLocalToken()
                    },
                    header: {
                        'content-type': 'application/json',
                        Authorization: index_1.getLocalToken()
                    },
                    method: 'POST',

                    success(res) {
                        console.log(res.data);
                    }
                });
            });
        },

        isCertifyMeeting(currentMember, parkName) {
            if ((currentMember && currentMember.status === index_1.CertifyStatusEnum.nocertify) || !currentMember || !currentMember.id) {
                uni.showToast({
                    title: `${parkName}园区未认证，请审核通过后使用`,
                    icon: 'none',
                    duration: 2000
                });
                return false;
            } else {
                if (currentMember && currentMember.status === index_1.CertifyStatusEnum.noConfim) {
                    uni.showToast({
                        title: `您在${parkName}园区的认证申请正在审核，请审核通过后使用`,
                        icon: 'none',
                        duration: 2000
                    });
                    return false;
                } else {
                    if (currentMember && currentMember.status === index_1.CertifyStatusEnum.allow) {
                        return true;
                    } else {
                        uni.showToast({
                            title: `您在${parkName}园区的认证申请已退回，请审核通过后使用`,
                            icon: 'none',
                            duration: 2000
                        });
                        return false;
                    }
                }
            }
        }
    }
};
</script>
<style>
@import './suspension.css';
</style>
