<script>
const { CONFIG, WXAPI, AUTH } = require("./kek");

require("./reco.config");
let events = [];
export default {
  data() {},
  globalData: {
    discoverIndex: 0,
    netWorkstate: true,
    isConnected: true,
    theme: "dark",
    access_token: null,
    config: {
      apiUrl: "https://gitee.com/",
      mock: false,
    },
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
    initWXAPI: function () {
      WXAPI.init(CONFIG.subDomain); // 从根目录的 config.js 文件中读取
      WXAPI.banners().then(function (res) {
        if (res.code == 0) {
          console.log("WXAPI.banners()", res.data);
        }
      });
      // 获取所有的文章分类
      WXAPI.cmsCategories().then((res) => {
        if (res.code === 0) {
          res.data.forEach((category) => {
            uni.setStorageSync("news_category_" + category.key, category);
          });
        }
      });
      uni.removeStorageSync("appid");
      uni.removeStorageSync("componentAppid");
      let extConfig = uni.getExtConfigSync ? uni.getExtConfigSync() : {};
      //   console.log(extConfig);
      let subDomain, componentAppid;

      if (extConfig) {
        subDomain = extConfig.subDomain;
        componentAppid = extConfig.componentAppid;
      }
      if (componentAppid) {
        uni.setStorageSync("appid", uni.getAccountInfoSync().miniProgram.appId);
        uni.setStorageSync("componentAppid", componentAppid);
      }
      if (subDomain) {
        WXAPI.init(subDomain);
      } else {
        WXAPI.init(CONFIG.subDomain);
        WXAPI.setMerchantId(CONFIG.merchantId);
      }
      // 检测新版本
      const updateManager = uni.getUpdateManager();
      updateManager.onUpdateReady(function () {
        uni.showModal({
          title: "更新提示",
          content: "新版本已经准备好，是否重启应用？",
          success(res) {
            if (res.confirm) {
              // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
              updateManager.applyUpdate();
            }
          },
        });
      });
      /**
       * 初次加载判断网络情况
       * 无网络状态下根据实际情况进行调整
       */
      uni.getNetworkType({
        success: (res) => {
          const networkType = res.networkType;
          if (networkType === "none") {
            this.globalData.isConnected = false;
            uni.showToast({
              title: "当前无网络",
              icon: "loading",
              duration: 2000,
            });
          }
        },
      });
      /**
       * 监听网络状态变化
       * 可根据业务需求进行调整
       */
      uni.onNetworkStatusChange((res) => {
        if (!res.isConnected) {
          this.globalData.isConnected = false;
          uni.showToast({
            title: "网络已断开",
            icon: "loading",
            duration: 2000,
          });
        } else {
          this.globalData.isConnected = true;
          uni.hideToast();
        }
      });
      WXAPI.queryConfigBatch(
        "mallName,DEFAULT_FRIEND_UID,mylogo,myname,tel,WITHDRAW_MIN,ALLOW_SELF_COLLECTION,order_hx_uids,subscribe_ids,share_profile,adminUserIds,goodsDetailSkuShowType,shopMod,needIdCheck,balance_pay_pwd,shipping_address_gps,shipping_address_region_level,shopping_cart_vop_open,show_wx_quanzi,cps_open,recycle_open,categoryMod,hide_reputation,show_seller_number,show_goods_echarts,show_buy_dynamic,goods_search_show_type,show_3_seller,show_quan_exchange_score,show_score_exchange_growth,show_score_sign,fx_subscribe_ids,share_pic"
      ).then((res) => {
        if (res.code == 0) {
          res.data.forEach((config) => {
            uni.setStorageSync(config.key, config.value);
          });
          if (getApp().configLoadOK) {
            getApp().configLoadOK();
          }
        }
      });
    },
    getUserInfo: function (callback) {
      if (this.access_token) {
        uni.request({
          url: this.config.apiUrl + "api/v5/user",
          method: "GET",
          data: {
            access_token: this.access_token,
          },
          success: (result) => {
            if (result.data.hasOwnProperty("id")) {
              this.userInfo = result.data;
              callback(true);
            } else {
              callback(false);
            }
          },
        });
      } else {
        this.access_token = uni.getStorageSync("access_token");
        if (this.access_token) {
          this.getUserInfo(callback);
        } else {
          callback(false);
        }
      }
    },
    loginFirst: function () {
      uni.hideLoading();
      uni.showModal({
        title: "请先绑定",
        content: "你需要绑定仓库才能操作",
        showCancel: true,
        confirmText: "确定",
        cancelText: "取消",
        success(_res) {},
      });
    },
    logout: function () {
      uni.removeStorageSync("access_token");
      this.access_token = null;
    },
    loadFont() {
      uni.loadFontFace({
        family: "Roboto",
        source: "url(https://static.hamm.cn/font/Gotham-Book.woff2)",
      });
    },
  },
  onLaunch: function () {
    var that = this;
    uni.getSystemInfo({
      success: function (res) {
        console.log("getSystemInfo", res);
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
    this.globalData.initWXAPI();
  },
  onShow: function () {
    // 自动登录
    AUTH.checkHasLogined().then((isLogined) => {
      if (!isLogined) {
        AUTH.login();
      } else {
        AUTH.bindSeller();
      }
    });
  },
  onHide: function () {},
};
</script>

<style lang="scss">
/*每个页面公共css */
@import "@/uni_modules/uview-ui/index.scss";
@import "common/demo.scss";
</style>
<style>
@import "./static/style/font/iconfont_1.0.css";
@import "./static/style/font/iconfont_2.0.css";
@import "./static/style/font/iconfont_com.css";
@import "./static/style/font/iconfont-weapp-icon.css";
@import "./app.css";
</style>
