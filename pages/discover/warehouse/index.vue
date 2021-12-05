<template>
    <!-- <cu-custom bgColor="se" >
  <view slot="content">仓库</view>
</cu-custom> -->

    <view class="page">
        <view class="page__bd">
            <view class="searchbox">
                <view class="tree-flex">
                    <view class="tree-flex__item" @tap="typeChanged">{{ type_name }}</view>
                    <view class="tree-flex__item" @tap="sortChanged">{{ sort_name }}</view>
                    <view class="tree-flex__item" @tap="orderChanged">{{ order_name }}</view>
                </view>
            </view>

            <view style="background-color: #fff; padding: 20px" v-if="loding">
                <van-skeleton title row="3" v-for="(item, index) in 5" :key="index"></van-skeleton>
            </view>

            <block v-if="list.length > 0">
                <navigator
                    hover-class="navigator-hover"
                    :url="'/api-tree/pages/warehouse/detail/index?namespace=' + item.namespace.path + '&path=' + item.path"
                    v-for="(item, index) in list"
                    :key="item"
                >
                    <view class="tree-panel">
                        <view>
                            <view class="tree-media-box tree-media-box_text repo">
                                <view class="open">
                                    <text class="icon icon-kaiban cuIcon-lock lg text-gray" v-if="item.public"></text>
                                </view>
                                <view class="tree-media-box__title">
                                    {{ item.name }}
                                </view>

                                <view class="project_badges">
                                    <span class="badge" v-if="item.language">{{ item.language ? item.language : 'JavaScript' }}</span>
                                    <span class="badge" v-if="item.public">{{ item.license ? item.license : 'MulanPSL-2.0' }}</span>
                                </view>
                                <view class="tree-media-box__desc">{{ item.description ? item.description : '暂无描述' }}</view>
                                <view class="dis_Fl">
                                    <view class="cu-capsule">
                                        <view class="cu-tag bg-gradual-tree">
                                            {{ item.namespace.name }}
                                        </view>
                                        <view class="cu-tag line-tree">
                                            {{ timeHelper.parse(item.pushed_at) }}
                                        </view>
                                    </view>

                                    <view class="project_counts">
                                        <i class="icon icon-liulan cuIcon-attention lg">{{ item.watchers_count }}</i>
                                        <i class="icon icon-star cuIcon-favor lg">{{ item.stargazers_count }}</i>
                                        <i class="icon icon-share cuIcon-share lg">{{ item.forks_count }}</i>
                                    </view>
                                </view>
                            </view>
                        </view>
                    </view>
                </navigator>
            </block>
            <view v-if="list.length == 0" class="tips">
                <van-empty description="暂无仓库信息" />
            </view>
        </view>
    </view>
