const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
})
// 云函数入口函数
exports.main = async (event, context) => {
  try {
    const result = await cloud.openapi.wxacode.createQRCode({
      "path": 'xinmi/second/second?markerId=' + event.markerId,
      "width": 430
    })
    return result
  } catch (err) {
    return err
  }
}