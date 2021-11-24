<template>
    <view class="phone-warp">
        <view class="page-body">
            <view class="page-section page-section-spacing swiper">
                <swiper :indicator-dots="indicatorDots" :autoplay="true" interval="1000" duration="500">
                    <block>
                        <swiper-item>
                            <image src="@/static/pages/images/banner_2.jpg" />
                        </swiper-item>
                    </block>
                </swiper>
            </view>

            <view class="notice-box">
                <image src="@/static/pages/images/gg.png" />
                <view class="notice-box-item">云台一小区荣获“垃圾分类”第一名！</view>
            </view>

            <view class="weui-panel weui-panel_access">
                <view class="weui-panel__hd">小区概况</view>
                <view class="weui-panel__bd">
                    <views class="panel-box">
                        <image src="@/static/pages/images/news.png"></image>
                        <views class="weui-panel-desc">云台一居民区由昌里东路80弄、成山路475弄、云台路255弄、265弄组成。80弄建筑面积41880.92平方米，475弄47000平方米。</views>
                        <views class="panel-text">
                            <views class="panel-text-box">
                                <views class="panel-text-item">
                                    规划户数:
                                    <text class="text-span">1602</text>
                                </views>
                                <views class="panel-text-item">
                                    实际居住户数:
                                    <text>1587</text>
                                </views>
                                <views v-if="cut">
                                    <views class="panel-text-item">
                                        实际居住人口:
                                        <text class="text-span">4083</text>
                                    </views>
                                    <views class="panel-text-item">
                                        社区党员:
                                        <text class="text-span">147</text>
                                    </views>
                                    <views class="panel-text-item">
                                        居民代表:
                                        <text class="text-span">125</text>
                                    </views>
                                </views>
                            </views>
                            <text :class="cut ? 'icon icon-xia on' : 'icon icon-xia'" @click="cutClick"></text>
                        </views>
                    </views>
                </view>
            </view>

            <view class="weui-panel weui-panel_access" style="margin-bottom: 60rpx">
                <view class="weui-panel__hd">
                    <view class="flex-box">
                        <view>周边配套</view>
                        <navigator url="../medical/medical">···</navigator>
                    </view>
                </view>
                <view class="weui-panel__bd">
                    <map id="myMap" :latitude="latitude" :longitude="longitude" :markers="markers" :scale="scale" show-location></map>
                    <view class="map-item-box">
                        <block v-for="(item, index) in item" :key="item.index">
                            <text :class="item_index === index ? 'map-item on' : 'map-item'" :data-index="index" @click="item_Click">{{ item }}</text>
                        </block>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
