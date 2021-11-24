/*
 * @Author: 可可同学
 * @Date: 2021-11-22 10:28:21
 * @LastEditTime: 2021-11-22 13:38:03
 * @LastEditors: 可可同学
 * @Description: 
 */
/**
 * 组合函数
 * @param funcs 需要组合的函数
 * @returns 组合后的函数
 */
export function composeFuncs(...funcs) {
  return (...args) => {
    return funcs.map((func) => func(...args));
  };
}
