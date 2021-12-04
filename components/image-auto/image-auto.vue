<!--
 * @Author: 可可同学
 * @Date: 2021-12-03 20:28:42
 * @LastEditTime: 2021-12-05 00:37:46
 * @LastEditors: 可可同学
 * @Description: 
-->
<template>
  <view>
    <image
      :class="sclass"
      :style="sstyle"
      :mode="mode"
      :src="ssrc"
      @error="imageError"
    ></image>
  </view>
</template>

<script>
const {
  transformAssetsUrl,
  connectlocalUrl,
} = require("../../core/funcs/transform.url");

export default {
  data() {
    return {
      ssrc: "",
      sstyle: "",
      sclass: "",
      mode: "",
    };
  },
  onPageShow: function () {},
  onPageHide: function () {},
  onPageResize: function () {},
  options: {
    addGlobalClass: true,
  },
  props: {
    src: {
      type: String,
      default: undefined,
    },
    styles: {
      type: String,
      default: undefined,
    },
    className: {
      type: String,
      default: undefined,
    },
  },
  watch: {
    src_styles_className: {
      handler: function (newValue, oldValue) {
        const { src, styles, className } = newValue;

        this.setData({
          ssrc: src ? transformAssetsUrl(src) : connectlocalUrl("error.png"),
          sstyle: styles,
          sclass: src ? className : "erro-class",
          mode: src ? "aspectFill" : "aspectFit",
        });
      },

      immediate: true,
      deep: true,
    },
  },
  mounted: function () {},
  methods: {
    imageError: function () {
      this.setData({
        ssrc: connectlocalUrl("error.png"),
        mode: "aspectFit",
      });
    },
  },
  computed: {
    src_styles_className() {
      const { src, styles, className } = this;

      return {
        src,
        styles,
        className,
      };
    },
  },
};
</script>
<style>
@import "./image-auto.css";
</style>
