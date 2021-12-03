<template>
  <view class="phone-warp">
    <view class="page-body">
      <view class="header-banner">
        <uni-picture
          class="images-auto"
          :tableId="resourceId"
          tableName="BILocationResource"
          :readonly="true"
        ></uni-picture>
        <!-- <image src="@/static/images/bkg.jpg" style="width: 100%"></image> -->
        <!-- <view class="vr-box">
          <image src="@/static/images/vr.svg"></image>
          <text class="blod mr10">VR</text>
          <text class="ieb ieb-right size-12 blod"></text>
        </view> -->
      </view>
      <view class="weui-cells weui-cells_after-title">
        <view class="weui-cell weui-cell_example">
          <view class="weui-cell__bd">
            <view>{{ resourceName }}</view>
            <view
              class="omit omit-1 mt5"
              v-if="industryLocationsTags.length > 1"
            >
              <text
                class="default-tag"
                v-for="(tag, index) in industryLocationsTags"
                :key="index"
              >
                {{ tag }}
              </text>
            </view>
            <view class="omit omit-1 size-12 mt10" style="display: flex">
              <text class="gray-two-color" style="flex: 1">电话：</text>
              <text
                class="link-color"
                @click="callPhone"
                style="flex: 8; line-height: 32rpx"
              >
                {{ contactTel }}
              </text>
              <text
                class="ieb ieb-mobile size-12 link-color"
                @click="callPhone"
              ></text>
            </view>
            <view class="omit omit-1 size-12 mt5">
              <text class="gray-two-color">地址：</text>
              <text class="gray-two-color">{{ address }}</text>
            </view>
          </view>
        </view>
      </view>
      <view class="tabset">
        <view
          :class="'flex-item tab-bar ' + (selected == index ? 'active' : '')"
          @click="changTabs"
          :data-index="index"
          v-for="(item, index) in tabs"
          :key="item.key"
        >
          {{ item.name }}
        </view>
        <view></view>
      </view>
      <block v-if="selected == 0">
        <view class="weui-cells__title">基本介绍</view>
        <view class="weui-cells weui-cells_after-title not-border">
          <view
            class="weui-cell weui-cell_example"
            v-for="(item, index) in listData"
            :key="index"
          >
            <view class="weui-cell__bd size-14">
              <view class="flex start">
                <view class="label-name">{{ item.label }}</view>
                <view
                  class="flex-item color-d"
                  v-if="item.label === '网址'"
                  @click="copyText"
                  :data-text="item.value"
                >
                  {{ item.value || "" }}
                </view>
                <view class="flex-item gray-three-color" v-else>{{
                  item.value
                }}</view>
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
              <view class="size-14 blod">已入驻企业({{ ents.length }}家)</view>
              <view class="ent-list">
                <view class="item" v-for="(item, index) in ents" :key="index">{{
                  item.entName
                }}</view>
              </view>
            </view>
          </view>
          <view class="weui-cell weui-cell_example">
            <view class="wei-cells_bd width-full">
              <view class="size-14 blod"
                >明星企业({{ entsStar.length }}家)</view
              >
              <view class="ent-list">
                <view
                  class="item"
                  v-for="(item, index) in entsStar"
                  :key="index"
                  >{{ item.entName }}</view
                >
              </view>
            </view>
          </view>
        </view>
      </block>
      <block v-if="selected == 2">
        <view class="weui-cells__title">周边配套</view>
        <view class="map_container">
          <map
            class="map"
            id="map"
            :latitude="latitude"
            :longitude="longitude"
            :show-location="true"
            :markers="markers"
            @markertap="markertap"
            @callouttap="markertap"
          ></map>
        </view>
        <view class="map_text">
          <text class="h1">{{ textData.name }}</text>
          <text>{{ textData.desc }}</text>
        </view>
      </block>
    </view>
    <view class="weui-flex footer flex-collapse" v-if="showButton">
      <view class="weui-flex__item">
        <a class="weui-btn weui-btn_primary" @click="tzzx">投资咨询</a>
      </view>
    </view>
  </view>
