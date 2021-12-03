/*
 * @Author: 可可同学
 * @Date: 2021-11-22 10:28:21
 * @LastEditTime: 2021-11-22 17:25:49
 * @LastEditors: 可可同学
 * @Description: 
 */
require("./type");
require("./URLSearchParams");
require("./utils");
require("./token");
export const { HttpRequest }= require("./http.request");
export const{ HttpClient }= require("./http.client");
export const { BaseHttpService }= require("./http.service");
export const{ isAnonymous, isAuth }= require("./auth");