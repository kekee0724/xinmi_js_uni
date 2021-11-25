<template>
	<!--pages/details/details.wxml-->
	<view class="phone-warp">
		<view class="page-body">
			<view class="header-banner">
				<image src="@/static/images/bkg.jpg" style="width: 100%"></image>
				<view class="vr-box">
					<image src="@/static/images/vr.svg"></image>
					<text class="blod mr10">VR</text>
					<text class="ieb ieb-right size-12 blod"></text>
				</view>
			</view>
			<view class="weui-cells weui-cells_after-title">
				<view class="weui-cell weui-cell_example">
					<view class="weui-cell__bd">
						<view>开发区工业园</view>
						<view class="omit omit-1 mt5">
							<text class="default-tag">数字贸易</text>
							<text class="default-tag">集成电路</text>
						</view>
						<view class="omit omit-1 size-12 mt10">
							<text class="gray-two-color">电话：</text>
							<text class="link-color">
								0371-99998888
								<text class="ieb ieb-mobile size-12"></text>
							</text>
						</view>
						<view class="omit omit-1 size-12 mt5">
							<text class="gray-two-color">地址：</text>
							<text class="gray-two-color">新密市祥和路七街</text>
						</view>
					</view>
				</view>
			</view>
			<view class="tabset">
				<view :class="'flex-item tab-bar ' + (selected == index ? 'active' : '')" @click="changTabs"
					:data-index="index" v-for="(item, index) in tabs" :key="item.key">
					{{ item.name }}
				</view>
				<view></view>
			</view>
			<block v-if="selected == 0">
				<view class="weui-cells__title">基本介绍</view>
				<view class="weui-cells weui-cells_after-title not-border">
					<view class="weui-cell weui-cell_example" v-for="(item, index) in listData" :key="item.index">
						<view class="weui-cell__bd size-14">
							<view class="flex start">
								<view class="label-name">
									{{ item.label }}
								</view>
								<view class="flex-item gray-three-color">
									{{ item.value }}
								</view>
							</view>
						</view>
					</view>
				</view>
			</block>
			<block v-if="selected == 1">
				<view class="weui-cells__title">园区企业</view>
				<view class="weui-cells weui-cells_after-title not-border">
					<view class="weui-cell weui-cell_example">
						<view class="wei-cells_bd width-full">
							<view class="size-14 blod">已入驻企业(11家)</view>
							<view class="ent-list">
								<view class="item">郑州东方信息技术有限公司</view>
								<view class="item">郑州东方信息技术有限公司</view>
								<view class="item">郑州东方信息技术有限公司</view>
								<view class="item">郑州东方信息技术有限公司</view>
								<view class="item">郑州东方信息技术有限公司</view>
								<view class="item">郑州东方信息技术有限公司</view>
							</view>
						</view>
					</view>
					<view class="weui-cell weui-cell_example">
						<view class="wei-cells_bd width-full">
							<view class="size-14 blod">已入驻企业(11家)</view>
							<view class="ent-list">
								<view class="item">郑州东方信息技术有限公司</view>
								<view class="item">郑州东方信息技术有限公司</view>
								<view class="item">郑州东方信息技术有限公司</view>
								<view class="item">郑州东方信息技术有限公司</view>
								<view class="item">郑州东方信息技术有限公司</view>
								<view class="item">郑州东方信息技术有限公司</view>
							</view>
						</view>
					</view>
				</view>
			</block>
			<block v-if="selected == 2">
				<view class="weui-cells__title">周边配套</view>
				<view class="map_container">
					<map class="map" id="map"></map>
				</view>
			</block>
		</view>
		<view class="weui-flex footer flex-collapse" v-if="selected == 2">
			<view class="weui-flex__item">
				<a class="weui-btn weui-btn_primary">投资咨询</a>
			</view>
		</view>
	</view>
</template>

<script>
	// pages/details/details.js
	var amapFile = require('../../js/amap-wx'); //如：..­/..­/libs/amap-wx.js

	export default {
		data() {
			return {
				selected: 0,
				listData: [{
						label: '园区名称',
						value: '开发区工业园'
					},
					{
						label: '所在区域',
						value: '青屏街街道'
					},
					{
						label: '具体位置',
						value: '东明路与张东路交叉口'
					},
					{
						label: '办公楼宇',
						value: '1栋'
					},
					{
						label: '标准厂房',
						value: '7栋'
					},
					{
						label: '产业定位',
						value: '数字贸易、集成点库'
					},
					{
						label: '入驻企业',
						value: '10家'
					},
					{
						label: '联系人',
						value: '王先生'
					},
					{
						label: '联系电话',
						value: '0371-99999888'
					},
					{
						label: '园区总面积',
						value: '676236平米'
					},
					{
						label: '规划总面积',
						value: '76633平米'
					},
					{
						label: '已利用总面积',
						value: '7878平米'
					},
					{
						label: '简介',
						value: '项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述'
					}
				],
				tabs: [{
						name: '基本介绍',
						id: '1'
					},
					{
						name: '园区企业',
						id: '2'
					},
					{
						name: '周边配套',
						id: '3'
					}
				]
			};
		}
		/**
		 * 生命周期函数--监听页面加载
		 */
		,
		onLoad: function(options) {},
		/**
		 * 生命周期函数--监听页面初次渲染完成
		 */
		onReady: function() {},
		/**
		 * 生命周期函数--监听页面显示
		 */
		onShow: function() {},
		/**
		 * 生命周期函数--监听页面隐藏
		 */
		onHide: function() {},
		/**
		 * 生命周期函数--监听页面卸载
		 */
		onUnload: function() {},
		/**
		 * 页面相关事件处理函数--监听用户下拉动作
		 */
		onPullDownRefresh: function() {},
		/**
		 * 页面上拉触底事件的处理函数
		 */
		onReachBottom: function() {},
		/**
		 * 用户点击右上角分享
		 */
		onShareAppMessage: function() {},
		methods: {
			changTabs: function(e) {
				this.setData({
					selected: e.currentTarget.dataset.index
				});
				console.log(e.currentTarget.dataset.index);

				if (e.currentTarget.dataset.index === 2) {
					var that = this;
					var myAmapFun = new amapFile.AMapWX({
						key: '22c50e1b0516183debadb8af53014208'
					});

					myAmapFun.getPoiAround({
						success: function(data) {
							//成功回调
							console.log("高德地图 success", data)
						},
						fail: function(info) {
							//失败回调
							console.log(info);
							console.log("高德地图 fail", data)
						}
					});
				}
			}
		}
	};
</script>
<style>
	@import './details.css';
</style>
