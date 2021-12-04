<template>
    <view class="garid">
        <!-- bindtap="garidItemClick" -->
        <navigator class="garid-item" @tap="garidItemClick" :data-item="item" :url="item.routeKey" v-for="(item, index) in garid" :key="index">
            <view class="icon-bg">
                <text :class="item.iconUrl"></text>
            </view>

            <view class="garid-label">{{ item.moduleName }}</view>
        </navigator>
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

const index_1 = require('../../../core/index');

const utils_1 = require('../../service/common/utils');

let db;
if (!wx.cloud) {
  console.error("请使用 2.2.3 或以上的基础库以使用云能力");
} else {
  db = wx.cloud.database();
}
export default {
    data() {
        return {
            garid: [],
            member: ''
        };
    },
    options: {
        addGlobalClass: true
    },
    props: {},
    onPageShow() {
        this.getMemberInfo();
    },
    mounted() {},
    methods: {
        getMemberInfo() {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    const member = yield index_1.memberService.getMember();
                    this.setData({
                        member
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

        getUserProfile() {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    let result = [];
                    yield db
                        .collection('parkHomeModule')
                        .doc(index_1.getLocalStorage('parkId'))
                        .get()
                        .then((res) => {
                            result = res.data.homeList;
                        });
                    result.push({
                        iconUrl: 'icon icon-qita color-0',
                        moduleName: `更多`,
                        routeKey: `/service`,
                        openType: 0
                    });
                    this.setData({
                        garid: result
                    });
                    index_1.setStorageObject('homecacheService', result);
                } catch (e) {
                    uni.showToast({
                        title: `${(e === null || e === void 0 ? void 0 : e.errmsg) || e}`,
                        icon: 'none',
                        duration: 2000
                    });
                }
            });
        },

        garidItemClick(e) {
            const item = e.currentTarget.dataset.item;
            const url = item.routeKey;
            if (index_1.isAnonymous() && url !== '/service' && url.indexOf('market') === -1 && url.indexOf('serviceProduct') === -1) {
                uni.navigateTo({
                    url: '/apps-auth/login/login'
                });
                return;
            }

            if (url === '/service') {
                uni.switchTab({
                    url: '/pages/service/service-home/service-home'
                });
            }

            if (utils_1.isCertify(this.member, item.moduleName)) {
                if (item.openType === index_1.OpenTypeEnum.h5App) {
                    if (url.indexOf('survey') !== -1) {
                        uni.navigateTo({
                            url: '/api-mall/help/index'
                        });
                    }

                    if (url.indexOf('market') !== -1) {
                        const tabIndex = url.split('/')[1];
                        uni.navigateTo({
                            url: '/apps-market/market/market?tabIndex=' + tabIndex
                        });
                    }

                    if (url.indexOf('serviceProduct') !== -1) {
                        const tabIndex = url.split('/')[1];
                        uni.navigateTo({
                            url: '/apps-market/product/product?tabIndex=' + tabIndex
                        });
                    }

                    if (url.indexOf('policyList') !== -1) {
                        uni.navigateTo({
                            url: `/apps-policy/policy/policy`
                        });
                    }

                    if (url.indexOf('create/') !== -1) {
                        let code = url.split('create/')[1];
                        uni.navigateTo({
                            url: `/apps-workorder/create/create?code=${code}`
                        });
                    }

                    if (url.indexOf('resource/position/2048') !== -1) {
                        uni.navigateTo({
                            url: '/apps-order/position/position?resourceType=2048'
                        });
                    }

                    if (url.indexOf('resource/position/64') !== -1) {
                        uni.navigateTo({
                            url: '/apps-order/position/position?resourceType=64'
                        });
                    }

                    if (url.indexOf('resource/room/1024') !== -1) {
                        uni.navigateTo({
                            url: '/apps-order/meeting/meeting?resourceType=1024'
                        });
                    }

                    if (url.indexOf('resource/room/32') !== -1) {
                        uni.navigateTo({
                            url: '/apps-order/meeting/meeting?resourceType=32'
                        });
                    }

                    if (url.indexOf('consult') !== -1) {
                        uni.navigateTo({
                            url: '/apps-space/consulting/consulting'
                        });
                    }

                    if (url.indexOf('workorder/visitor') !== -1) {
                        uni.navigateTo({
                            url: `/apps-workorder/visitor/visitor?code=FKYY_sfz`
                        });
                    }
                }
            }
        }
    }
};
</script>
<style>
.garid .garid-item {
    padding: 25rpx 0;
    width: 25%;
    display: inline-block;
    text-align: center;
}
.garid .garid-item .icon-bg {
    position: relative;
    width: 84rpx;
    height: 84rpx;
    border-radius: 50%;
    margin: 0 auto;
    text-align: center;
    line-height: 84rpx;
    color: #ffffff;
}
.garid .garid-item .icon-bg text {
    font-size: 32rpx;
}
.garid .garid-item .garid-label {
    position: relative;
    display: block;
    font-size: 26rpx;
    padding-top: 15rpx;
    color: #666;
}
.garid .garid-item:nth-of-type(1) .icon-bg {
    background-image: -webkit-linear-gradient(120deg, #2f60d2 0%, #4c9bf9 100%);
}
.garid .garid-item:nth-of-type(2) .icon-bg {
    background-image: -webkit-linear-gradient(120deg, #00a591 0%, #00d4be 100%);
}
.garid .garid-item:nth-of-type(3) .icon-bg {
    background-image: -webkit-linear-gradient(120deg, #e68a28 0%, #ffc47f 100%);
}
.garid .garid-item:nth-of-type(4) .icon-bg {
    background-image: -webkit-linear-gradient(120deg, #e0453d 0%, #ff8781 100%);
}
.garid .garid-item:nth-of-type(5) .icon-bg {
    background-image: -webkit-linear-gradient(120deg, #00acc4 0%, #12d5ee 100%);
}
.garid .garid-item:nth-of-type(6) .icon-bg {
    background-image: -webkit-linear-gradient(120deg, #0da2e6 0%, #5dd1ff 100%);
}
.garid .garid-item:nth-of-type(7) .icon-bg {
    background-image: -webkit-linear-gradient(120deg, #5b67f0 0%, #8996fe 100%);
}
.garid .garid-item:nth-of-type(8) .icon-bg {
    background-image: -webkit-linear-gradient(120deg, #bfbfbf 0%, #bfbfbf 100%);
}
</style>
