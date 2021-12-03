export const client = (uni.client = { ...uni.client })

export const server = (uni.server = {
  apiKey: {
    apiKey: "Bitech\\H5",
    secret: "vgkEeveppBwCzPHr",
  },
  userMobile: {
    aboutUsMobile: "021-23231080",
    adminPhone: "18002332204",
  },
  auth: {
    oauth2Url: "authorization/oauth2",
    autoLogin: !0,
    autoRefreshToken: !0,
    anonymousLogin: !0,
  },
  appid: "wx175c7968011765d4",
  localImageUrl: "http://dev.bitechdevelop.com/reco.asset/assets/images/wechat/",
  assetsUrl: "https://fat.bitechdevelop.com/xinmi-ieb-mobileapi/",
  url: "https://fat.bitechdevelop.com/xinmi-ieb-mobileapi/",
  ...uni.server
})


