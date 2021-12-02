<template>
  <!--pages/consult/consult.wxml-->
  <view class="phone-warp">
    <view class="page-body">
      <view class="list-card">
        <view class="card-list-item">
          <view class="header">咨询资源</view>
          <view class="card dark">
            <view class="flex">
              <view class="flex-item">
                <view class="title omit omit-1">{{ resourceName }}</view>
                <view v-if="industryLocationsTags[0]" class="omit omit-1 mt20">
                  <text
                    class="default-tag"
                    v-for="(tag, index) in industryLocationsTags"
                    :key="index"
                    >{{ tag }}</text
                  >
                </view>
                <view class="omit omit-1 size-12 mt10">
                  <text class="gray-three-color">投资热线：</text>
                  {{ contactTel }}
                </view>
              </view>
              <uni-picture
                className="images-auto"
                :tableId="resourceId"
                tableName="BILocationResource"
                :readonly="true"
              ></uni-picture>
              <!-- <image class="images-auto" style="width:123px; height: 84px"
              src="https://img2.baidu.com/it/u=3922526097,2180692065&fm=26&fmt=auto&gp=0.jpg"></image> -->
            </view>
          </view>
        </view>
        <view class="card-list-item">
          <view class="header">
            我的信息
            <text class="color-b">*</text>
          </view>

          <view class="input-item flex">
            姓名：
            <view class="flex-item">
              <textarea
                @input="contactNameInput"
                class="weui-textarea"
                placeholder-class="weui-input__placeholder"
                placeholder=""
                style="height: 34rpx"
              />
            </view>
          </view>
          <view class="input-item flex">
            电话：
            <view class="flex-item">
              <textarea
                @input="contactMobileInput"
                class="weui-textarea"
                placeholder-class="weui-input__placeholder"
                placeholder=""
                style="height: 34rpx"
              />
            </view>
          </view>
          <!-- <view class="input-item flex">
          验证码：
          <view class="flex-item">
            <input class="weui-input" bindinput="codeInput" placeholder-class="weui-input__placeholder"
              placeholder="请输入验证码" />
          </view>
          <view bindtap="getCode" class="link-color">{{delay || '获取验证码'}}</view>
        </view> -->
        </view>
        <view class="card-list-item">
          <view class="header">
            备注信息
            <text class="gray-three-color not-blod size-14"
              >（200字符以内）</text
            >
          </view>
          <view class="card dark">
            <textarea
              @input="noteInput"
              class="weui-textarea"
              placeholder-class="weui-input__placeholder"
              placeholder="请输入内容描述"
              :maxlength="200"
              style="height: 9em"
            />
            <!-- <view class="weui-textarea-counter">0/200</view> -->
          </view>
        </view>
      </view>
    </view>
    <view class="weui-flex footer flex-collapse">
      <view class="weui-flex__item">
        <a @click="submit" class="weui-btn weui-btn_primary">提交</a>
      </view>
    </view>
  </view>
</template>

<script>
const { consultOrderService } = require("./service/consult.service");

const {
  getLocalStorage,
  removeLocalStorage,
  setLocalStorage,
} = require("../../core/funcs/storage");

const { formatDateTime } = require("../../core/funcs/formatTime");

const { Validators } = require("../../core/funcs/validate");

const moment = require("../../core/funcs/moment");

let interval;

