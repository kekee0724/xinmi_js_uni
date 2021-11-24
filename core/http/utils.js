/*
 * @Author: 可可同学
 * @Date: 2021-11-22 10:28:21
 * @LastEditTime: 2021-11-22 17:07:34
 * @LastEditors: 可可同学
 * @Description: 
 */
const { URLSearchParams } = require('./URLSearchParams');

export function urlEncodeParams(params) {
  const searchParams = new URLSearchParams();

  Object.keys(params).forEach((key) => {
    const value = params[key];
    if (value && Array.isArray(value)) {
      value.forEach((element) => searchParams.append(key, element.toString()));
    } else if (value !== null && value !== undefined) {
      searchParams.append(key, value.toString());
    }
  });

  return searchParams;
}

export function resolveUrl(url = "", params = "") {
  const urls = url.split("?");

  if (urls.length > 1) params = urls[1] + params;

  return urls[0] + (params ? "?" : "") + params;
}

export function formatUrlParam(params) {
  return typeof params === "object" ? urlEncodeParams(params) : new URLSearchParams(params);
}

export function formatUrlParams(options) {
  if (!options || !options.params) return "";

  const params = formatUrlParam(options.params).toString();

  delete options.params;

  return params;
}
// const appData = getApp()

export function onLine() {
  return navigator && "onLine" in navigator ? navigator.onLine : !0;
}
