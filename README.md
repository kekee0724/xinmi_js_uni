# v-shop 商城(H5端)
一个前端基于vue，后端使用api工厂供的免费接口和云后台实现的移动端商城

- 项目地址  
[http://wx.shuzp.top](http//:wx.shuzp.top)

- 项目二维码(手机扫码)  
![项目二维码](https://s2.ax1x.com/2020/02/11/1TPJKS.png)

## 项目设置
```
npm install
```

### 项目本地调试和热更新
```
npm run serve
```

### 项目本地打包用于发布线上
```
npm run build
```
## 功能清单
- [x] 订单管理
  - [x] 创建订单
  - [x] 订单列表
  - [x] 订单详情(取消订单,付款,确认收货,评价,退换货)
  - [x] 系统钱包支付订单
- [x] 用户管理
  - [x] 用户注册/登录(手机号-手机接收验证码注册)
  - [x] 用户资产
  - [x] 用户信息(详情,修改)
  - [x] 收货地址(详情,修改,添加,删除)
  - [x] 我的收藏
  - [ ] 资金明细(加入充值/提现)
- [x] 优惠券
- [x] 购物车
- [x] 商城模块
  - [x] 商品列表
  - [x] 商品详情
    - [x] 商品规格(支持无规格，最多支持3种规格)
    - [x] 商品收藏
    - [x] 商品评价
    - [ ] 商品分享海报(普通商品,砍价,拼团商品等海报)
- [ ] 积分模块
- [x] 拼团/砍价
- [ ] 微信开发(公众号)
  - [ ] 微信支付
  - [ ] 用户注册/登录(微信公众号-快速注册/登录)
  - [ ] 绑定手机号
  - [ ] 微信分享给朋友
  - [ ] 微信支付
- [ ] 定制主题
- [ ] 页面路由缓存栈

## 项目截图
上传图片会被截掉,换成点链接查看

[项目截图](https://s2.ax1x.com/2020/02/11/1T9Bon.jpg)  

[拼团截图](https://s2.ax1x.com/2020/02/11/1T9yWV.jpg)  

[砍价截图](https://s2.ax1x.com/2020/02/11/1T9riq.jpg)
## 项目结构
```
src -- 源码目录
├── assets -- 静态图片资源文件
├── commmon -- 公用js
    ├── area.js -- 全国城市区数据JSON
    ├── flexible.js -- 可伸缩布局方案
    ├── request.js -- axios网络请求封装
    ├── util.js -- 工具类
    ├── validate.js -- 正则效验函数
    ├── validator.js -- 表单验证集合
├── components -- 通用组件封装 
├── router.js -- vue-router路由配置
├── store.js -- vuex的状态管理
├── styles -- 全局css样式
└── pages -- 前端页面
    ├── login -- 登录页
    ├── home -- 首页
    ├── user -- 用户中心
    ├── cart -- 购物车
    └── ... -- 其他页面
```
## 商品数据来源
```
https://m.mi.com/
```
## Rem 适配
项目编写过程中样式直接使用 `px`作为单位 ，然后再用工具转化

1. 引入`flexible` 用于设置 rem 基准值
```
// main.js
import './static/common/flexible'
```
2. 安装 `postcss-pxtorem` 用于将单位转化为 rem

`$ npm install postcss-pxtorem --save-dev`
```
// vue.config.js
const autoprefixer = require('autoprefixer')
const pxtorem = require('postcss-pxtorem')

css: {
  loaderOptions: {
    postcss: {
      plugins: [
        autoprefixer({
          browsers: ['Android >= 4.0', 'iOS >= 7']
        }),
        pxtorem({
          rootValue: 50,
          unitPrecision: 3,
          propList: ['*', '!font*'],
          selectorBlackList: ['.ignore ', '.hairlines', 'van-circle__layer', '.van-hairline'],
          minPixelValue: 2,
        })
      ]
    }
  }
}
```

## 联系我
舒志平

联系方式：1442702103@qq.com  
微信：f144270
# hello-uniapp

`uni-app`框架示例，一套代码，同时发行到iOS、Android、H5、小程序等多个平台，请使用手机在下方扫码快速体验`uni-app`的强大功能。[官方文档](https://uniapp.dcloud.net.cn/)

## 快速上手
hello-uniapp 示例工程可以通过两种方式创建， 一种是 HBuilderX, 配套 IDE，集成开发；另一种是 CLI 创建；推荐前者。
### 通过 HBuilderX 可视化界面创建（推荐）

可视化的方式比较简单，HBuilderX内置相关环境，开箱即用，无需配置nodejs。

开始之前，开发者需先下载安装如下工具：

- HBuilderX：[官方IDE下载地址](https://www.dcloud.io/hbuilderx.html)

HBuilderX是通用的前端开发工具，但为`uni-app`做了特别强化，请下载App开发版。

由于截图在 github 不便浏览，参见官方文档 [HBuilderX 可视化界面创建](https://uniapp.dcloud.net.cn/quickstart?id=_1-%e9%80%9a%e8%bf%87-hbuilderx-%e5%8f%af%e8%a7%86%e5%8c%96%e7%95%8c%e9%9d%a2)

### 通过 vue-cli 创建

```
npm install -g @vue/cli
```

#### 创建uni-app

**使用正式版**（对应HBuilderX最新正式版）

```
vue create -p dcloudio/uni-preset-vue my-project
```

**使用alpha版**（对应HBuilderX最新alpha版）

```
vue create -p dcloudio/uni-preset-vue#alpha my-alpha-project
```

此时，会提示选择项目模板，选择 `hello uni-app` 项目模板，如下所示：

<div>
<img src="https://img.cdn.aliyun.dcloud.net.cn/guide/uniapp/h5-cli-01.png" width="300">
</div>

创建好后，进入项目目录
```
cd my-project
```

执行该命令运行到 h5 端
```
npm run dev:h5
```

欢迎提 issues，推荐到[官方社区](https://ask.dcloud.net.cn/explore/)提问。

## 扫码体验

<div class="quick">
    <p>一套代码编到10个平台，这不是梦想。眼见为实，扫描10个二维码，亲自体验最全面的跨平台效果！</p>
    <div style="display: flex;">
      <a href="//m3w.cn/uniapp" target="_blank" class="clear-style barcode-view">
        <div class="barcode-img-box">
          <img src="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-dc-site/ba7d0750-517d-11eb-bdc1-8bd33eb6adaa.png" width="160" />
        </div>
        <b>Android版</b>
      </a>
      <a href="https://itunes.apple.com/cn/app/hello-uni-app/id1417078253?mt=8" target="_blank" class="clear-style barcode-view">
        <div class="barcode-img-box">
          <img src="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-dc-site/bb3ef7c0-517d-11eb-bdc1-8bd33eb6adaa.png" width="160" />
        </div>
        <b>iOS版</b>
      </a>
      <a href="https://hellouniapp.dcloud.net.cn/" target="_blank" class="clear-style barcode-view">
        <div class="barcode-img-box">
          <img src="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-dc-site/bb3ef7c0-517d-11eb-bdc1-8bd33eb6adaa.png" width="160" />
        </div>
        <b>H5版</b>
      </a>
      <a href="//m3w.cn/uniapp" target="_blank" class="clear-style barcode-view">
        <div class="barcode-img-box"><img src="//img.cdn.aliyun.dcloud.net.cn/guide/uniapp/gh_33446d7f7a26_430.jpg" width="160" /></div>
        <b>微信小程序版</b>
      </a>
      <a href="//m3w.cn/uniapp" target="_blank" class="clear-style barcode-view">
        <div class="barcode-img-box"><img src="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-dc-site/b131e0d0-517d-11eb-a16f-5b3e54966275.png" width="160" /></div>
        <b>支付宝小程序版</b>
      </a>
    </div>
    <div class="flex-img-group-view" style="margin-top: 20px;">
      <a href="//m3w.cn/uniapp" target="_blank" class="clear-style barcode-view">
        <div class="barcode-img-box"><img src="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-dc-site/b204e840-517d-11eb-8ff1-d5dcf8779628.png" width="160" /></div>
        <b>百度小程序版</b>
      </a>
      <a href="//m3w.cn/uniapp" target="_blank" class="clear-style barcode-view">
        <div class="barcode-img-box">
          <img src="https://img.cdn.aliyun.dcloud.net.cn/guide/uniapp/mp-toutiao.png" width="160" />
        </div>
        <b>字节跳动小程序版</b>
      </a>
      <a href="//m3w.cn/uniapp" target="_blank" class="clear-style barcode-view">
        <div class="barcode-img-box">
          <img src="https://img.cdn.aliyun.dcloud.net.cn/guide/uniapp/hello-uni-qq.png" width="160" />
        </div>
        <b>QQ小程序版</b>
      </a>
      <a href="//m3w.cn/uniapp" target="_blank" class="clear-style barcode-view">
        <div class="barcode-img-box">
          <img src="https://img.cdn.aliyun.dcloud.net.cn/guide/uniapp/hello-uni-qa-union.png" width="160" />
        </div>
        <b>快应用</b>
      </a>
      <a href="https://so.mp.360.cn/mp.html?appid=qh4j181qqtru354st6" target="_blank" class="clear-style barcode-view">
        <div class="barcode-img-box">
          <img src="https://img.cdn.aliyun.dcloud.net.cn/guide/uniapp/hello-uni-mp-360-qr.png" width="160" />
        </div>
        <b>360小程序</b>
      </a>
    </div>
    <p>
        <em>注：某些平台不能提交简单demo，故补充了一些其他功能；hello uni-app示例代码可从[github](https://github.com/dcloudio/hello-uniapp)获取</em></br>
        <em>快应用仅支持 vivo 、oppo、华为</em></br>
        <em>360小程序仅 windows平台支持，需要在360浏览器中打开</em></br>
    </p>
</div>

`uni-app`官网文档详见[https://uniapp.dcloud.io](https://uniapp.dcloud.io)

更多uni-app的模板、示例详见[插件市场](https://ext.dcloud.net.cn/)