</template>

<script>
let amapFile = require("../../static/js/amap-wx"); //如：..­/..­/libs/amap-wx.js
let config = require("../../static/js/config");
const { resourceValueType, resourceTypeEnum } = require("./common");
const { LocationService } = require("./service/index.service");
let markersData = [];
export default {
  data() {
    return {
      selected: 0,
      listData: [],
      tabs: [],
      showButton: true,

      markerId: "",
      resourceTypeValue: "",
      markers: [],
      city: "",
      latitude: "",
      longitude: "",
      textData: {
        name: "",
        desc: "",
      },
      info: {},
      resourceId: "",
      contactTel: "",
      resourceName: "",
      resourceRegionName: "",
      address: "",
      industryLocationsTags: [],
      ents: [],
      entsStar: [],
      itude: "",
    };
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let markerId = options.markerId,
      resourceTypeValue = options.resourceTypeValue;

    if (resourceTypeValue in resourceValueType.resourceSpace) {
      // 5个类型

      if (+resourceTypeValue === resourceTypeEnum.resourcePark) {
        this.resourcePark(markerId);
        this.setData({
          tabs: [
            {
              name: "基本介绍",
              id: "1",
            },
            {
              name: "园区企业",
              id: "2",
            },
            {
              name: "周边配套",
              id: "3",
            },
          ],
        });
      } else if (+resourceTypeValue === resourceTypeEnum.resourceLand) {
        this.resourceLand(markerId);
      } else if (+resourceTypeValue === resourceTypeEnum.resourceBuilding) {
        this.resourceBuilding(markerId);
      } else if (
        +resourceTypeValue === resourceTypeEnum.resourceFactory ||
        +resourceTypeValue === resourceTypeEnum.resourceStorage
      ) {
        this.resourceFactory(markerId);
      }
    } else if (resourceTypeValue in resourceValueType.resourceService) {
      // 同一个类型
      this.setData({ showButton: false });
      this.resourceService(markerId);
    } else if (resourceTypeValue in resourceValueType.resourceLife) {
      // 同一个类型
      this.setData({ showButton: false });
      this.resourceLife(markerId);
    }
    this.setData({
      markerId,
      resourceTypeValue,
    });
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
  onShareAppMessage: function () {
    console.log(opts.target);
    return {};
  },
  methods: {
    changTabs: function (e) {
      this.setData({
        selected: e.currentTarget.dataset.index,
      });

      /**
       * 园区资源-周边配套
       */
      if (e.currentTarget.dataset.index === 2) {
        let that = this;
        let key = config.Config.key;
        let myAmapFun = new amapFile.AMapWX({
          key,
        });
        let params = {
          iconPathSelected:
            "https://webapi.amap.com/theme/v1.3/markers/n/mark_b1.png",
          iconPath: "https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
          location: this.itude, // '121.582081,31.199291',
          success: function (data) {
            markersData = data.markers;
            let poisData = data.poisData;
            let markers_new = [];
            markersData.forEach(function (item, _index) {
              markers_new.push({
                id: item.id,
                latitude: item.latitude,
                longitude: item.longitude,
                iconPath: item.iconPath, //"https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
                width: item.width,
                height: item.height,
              });
            });
            console.log(markersData, markers_new);
            if (markersData.length > 0) {
              that.setData({
                markers: markers_new,
              });
              that.setData({
                city: poisData[0].cityname || "",
              });
              that.setData({
                latitude: markersData[0].latitude,
              });
              that.setData({
                longitude: markersData[0].longitude,
              });
              that.showMarkerInfo(markersData, 0);
            } else {
              that.setData({
                textData: {
                  name: "抱歉，未找到结果",
                  desc: "",
                },
              });
            }
          },
          fail: function (_info) {
            // uni.showModal({title:info.errMsg})
          },
        };
        myAmapFun.getPoiAround(params);
      }
    },

    markertap: function (e) {
      let id = e.detail.markerId;
      this.showMarkerInfo(markersData, id);
      this.changeMarkerColor(markersData, id);
    },

    showMarkerInfo: function (data, i) {
      this.setData({
        textData: {
          name: data[i].name,
          desc: data[i].address,
        },
      });
    },

    changeMarkerColor: function (data, i) {
      let markers = [];
      for (let j = 0; j < data.length; j++) {
        if (j == i) {
          data[j].iconPath = "../../static/images/marker_checked.png";
        } else {
          data[j].iconPath = "../../static/images/marker.png";
        }
        markers.push({
          id: data[j].id,
          latitude: data[j].latitude,
          longitude: data[j].longitude,
          iconPath: data[j].iconPath,
          width: data[j].width,
          height: data[j].height,
        });
      }
      this.setData({
        markers: markers,
      });
    },

    tzzx: function () {
      const state = this,
        resourceName = state.resourceName,
        industryLocationsTags = state.industryLocationsTags,
        contactTel = state.contactTel,
        resourceRegionName = state.info?.resource?.resourceRegionName,
        resourceId = state.resourceId;

      uni.navigateTo({
        url: `/xinmi/consult/consult?resourceName=${resourceName}&industryLocationsTags=${industryLocationsTags}&contactTel=${contactTel}&resourceId=${resourceId}&resourceRegionName=${resourceRegionName}`,
      });
    },

    callPhone() {
      const state = this,
        contactTel = state.contactTel;
      // 电话号码不存在
      if (contactTel) {
        uni.makePhoneCall({
          phoneNumber: contactTel,
        });
      } else {
        uni.showToast({
          title: `电话号码不存在`,
          icon: "none",
          duration: 2000,
        });
      }
    },

    copyText: function (e) {
      uni.setClipboardData({
        data: e.currentTarget.dataset.text,
        success: function (_res) {
          uni.getClipboardData({
            success: function (_res) {
              uni.showToast({
                title: "链接已复制",
              });
            },
          });
        },
      });
    },

    /**
     * 产业资源-产业园区-获取详情
     * @param id
     */
    async resourcePark(baseId) {
      try {
        const info = await LocationService.resourcePark({ baseId });
        let entsStar = (info?.ents || []).filter((item) => item.isStar);
        let resource = info?.resource;
        this.setData({
          info,
          resourceId: info?.resourceId,
          contactTel: info?.contactTel,
          resourceName: resource?.resourceName,
          resourceRegionName: resource?.resourceRegionName,
          address: resource?.address,
          industryLocationsTags: resource?.industryLocations?.split(",") || [],
          ents: info?.ents,
          entsStar,
          itude: resource?.itude,
          longitude: resource?.itude ? +resource?.itude?.split(",")[0] : "",
          latitude: resource?.itude ? +resource?.itude?.split(",")[1] : "",
          listData: [
            {
              label: "园区名称",
              value: resource?.resourceName,
            },
            {
              label: "所在区域",
              value: resource?.resourceRegionName,
            },
            {
              label: "具体位置",
              value: resource?.address,
            },
            {
              label: "办公楼宇",
              value: (info?.buildingNumber || "-") + "栋",
            },
            {
              label: "标准厂房",
              value: (info?.factoryNumber || "-") + "栋",
            },
            {
              label: "产业定位",
              value: resource?.industryLocations,
            },
            {
              label: "入驻企业数",
              value: (info?.ents?.length || "0") + "家",
            },
            {
              label: "联系人",
              value: info?.contactPerson,
            },
            {
              label: "联系电话",
              value: info?.contactTel,
            },
            {
              label: "简介",
              value: resource?.summary,
            },
          ],
        });
      } catch (e) {
        uni.showToast({
          title: `${e?.errmsg || e}`,
          icon: "none",
          duration: 2000,
        });
      }
    },

    /**
     * 产业资源-招商地块-获取详情
     * @param id
     */
    async resourceLand(baseId) {
      try {
        const info = await LocationService.resourceLand({ baseId });
        let resource = info?.resource;
        this.setData({
          info,
          resourceId: info?.resourceId,
          contactTel: info?.contactTel,
          resourceName: resource?.resourceName,
          address: resource?.address,
          industryLocationsTags: resource?.industryLocations?.split(",") || [],
          listData: [
            {
              label: "地块名称",
              value: resource?.resourceName,
            },
            {
              label: "产业定位",
              value: resource?.industryLocations,
            },
            {
              label: "地块面积",
              value: (resource?.resourceArea || "-") + "㎡",
            },
            {
              label: "规划用地性质",
              value: info?.useType,
            },
            {
              label: "容积率",
              value: (info?.plotRate || "-") + "%",
            },
            {
              label: "建筑密度",
              value: (info?.buildingDensity || "-") + "%",
            },
            {
              label: "建筑高度",
              value: (info?.buildingHeight || "-") + "m",
            },
            {
              label: "绿化率",
              value: (info?.greenRate || "-") + "%",
            },
            {
              label: "所在区域",
              value: resource?.resourceRegionName,
            },
            {
              label: "具体位置",
              value: resource?.address,
            },
            {
              label: "联系人",
              value: info?.contactPerson,
            },
            {
              label: "联系电话",
              value: info?.contactTel,
            },
            {
              label: "简介",
              value: resource?.summary,
            },
          ],
        });
      } catch (e) {
        uni.showToast({
          title: `${e?.errmsg || e}`,
          icon: "none",
          duration: 2000,
        });
      }
    },

    /**
     * 产业资源-办公楼宇-获取详情
     * @param id
     */
    async resourceBuilding(baseId) {
      try {
        const info = await LocationService.resourceBuilding({ baseId });
        let resource = info?.resource;
        this.setData({
          info,
          resourceId: info?.resourceId,
          contactTel: info?.contactTel,
          resourceName: resource?.resourceName,
          address: resource?.address,
          industryLocationsTags: resource?.industryLocations?.split(",") || [],
          listData: [
            {
              label: "楼宇名称",
              value: resource?.resourceName,
            },
            {
              label: "产业定位",
              value: resource?.industryLocations,
            },
            {
              label: "所属园区",
              value: info?.resourceParkName,
            },
            {
              label: "所在区域",
              value: resource?.resourceRegionName,
            },
            {
              label: "具体位置",
              value: resource?.address,
            },
            {
              label: "楼层数",
              value: (info?.floorNumber || "-") + "层",
            },
            {
              label: "用地面积",
              value: (resource?.resourceArea || "-") + "㎡",
            },
            {
              label: "已使用面积",
              value: (info?.usedArea || "-") + "㎡",
            },
            {
              label: "已租赁面积",
              value: (info?.leasedArea || "-") + "㎡",
            },
            {
              label: "已出售面积",
              value: (info?.selledArea || "-") + "㎡",
            },
            {
              label: "自用面积",
              value: (info?.selfUseArea || "-") + "㎡",
            },
            {
              label: "未使用面积",
              value: (info?.unUserdArea || "-") + "㎡",
            },
            {
              label: "可租赁面积",
              value: (info?.unLeasedArea || "-") + "㎡",
            },
            {
              label: "空置面积",
              value: (info?.vacantArea || "-") + "㎡",
            },
            {
              label: "入驻企业数",
              value: (info?.ents?.length || "0") + "家",
            },
            {
              label: "联系人",
              value: info?.contactPerson,
            },
            {
              label: "联系电话",
              value: info?.contactTel,
            },
            {
              label: "简介",
              value: resource?.summary,
            },
          ],
        });
      } catch (e) {
        uni.showToast({
          title: `${e?.errmsg || e}`,
          icon: "none",
          duration: 2000,
        });
      }
    },

    /**
     * 产业资源-标准厂房/仓库-获取详情
     * @param id
     */
    async resourceFactory(baseId) {
      try {
        const info = await LocationService.resourceFactory({ baseId });
        let resource = info?.resource;
        this.setData({
          info,
          resourceId: info?.resourceId,
          contactTel: info?.contactTel,
          resourceName: resource?.resourceName,
          address: resource?.address,
          industryLocationsTags: resource?.industryLocations?.split(",") || [],
          listData: [
            {
              label: "名称",
              value: resource?.resourceName,
            },
            {
              label: "产业定位",
              value: resource?.industryLocations,
            },
            {
              label: "所属园区",
              value: info?.resourceParkName,
            },
            {
              label: "所在区域",
              value: resource?.resourceRegionName,
            },
            {
              label: "具体位置",
              value: resource?.address,
            },
            {
              label: resource?.resourceType?.slice(-2) + "层数",
              value: (info?.floorNumber || "-") + "层",
            },
            {
              label: resource?.resourceType?.slice(-2) + "层高",
              value: (info?.floorHeight || "-") + "m",
            },
            {
              label: "用地面积",
              value: (resource?.resourceArea || "-") + "㎡",
            },
            {
              label: "可租赁面积",
              value: (info?.unLeasedArea || "-") + "㎡",
            },
            {
              label: "已租赁面积",
              value: (info?.leasedArea || "-") + "㎡",
            },
            {
              label: "空置面积",
              value: (info?.vacantArea || "-") + "㎡",
            },
            {
              label: "入驻企业数",
              value: (info?.ents?.length || "0") + "家",
            },
            {
              label: "联系人",
              value: info?.contactPerson,
            },
            {
              label: "联系电话",
              value: info?.contactTel,
            },
            {
              label: "简介",
              value: resource?.summary,
            },
          ],
        });
      } catch (e) {
        uni.showToast({
          title: `${e?.errmsg || e}`,
          icon: "none",
          duration: 2000,
        });
      }
    },

    /**
     * 产业资源-创新服务资源-获取详情
     * @param id
     */
    async resourceService(baseId) {
      try {
        const info = await LocationService.resourceService({ baseId });
        let resource = info?.resource;
        this.setData({
          info,
          resourceId: info?.resourceId,
          contactTel: info?.contactTel,
          resourceName: resource?.resourceName,
          address: resource?.address,
          industryLocationsTags: resource?.industryLocations?.split(",") || [],
          listData: [
            {
              label: "机构名称",
              value: resource?.resourceName,
            },
            {
              label: "产业定位",
              value: resource?.industryLocations,
            },
            {
              label: "所在区域",
              value: resource?.resourceRegionName,
            },
            {
              label: "具体位置",
              value: resource?.address,
            },
            {
              label: "联系电话",
              value: info?.contactTel,
            },
            {
              label: "简介",
              value: resource?.summary,
            },
          ],
        });
      } catch (e) {
        uni.showToast({
          title: `${e?.errmsg || e}`,
          icon: "none",
          duration: 2000,
        });
      }
    },

    /**
     * 产业资源-生产生活资源-获取详情
     * @param id
     */
    async resourceLife(baseId) {
      try {
        const info = await LocationService.resourceLife({ baseId });
        let resource = info?.resource;
        this.setData({
          info,
          resourceId: info?.resourceId,
          contactTel: info?.contactTel,
          resourceName: resource?.resourceName,
          address: resource?.address,
          industryLocationsTags: resource?.industryLocations?.split(",") || [],
          listData: [
            {
              label: info?.type + "名称",
              value: resource?.resourceName,
            },
            {
              label: "所在区域",
              value: resource?.resourceRegionName,
            },
            {
              label: "详细地址",
              value: resource?.address,
            },
            {
              label: "联系电话",
              value: info?.contactTel,
            },
            {
              label: "网址",
              value: info?.website,
            },
            {
              label: "简介",
              value: resource?.summary,
            },
          ],
        });
      } catch (e) {
        uni.showToast({
          title: `${e?.errmsg || e}`,
          icon: "none",
          duration: 2000,
        });
      }
    },
  },
};
</script>
<style>
@import "./details.css";
</style>
