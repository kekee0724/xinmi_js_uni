<template>
  <view>
    <scroll-view
      class="height-full"
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
      scrollTop: "",
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
    refresher: function () {
      this.refresher = !this.refreshdisable;
    },

    refreshertriggered_refreshdisable: {
      handler: function (newValue, oldValue) {
        const { refreshertriggered, refreshdisable } = newValue;
        console.log("watch", newValue, oldValue);
        this.setData({
          srefreshertriggered: false,
          refresher: refreshdisable ? false : true,
        });
      },

      immediate: true,
      deep: true,
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
    scrolltoupperFun: function () {
      this.setData({
        scrolltoupper: true,
      });
    },
    loadMore: function () {},
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
      console.log("computed", refreshertriggered, refreshdisable);
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
