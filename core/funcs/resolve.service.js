/*
 * @Author: 可可同学
 * @Date: 2021-11-22 10:28:21
 * @LastEditTime: 2021-11-22 14:27:32
 * @LastEditors: 可可同学
 * @Description: 
 */
const { HttpService } = require("../service/core.service");

const ignoreNames = [
    "constructor",
    "http",
    "controllerName",
    "httpRequest",
    "httpGet",
    "httpPost",
    "httpPut",
    "httpDelete",
    "httpPatch",
    "httpHead",
    "httpOptions",
    "httpUpload",
    "transformRequestUrl",
    "resolveRequestContentType",
    "resolveRequestHeaders",
    "resolveRequestParams",
    "resolveUrl",
    "transformUrl",
    "getRootUrl",
  ],
  container = new Map();

function traversal(proto, thisArg) {
  if (!proto) return;

  proto.constructor === HttpService || traversal(proto.__proto__, thisArg);

  Object.getOwnPropertyNames(proto).forEach((key) => {
    if (ignoreNames.some((d) => d === key)) return;

    const prop = thisArg[key];

    if (typeof prop === "function") thisArg[key] = prop.bind(thisArg);
  });
}

export function resolveService(service) {
  let instance = container.get(service);

  if (!instance) {
    instance = new service();

    traversal(instance, instance);

    container.set(service, instance);
  }

  return instance;
}
