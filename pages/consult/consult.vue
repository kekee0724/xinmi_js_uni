<template>
    <!--pages/consult/consult.wxml-->
    <view class="phone-warp">
        <view class="page-body">
            <view class="list-card">
                <view class="card-list-item">
                    <view class="header">新材料材相关产业区域</view>
                    <view class="card dark">
                        <view class="flex">
                            <view class="flex-item">
                                <view class="title omit omit-1">开发区工业园</view>
                                <view class="omit omit-1 mt20">
                                    <text class="default-tag">新材料</text>
                                    <text class="default-tag">品牌服装</text>
                                </view>
                                <view class="omit omit-1 size-12 mt10">
                                    <text class="gray-three-color">投资热线：</text>
                                    0371-87051769
                                </view>
                            </view>
                            <image class="images-auto" style="width: 123px; height: 84px" src="https://img2.baidu.com/it/u=3922526097,2180692065&fm=26&fmt=auto&gp=0.jpg"></image>
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
                            <input class="weui-input" placeholder-class="weui-input__placeholder" placeholder="请输入姓名" />
                        </view>
                    </view>
                    <view class="input-item flex">
                        电话：
                        <view class="flex-item">
                            <input class="weui-input" placeholder-class="weui-input__placeholder" placeholder="请输入电话" />
                        </view>
                    </view>
                    <view class="input-item flex">
                        姓名：
                        <view class="flex-item">
                            <input class="weui-input" placeholder-class="weui-input__placeholder" placeholder="请输入验证码" />
                        </view>
                        <view class="link-color">获取验证码</view>
                    </view>
                </view>
                <view class="card-list-item">
                    <view class="header">
                        备注信息
                        <text class="gray-three-color not-blod size-14">（200字符以内）</text>
                    </view>
                    <view class="card dark">
                        <textarea class="weui-textarea" placeholder-class="weui-input__placeholder" placeholder="请输入内容描述" style="height: 9em" />
                        <view class="weui-textarea-counter">0/200</view>
                    </view>
                </view>
            </view>
        </view>
        <view class="weui-flex footer flex-collapse">
            <view class="weui-flex__item">
                <a class="weui-btn weui-btn_primary">提交</a>
            </view>
        </view>
    </view>
</template>

<script>
// pages/consult/consult.js
export default {
    data() {
        return {};
    }
    /**
     * 生命周期函数--监听页面加载
     */,
    onLoad: function (options) {},
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
    onUnload: function () {},
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
    methods: {}
};
</script>
<style>
@import './consult.css';
</style>