</template>
<script module="timeHelper" lang="wxs">
var parse = function (time) {
  var date = '';
  var d = getDate(time);
  var _month = d.getMonth() + 1;
  date += (_month < 10 ? ("0" + _month) : _month) + "-";
  date += (d.getDate() < 10 ? ("0" + d.getDate()) : d.getDate()) + " ";
  date += (d.getHours() < 10 ? ("0" + d.getHours()) : d.getHours()) + ":";
  date += (d.getMinutes() < 10 ? ("0" + d.getMinutes()) : d.getMinutes());
  return date;
}
var replace = function (str, find = '', replace = '') {
  return str.replace(find, replace);
};
var html2Text = function (str) {
  str = str.replace(getRegExp('<\/?[^>]*>','g'), ''); //去除HTML tag
  str = str.replace(getRegExp('[ | ]*\n','g'), '\n'); //去除行尾空白
  str = str.replace(getRegExp('&nbsp;','ig'), ''); //去掉&nbsp;
  str = str.replace(getRegExp('\s','g'), ''); //将空格去掉
  return str;
};
module.exports.parse = parse;
module.exports.html2Text = html2Text;
module.exports.replace = replace;
</script>
<script>
const app = getApp();
export default {
    data() {
        return {
            type_value: 'all',
            type_name: '我全部的',
            loding: true,

            typeList: [
                {
                    type_name: '我全部的',
                    type_value: 'all'
                },
                {
                    type_name: '我创建的',
                    type_value: 'owner'
                },
                {
                    type_name: '我个人的',
                    type_value: 'personal'
                },
                {
                    type_name: '我加入的',
                    type_value: 'member'
                },
                {
                    type_name: '我公开的',
                    type_value: 'public'
                },
                {
                    type_name: '我私有的',
                    type_value: 'private'
                }
            ],

            order_value: 'desc',
            order_name: '倒序排列',

            orderList: [
                {
                    order_value: 'desc',
                    order_name: '倒序排列'
                },
                {
                    order_value: 'asc',
                    order_name: '升序排列'
                }
            ],

            sort_value: 'pushed',
            sort_name: '推送时间',

            sortList: [
                {
                    sort_value: 'created',
                    sort_name: '创建时间'
                },
                {
                    sort_value: 'updated',
                    sort_name: '更新时间'
                },
                {
                    sort_value: 'pushed',
                    sort_name: '推送时间'
                },
                {
                    sort_value: 'full_name',
                    sort_name: '仓库名称'
                }
            ],

            page: 1,
            isGetingData: false,
            list: [],

            timeHelper: {
                parse: ''
            }
        };
    },
    mounted() {
        uni.showLoading({
            title: '数据加载中'
        });
        app.globalData.loadFont();
    },
    onPageShow() {
        let that = this;
        app.globalData.getUserInfo(function (result) {
            if (result) {
                that.getList();
            } else {
                app.globalData.loginFirst();
            }
        });
    },
    created() {
        let that = this;
        app.globalData.getUserInfo(function (result) {
            console.log(result);

            if (result) {
                that.getList();
            } else {
                 app.globalData.loginFirst();
            }
        });
    },
    methods: {
        getList: function () {
            let that = this;

            if (that.isGetingData) {
                uni.hideLoading();
                uni.stopPullDownRefresh();
                return;
            }

            that.isGetingData = true;
            uni.request({
                url: app.globalData.config.apiUrl + 'api/v5/user/repos',
                method: 'GET',
                data: {
                    access_token: app.globalData.access_token,
                    type: that.type_value,
                    sort: that.sort_value,
                    direction: that.order_value,
                    page: that.page
                },
                success: function (result) {
                    uni.hideLoading();
                    uni.stopPullDownRefresh();

                    if (result.data.hasOwnProperty('message')) {
                        uni.showModal({
                            title: '获取失败',
                            content: '你可以尝试重新登录或稍后再试',
                            showCancel: false,

                            success(_res) {
                                uni.navigateBack();
                            }
                        });
                    } else {
                        if (that.page == 1) {
                            that.setData({
                                list: result.data,
                                loding: false
                            });
                        } else {
                            let _list = that.list;

                            for (let i = 0; i < result.data.length; i++) {
                                _list.push(result.data[i]);
                            }

                            that.setData({
                                list: _list,
                                loding: false
                            });
                        }
                    }

                    that.isGetingData = false;
                }
            });
        },
        typeChanged: function (_e) {
            let that = this;
            let menuList = [];

            for (let i in that.typeList) {
                menuList.push(that.typeList[i].type_name);
            }

            uni.showActionSheet({
                itemList: menuList,
                success: function (ret) {
                    that.setData({
                        type_name: that.typeList[ret.tapIndex].type_name,
                        type_value: that.typeList[ret.tapIndex].type_value,
                        page: 1
                    });
                    that.getList();
                }
            });
        },
        sortChanged: function (_e) {
            let that = this;
            let menuList = [];

            for (let i in that.sortList) {
                menuList.push(that.sortList[i].sort_name);
            }

            uni.showActionSheet({
                itemList: menuList,
                success: function (ret) {
                    that.setData({
                        sort_name: that.sortList[ret.tapIndex].sort_name,
                        sort_value: that.sortList[ret.tapIndex].sort_value,
                        page: 1
                    });
                    that.getList();
                }
            });
        },
        orderChanged: function (_e) {
            let that = this;
            let menuList = [];

            for (let i in that.orderList) {
                menuList.push(that.orderList[i].order_name);
            }

            uni.showActionSheet({
                itemList: menuList,
                success: function (ret) {
                    that.setData({
                        order_name: that.orderList[ret.tapIndex].order_name,
                        order_value: that.orderList[ret.tapIndex].order_value,
                        page: 1
                    });
                    that.getList();
                }
            });
        }
    }
};
</script>
<style>
/* 

@import "../../style/main.css";
@import "../../style/icon2.css";
 */

