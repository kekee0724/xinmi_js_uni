<template>
    <!-- 这是自定义组件的内部WXML结构 -->
    <view class="navbar custom-class" :style="'height:' + navH + 'px;padding-top:' + ptTop + 'px;' + navStyle">
        <view v-if="showNav" class="navbar-action-wrap navbar-action-group row item-center" :style="'top:' + ptTop + 'px;background-color:rgba(255,255,255,.6)'">
            <view class="weui-flex">
                <view class="weui-flex__item" v-if="showNav" @click="navBack"><text class="icon icon-prev"></text></view>
                <view class="weui-flex__item" @click.stop.prevent="searchChange" v-if="showSearch"><text class="icon icon-sousuo"></text></view>
            </view>
        </view>
        <view class="navbar-title" :style="'top:' + navTop + 'px'">
            {{ spageName }}
        </view>
        <slot></slot>
    </view>
</template>

<script>
'use strict';

const app = getApp();
export default {
    data() {
        return {
            spageName: {},
            navH: {},
            bgColor: '',
            ptTop: {},
            navTop: ''
        };
    },
    options: {
        addGlobalClass: true,
        multipleSlots: true
    },
    props: {
        pageName: String,
        navStyle: String,
        showNav: {
            type: Boolean,
            default: true
        },
        showHome: {
            type: Boolean,
            default: true
        },
        showSearch: {
            type: Boolean,
            default: true
        },
        navBackIntercept: {
            type: Boolean,
            default: false
        }
    },
    watch: {
        pageName: {
            handler: function (pageName) {
                this.setData({
                    spageName: pageName
                });
            },

            immediate: true,
            deep: true
        }
    },
    beforeMount: function () {
        this.setData({
            navH: app.globalData.navHeight,
            bgColor: app.globalData.navColor,
            ptTop: app.globalData.navTop
        });
    },
    methods: {
        navBack: function () {
            if (this.navBackIntercept) {
                this.$emit('navBackIntercept');
            } else {
                uni.navigateBack({
                    delta: 1,
                    fail: () => {
                        console.log('22222');
                        this.toIndex();
                    }
                });
            }
        },
        toIndex: function () {
            uni.switchTab({
                url: '/pages/index/index/index'
            });
        },
        searchChange: function () {
            this.$emit('searchChange');
        }
    }
};
</script>
<style>
@import './nav-bar.css';
</style>
