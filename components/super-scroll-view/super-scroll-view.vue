<template>
  <view>
    <scroll-view
      class="height-full"
      :scrollTop="scrollTop"
      :scroll-y="true"
      :refresher-triggered="srefreshertriggered"
      :refresher-enabled="refresher"
      @scrolltolower="loadMore"
      @scrolltoupper="scrolltoupperFun"
      @scroll="onPageScroll"
      @touchstart="touchStartFun"
      @touchend="touchEnd"
    >
      <slot></slot>
      <view v-if="showFooter" class="no-content">{{ footerContent }}</view>
    </scroll-view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      scrolltoupper: true,
      footerContent: "没有更多内容了~",
      srefreshertriggered: false,
      refresher: true,
      scrollTop: 0,
      touchStart: false,
      startOffsetTop: "",
    };
  },
  options: {
    addGlobalClass: true,
  },
  props: {
    refreshertriggered: Boolean,
    refreshdisable: Boolean,
    showFooter: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    refreshertriggered_refreshdisable: {
      handler: function (newValue, oldValue) {
        const { refreshertriggered, refreshdisable } = newValue;
        console.log("观察refreshertriggered变化", newValue, oldValue);
        this.setData({
          srefreshertriggered: refreshertriggered,
          refresher: refreshdisable ? false : true,
        });
      },
      //   immediate: true,
      //   deep: true,
    },
  },
  methods: {
    onPageScroll: function (e) {
      let top = e.detail.scrollTop;
      this.setData({
        scrollTop: top,
        touchStart: false,
        scrolltoupper: top < 5 ? true : false,
      });
    },
    scrolltoupperFun: function (e) {
      this.setData({
        scrolltoupper: true,
      });
    },
    loadMore: function (e) {},
    touchStartFun: function (e) {
      this.setData({
        touchStart: true,
        startOffsetTop: e.changedTouches[0].pageY,
      });
    },
    touchEnd: function (e) {
      let scrolltoupper = this.scrolltoupper;
      let touchStart = this.touchStart;
      let startOffsetTop = this.startOffsetTop;
      let endOffsetTop = e.changedTouches[0].pageY;

      if (scrolltoupper || (scrolltoupper && touchStart)) {
        if (this.refresher && startOffsetTop !== endOffsetTop) {
          this.$emit("pulldown");
        }
      }
    },
  },
  computed: {
    refreshertriggered_refreshdisable() {
      const { refreshertriggered, refreshdisable } = this;
      return {
        refreshertriggered,
        refreshdisable,
      };
    },
  },
};
</script>
<style>
@import "./super-scroll-view.css";
</style>
