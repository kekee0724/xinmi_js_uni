/*
 * @Author: 可可同学
 * @Date: 2021-11-22 10:28:21
 * @LastEditTime: 2021-11-23 17:35:53
 * @LastEditors: 可可同学
 * @Description:
 */
const { getObjectProp } = require("../funcs/get.object.prop");
// const { HttpRequest } = require("./http.request");
const { onLine } = require("./utils");

let timeout = getObjectProp(uni.client, "http.timeout", 90000),
  disableTimeout = getObjectProp(uni.client, "http.disableTimeout", 1);

if (navigator && navigator.connection) {
  const times = { "2g": 18000, "3g": 12000 };

  navigator.connection.onchange = ({ target = { effectiveType: "4g" } }) => {
    timeout = times[target.effectiveType] || 90000;
  };
}

export function httpRequest(input) {
  return new Promise((resolve, reject) => {
    if (onLine()) {
      const options = input.options,
        time =
          options.disableTimeout || disableTimeout
            ? 0
            : setTimeout(() => {
                const msg = {
                  status: 408,
                  errmsg: "服务器繁忙，请稍后重试。",
                  input,
                };

                task.abort();

                reject(msg);
              }, getObjectProp(options, "timeout", timeout));

      const task = uni.request({
        ...input.request,
        success(result) {
          clearTimeout(time);
          if (result.statusCode === 204) {
            resolve(null);
          } else {
            resolve(result);
          }
        },
        fail(result) {
          clearTimeout(time);
          if (
            result.errMsg &&
            result.errMsg.indexOf("request:fail Failed to execute 'send") == -1
          ) {
            reject({
              status: -1,
              errmsg: "网络无法连接，请检查网络连接是否正常。",
            });
          } else {
            reject(result);
          }
        },
      });
    } else {
      reject({
        status: -1,
        errmsg: "网络无法连接，请检查网络连接是否正常。",
      });
    }
  });
}
