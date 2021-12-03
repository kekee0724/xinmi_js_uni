<template>
  <view class="contain" :style="'height:' + height + ';'">
    <view class="result-message">
      <image :src="src"></image>
      <view class="text">{{ text || "暂无数据" }}</view>
    </view>
  </view>
</template>

<script>
const { connectlocalUrl } = require("../../core/funcs/transform.url");

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
