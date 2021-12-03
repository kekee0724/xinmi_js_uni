/*
 * @Author: 可可同学
 * @Date: 2021-11-22 10:28:21
 * @LastEditTime: 2021-11-22 11:35:59
 * @LastEditors: 可可同学
 * @Description: 
 */
export const Type = Function;

export function isType(v){
    return typeof v === "function";
}