<!--
 * @Author: 可可同学
 * @Date: 2021-12-03 20:28:42
 * @LastEditTime: 2021-12-05 22:31:15
 * @LastEditors: 可可同学
 * @Description: 
-->
<template>
  <view class="contain" :style="'height:' + height + ';'">
    <view class="result-message">
      <image :src="src"></image>
      <view class="text">{{ text || "暂无数据" }}</view>
    </view>
  </view>
</template>

<script>
import { connectlocalUrl } from "../../core/funcs/transform.url";

export default {
  data() {
    return {
      src: "",
    };
  },
  options: {
    addGlobalClass: true,
  },
  props: {
    height: {
      type: String,
      default: "100%",
    },
    text: {
      type: String,
      default: "暂无数据",
    },
  },
  mounted: function () {
    this.setData({
      src: connectlocalUrl("no-dl.png"),
    });
  },
  methods: {},
};
</script>
<style>
@import "./no-data.css";
</style>