export default {
  data() {
    return {
      resourceName: "",
      industryLocationsTags: [],
      contactTel: "",
      resourceId: "",
      resourceRegionName: "",
      delay: "",
      telphone: "",
      contactName: "",
      note: "",
      code: "",
    };
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const resourceName = options.resourceName, // 资源名称
      industryLocationsTags = options.industryLocationsTags, // 资源标签
      contactTel = options.contactTel, // 联系电话
      resourceId = options.resourceId, // 资源id
      resourceRegionName = options.resourceRegionName; // 资源所在区域
    this.setData({
      resourceName,
      industryLocationsTags: industryLocationsTags.split(","),
      contactTel,
      resourceId,
      resourceRegionName,
    });
    this.getTime();
    this.getMobile();
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.setTime(this.delay);
    this.clearInterval();
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
  methods: {
    getTime() {
      let delayTime = getLocalStorage("InvestmentAdvisoryDate");

      if (delayTime) {
        let delay = +getLocalStorage("InvestmentAdvisoryDelay");
        let newData = moment();
        let time = newData.diff(moment(delayTime), "seconds") || 0;

        let countdown = delay - time;

        if (countdown > 0) {
          this.setData({ delay: countdown });
          this.creatInterval();
        }
        removeLocalStorage("InvestmentAdvisoryDelay");
        removeLocalStorage("InvestmentAdvisoryDate");
      }
    },
    getMobile() {
      if (!interval) {
        removeLocalStorage("accountChangeMobile");
      } else {
        this.setData({ telphone: getLocalStorage("accountChangeMobile") });
      }
    },
    /**
     * 输入姓名回调
     */
    contactNameInput(e) {
      this.setData({ contactName: e.detail.value });
    },
    /**
     * 输入电话回调
     */
    contactMobileInput(e) {
      this.setData({ telphone: e.detail.value });
    },
    /**
     * 输入备注回调
     */
    noteInput(e) {
      this.setData({ note: e.detail.value });
    },
    /**
     * 输入验证码回调
     */
    codeInput(e) {
      this.setData({ code: e.detail.value });
    },
    setTime(delay) {
      setLocalStorage("InvestmentAdvisoryDate", formatDateTime(new Date()));
      setLocalStorage("InvestmentAdvisoryDelay", `${delay}`);
    },
    clearInterval() {
      interval && clearInterval(interval);
      interval = null;
    },
    creatInterval() {
      interval = setInterval(() => {
        let delay = this.delay;
        this.setTime(delay);
        if (delay > 0) {
          const newDelay = delay - 1;
          this.setData({ delay: newDelay });
        } else {
          this.clearInterval();
        }
      }, 1000);
    },
    checkMobile() {
      const state = this,
        telphone = state.telphone,
        { required, composeControl, ValidatorControl, cellphone } = Validators;
      return ValidatorControl(
        composeControl([required, cellphone], {
          value: telphone,
          name: "电话",
        })
      );
    },
    /**
     * 发送验证码
     */
    async getCode() {
      try {
        if (interval) {
          return;
        }
        const msg = this.checkMobile()();
        if (msg) {
          uni.showToast({
            title: msg.join(),
            icon: "none",
            duration: 2000,
          });
          return;
        }
        await consultOrderService.getCode({ mobile: this.telphone });
        uni.showToast({
          title: "验证码已发送到您的手机,请注意查收",
          icon: "none",
        });
        this.setData({ delay: 60 });
        setLocalStorage("accountChangeMobile", this.telphone);
        this.creatInterval();
      } catch (e) {
        uni.showToast({
          title: `${e.errmsg || e}`,
          icon: "error",
        });
      }
    },
    /**
     * 检查
     */
    validator() {
      const state = this,
        contactName = state.contactName,
        telphone = state.telphone,
        // code = state.code,
        { required, composeControl, ValidatorControl, cellphone } = Validators;
      return ValidatorControl(
        composeControl([required], {
          value: contactName,
          name: "姓名",
        }),
        composeControl([required, cellphone], {
          value: telphone,
          name: "电话",
        })
        // composeControl([required], {
        //   value: code,
        //   name: "验证码",
        // })
      );
    },
    /**
     * 确认提交
     */
    async confirmSubmit() {
      try {
        const state = this,
          params = {
            name: state.contactName,
            note: state.note,
            // code: state.code,
            resource: state.resourceName,
            resourceId: state.resourceId,
            telphone: state.telphone,
            isDistribute: false,
            status: "待跟进",
            street: state.resourceRegionName,
          };
        await consultOrderService.post({ ...params });
        uni.showToast({
          title: "提交成功",
          icon: "success",
          success() {
            setTimeout(() => {
              uni.navigateBack();
            }, 1500);
          },
        });
      } catch (e) {
        uni.showToast({
          title: `${e.errmsg || e}`,
          icon: "error",
        });
      }
    },
    /**
     * 点击提交按钮
     */
    submit() {
      const msg = this.validator()();
      console.log(msg);
      if (msg) {
        uni.showToast({
          title: msg.join(),
          icon: "none",
          duration: 2000,
        });
        return;
      }
      const that = this;
      uni.showModal({
        title: "操作提示",
        content: "确定要提交吗?",
        success(res) {
          if (res.confirm) {
            that.confirmSubmit();
          }
        },
      });
    },
  },
};
</script>
<style>
@import "./consult.css";
</style>