main {
    background: #f8f8f8;

    height: 99.5%;
    width: 100%;
    animation: fadeIn 0.8s;
    min-height: 99.5vh;
}

.user {
    animation: fadeIn 0.6s;
}

view {
    box-sizing: border-box;
}

.van-skeleton {
    padding: 20rpx 0px !important;
}

image {
    width: 100%;
    height: 100%;
    max-width: 100%;
}

view {
    font-size: 0.85rem;
}

.ico .van-icon {
    margin-right: 4px;
}

.ico {
    width: 45%;
    font-size: 13px;
    display: flex;
    font-family: PingFang;
    font-weight: 400;
    margin-top: 5px;
    margin-left: 2px;
    color: rgba(153, 153, 153, 1);
    line-height: 18px;
}

.tree-cell {
    line-height: 1;
    padding: 5px 15px;
}

.tree-media-box__title {
    font-weight: 400;
    font-size: 17px;
    color: rgba(0, 0, 0, 0.9);
    width: auto;
    white-space: nowrap;
    word-wrap: normal;
    word-wrap: break-word;
    word-break: break-all;
}

.time {
    padding: 10px 0px;
}

.tree-media-box__desc {
    color: rgba(0, 0, 0, 0.5);
    font-size: 14px;
    padding-top: 4px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
}

.tree-media-box__desc,
.tree-media-box__title {
    line-height: 1.4;
    overflow: hidden;
    text-overflow: ellipsis;
}

.tree-panel {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
    border-radius: 4px;
    padding: 30rpx;
}

.badge {
    padding: 1px 3px;
    border: 1px solid #d69c63;
    color: #d69c63;
    border-radius: 3px;
    font-size: 12px;
    margin-right: 3px;
}

.repo .open {
    position: absolute;
    color: #d69c63;
    right: 15px;
    top: 10px;
}

.tree-media-box__desc {
    margin-bottom: 8px;
    margin-top: 5px;
}

.dis_Fl {
    display: flex;
    justify-content: space-between;
}

.tree-flex {
    line-height: 1;
    padding: 20px 0px;
    text-align: center;
    margin: 0 !important;
    border-radius: 0;
    background-color: transparent;
    border-top: 1px solid #f5f5f5;
}

.icon-search {
    font-size: 30px;
    margin-right: 5px;
}

.project_badges {
    margin-top: 5px;
}

.project_counts i {
    vertical-align: middle;
    padding: 0px 10rpx;
    font-size: 14px;
    color: #122640;
}

.cuIcon-lock {
    font-size: 20px;
    color: #122640;
}

.project_counts .iconfont::before {
    font-size: 16px;
    vertical-align: middle;
}

.tree-flex__item {
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    flex: 1;
}

.tree-flex {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    border-radius: 10px;
}

.tree-media-box__desc,
.tree-media-box__title {
    line-height: 1.4;
    overflow: hidden;
    text-overflow: ellipsis;
}

.tree-panel {
    margin-top: 10px;
    position: relative;
    overflow: hidden;
    margin: 10px;
    background-color: #fff;
    background-size: cover;
    background-position: center;
    border-radius: 10px;
}

.page {
    padding-bottom: 50px;
    height: auto !important;
    width: 100%;
}

.tree-panel {
    animation: fadeIn 0.9s;
}

.searchbox {
    margin: 10px;
    border-radius: 10px;
    background-color: white;
}
</style>
