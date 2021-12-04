<!--
 * @Author: 可可同学
 * @Date: 2021-12-03 20:28:42
 * @LastEditTime: 2021-12-04 23:05:36
 * @LastEditors: 可可同学
 * @Description: 
-->
<template>
    
</template>
<script>
export default {
    data() {
        return {};
    },
    options: {
        addGlobalClass: true
    },
    props: {
        hideLoading: {
            type: Boolean,
            default: false
        }
    },
    watch: {
        hideLoading: {
            handler: function (val) {
                if (!val) {
                    uni.showLoading({
                        title: '加载中'
                    });
                } else {
                    uni.hideLoading();
                }
            },

            immediate: true,
            deep: true
        }
    }
};
</script>
<style>
@import './loading.css';
</style>
