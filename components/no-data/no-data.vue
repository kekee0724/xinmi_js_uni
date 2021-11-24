<template>
    <view class="contain" :style="'height:' + height + ';'">
        <view class="result-message">
            <image :src="src"></image>
            <view class="text">{{ text || '暂无数据' }}</view>
        </view>
    </view>
</template>

<script>
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

const index_1 = require('../../core/index');

export default {
    data() {
        return {
            src: {}
        };
    },
    options: {
        addGlobalClass: true
    },
    props: {
        height: {
            type: String,
            default: '100%'
        },
        text: {
            type: String,
            default: '暂无数据'
        }
    },
    mounted: function () {
        this.setData({
            src: index_1.connectlocalUrl('no-dl.png')
        });
    },
    methods: {}
};
</script>
<style>
@import './no-data.css';
</style>
