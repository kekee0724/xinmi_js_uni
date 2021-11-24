<template>
    <view class="phone-warp">
        <view class="page-body">
            <view class="select-list">
                <view class="select-item" v-for="(item, index) in selectData" :key="item.index">
                    <view class="title">{{ item.title }}</view>

                    <view class="body">
                        <text :class="'tag ' + (tagName === item ? 'active' : '')" @click="selectChange" :data-index="item" v-for="(item, index1) in item.tag" :key="item.index">
                            {{ item }}
                        </text>
                    </view>
                </view>
            </view>
        </view>
        <view class="weui-flex footer flex-collapse">
            <view class="weui-flex__item">
                <a class="weui-btn weui-btn_primary">重置</a>
            </view>
            <view class="weui-flex__item">
                <a class="weui-btn weui-btn_primary">确定</a>
            </view>
        </view>
    </view>
</template>

<script>
// pages/search/search.js
export default {
    data() {
        return {
            tagName: String,
            selectData: [
                {
                    title: '资源类型',
                    tag: ['不限', '园区', '厂房', '仓库', '楼宇', '地块']
                },
                {
                    title: '位置',
                    tag: ['新密市', '袁庄乡', '米村镇', '牛店镇', '平陌镇', '超化镇', '苟堂镇', '青屏街街道']
                }
            ]
        };
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
    methods: {
        selectChange: function (e) {
            // console.log(e.currentTarget.dataset.index
            this.setData({
                tagName: e.currentTarget.dataset.index
            });
        }
    }
};
</script>
<style>
@import './search.css';
</style>
