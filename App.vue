<!--
 * @Author: 可可同学
 * @Date: 2021-11-19 15:56:58
 * @LastEditTime: 2021-12-03 21:33:09
 * @LastEditors: 可可同学
 * @Description: 
-->
<script>
//app.js
require("./reco.config");

var events = [];
export default {
  data() {
    return {};
  },
  globalData: {
    netWorkstate: true,
    theme: "dark",
    eventOn: function (c, fun) {
      events.push({
        code: c,
        fun: fun,
      });
    },
    eventClear: function (c) {
      events = events.filter(function (x) {
        return x.code !== c;
      });
    },
    eventTrigger: function (code, data) {
      var es = events.filter(function (s) {
        return s.code === code;
      });
      var result = [];
      es.forEach(function (e) {
        if (e.fun) {
          result.push(e.fun(data));
        }
      });
      return result.length >= 1 ? result[0] : result;
    },
  },
  onLaunch: function () {
    var that = this;
    var menuButtonObject = uni.getMenuButtonBoundingClientRect();
    // console.log("menuButtonObject", menuButtonObject)
    uni.getSystemInfo({
      success: function (res) {
        console.log("getSystemInfo", res);
        // var statusBarHeight = res.statusBarHeight;
        // var navTop = menuButtonObject.top;
        // var navHeight = statusBarHeight + menuButtonObject.height + (menuButtonObject.top -
        // 	statusBarHeight) * 2;
        // that.globalData.navHeight = navHeight;
        // that.globalData.navTop = navTop;
        that.globalData.windowHeight = res.windowHeight;
        that.globalData.navColor = "#fff";
      },
      fail: function (err) {
        console.log(err);
      },
    });

    if (!wx.cloud) {
      console.warn("请使用 2.2.3 或以上的基础库以使用云能力");
    } else {
      wx.cloud.init({
        traceUser: true,
        env: "dev-4gju2hza605fd6b2",
      });
    }
  },
};
</script>
<style>
@import "./app.css";
</style>
