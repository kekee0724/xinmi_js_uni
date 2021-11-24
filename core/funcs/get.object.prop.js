/*
 * @Author: 可可同学
 * @Date: 2021-11-22 10:28:21
 * @LastEditTime: 2021-11-22 18:22:56
 * @LastEditors: 可可同学
 * @Description: 
 */
const { get } = require("./lodash");

export function getObjectProp(obj, path, value) {
  return get(obj, path, value);
}