// pages/visitor/visitor.js
//获取应用实例
const app = getApp();
export default {
    data() {
        return {
            grids: [
                {
                    icon: '/static/pages/images/dtjz.png',
                    name: '电梯加装'
                },
                {
                    icon: '/static/pages/images/zcfw.png',
                    name: '助餐服务'
                },
                {
                    icon: '/static/pages/images/bmfw.png',
                    name: '便民服务'
                },
                {
                    icon: '/static/pages/images/ykgw.png',
                    name: '养老顾问'
                },
                {
                    icon: '/static/pages/images/wxrt.png',
                    name: '微型日托'
                },
                {
                    icon: '/static/pages/images/wkj.png',
                    name: '微空间'
                },
                {
                    icon: '/static/pages/images/xyfw.png',
                    name: '洗衣服务'
                },
                {
                    icon: '/static/pages/images/gd.png',
                    name: '更多'
                }
            ],

            cut: false,
            cut_server: false,

            markers: [
                {
                    iconPath: '/static/pages/images/maker.png',
                    width: 24,
                    height: 34,
                    id: 0,
                    latitude: 31.176037,
                    longitude: 121.505463,
                    name: '公交站'
                }
            ],

            latitude: 31.17461,
            longitude: 121.506842,
            item: ['交通', '教育', '医疗', '生活', '娱乐'],
            item_index: 0,
            scale: 15,
            indicatorDots: []
        };
    },
    onLoad: function () {},
    onReady: function (e) {
        this.mapCtx = uni.createMapContext('myMap');
        this.maker_item(this.item_index);
    },
    methods: {
        cutClick: function () {
            this.setData({
                cut: !this.cut
            });
        },

        server_cutClick: function () {
            this.setData({
                cut_server: !this.cut_server
            });
        },

        item_Click: function (event) {
            this.maker_item(event.target.dataset.index);
        },

        maker_item(index) {
            const one = [
                {
                    iconPath: '/static/pages/images/maker.png',
                    width: 24,
                    height: 34,
                    id: 0,
                    latitude: 31.176271,
                    longitude: 121.506966,
                    name: '云莲路昌里东路'
                },
                {
                    iconPath: '/static/pages/images/maker.png',
                    width: 24,
                    height: 34,
                    id: 1,
                    latitude: 31.176037,
                    longitude: 121.505463,
                    name: '昌里东路云台路'
                },
                {
                    iconPath: '/static/pages/images/maker.png',
                    width: 24,
                    height: 34,
                    id: 1,
                    latitude: 31.172239,
                    longitude: 121.505117,
                    name: '成山路云台路'
                },
                {
                    iconPath: '/static/pages/images/maker.png',
                    width: 24,
                    height: 34,
                    id: 1,
                    latitude: 31.172748,
                    longitude: 121.510671,
                    name: '东明路成山路'
                }
            ];
            const two = [
                {
                    iconPath: '/static/pages/images/maker.png',
                    width: 24,
                    height: 34,
                    id: 0,
                    latitude: 31.174775,
                    longitude: 121.505157,
                    name: '上钢新村幼儿园（海贝部）'
                },
                {
                    iconPath: '/static/pages/images/maker.png',
                    width: 24,
                    height: 34,
                    id: 1,
                    latitude: 31.17461,
                    longitude: 121.506842,
                    name: '云台小学'
                },
                {
                    iconPath: '/static/pages/images/maker.png',
                    width: 24,
                    height: 34,
                    id: 2,
                    latitude: 31.176245,
                    longitude: 121.511149,
                    name: '云台幼儿园（云台部）'
                }
            ];
            const three = [
                {
                    iconPath: '/static/pages/images/maker.png',
                    width: 24,
                    height: 34,
                    id: 0,
                    latitude: 31.17227,
                    longitude: 121.502937,
                    name: '第一医药（成山路药房）'
                },
                {
                    iconPath: '/static/pages/images/maker.png',
                    width: 24,
                    height: 34,
                    id: 0,
                    latitude: 31.18031,
                    longitude: 121.507847,
                    name: '上海姜俭口腔诊所'
                },
                {
                    iconPath: '/static/pages/images/maker.png',
                    width: 24,
                    height: 34,
                    id: 0,
                    latitude: 31.168741,
                    longitude: 121.507522,
                    name: '川新社区卫生服务站'
                }
            ];
            const four = [
                {
                    iconPath: '/static/pages/images/maker.png',
                    width: 24,
                    height: 34,
                    id: 0,
                    latitude: 31.176316,
                    longitude: 121.506203,
                    name: '链家地产（昌里花园店）'
                },
                {
                    iconPath: '/static/pages/images/maker.png',
                    width: 24,
                    height: 34,
                    id: 0,
                    latitude: 31.174995,
                    longitude: 121.50446,
                    name: '春琛房产家政（昌里店）'
                },
                {
                    iconPath: '/static/pages/images/maker.png',
                    width: 24,
                    height: 34,
                    id: 0,
                    latitude: 31.172546,
                    longitude: 121.507839,
                    name: '吉妮房产'
                },
                {
                    iconPath: '/static/pages/images/maker.png',
                    width: 24,
                    height: 34,
                    id: 0,
                    latitude: 31.172556,
                    longitude: 121.507206,
                    name: '中正地产（成山路二店）'
                }
            ];
            const five = [
                {
                    iconPath: '/static/pages/images/maker.png',
                    width: 24,
                    height: 34,
                    id: 0,
                    latitude: 31.174329,
                    longitude: 121.50042,
                    name: '蔓趣公园'
                },
                {
                    iconPath: '/static/pages/images/maker.png',
                    width: 24,
                    height: 34,
                    id: 0,
                    latitude: 31.171717,
                    longitude: 121.50592,
                    name: '传奇跆拳道（世博源馆店）'
                },
                {
                    iconPath: '/static/pages/images/maker.png',
                    width: 24,
                    height: 34,
                    id: 0,
                    latitude: 31.169746,
                    longitude: 121.503264,
                    name: '周家渡摆渡人书场'
                }
            ];
            this.setData({
                item_index: index
            });

            switch (index) {
                case 0:
                    this.setData({
                        markers: one,
                        latitude: 31.174823,
                        longitude: 121.508541
                    });
                    break;

                case 1:
                    this.setData({
                        markers: two,
                        latitude: 31.174823,
                        longitude: 121.508541
                    });
                    break;

                case 2:
                    this.setData({
                        markers: three,
                        latitude: 31.171263,
                        longitude: 121.504713
                    });
                    break;

                case 3:
                    this.setData({
                        markers: four,
                        latitude: 31.174823,
                        longitude: 121.508541
                    });
                    break;

                case 4:
                    this.setData({
                        markers: five,
                        longitude: 121.502498,
                        latitude: 31.172535
                    });
                    break;
            }
        }
    }
};
</script>
<style>
@import './visitor.css';
</style>
