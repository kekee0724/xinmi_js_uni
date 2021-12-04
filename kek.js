/*
 * @Author: 可可同学
 * @Date: 2021-12-04 20:19:00
 * @LastEditTime: 2021-12-04 20:48:13
 * @LastEditors: 可可同学
 * @Description: 
 */
"use strict";
// exports.util = exports.app = exports.wxpay = exports.TOOLS = exports.address_parse = exports.AUTH = exports.CONFIG = exports.WXAPI = void 0;
// require("./reco.config");
exports.WXAPI = require("./static/js/apifm-wxapi/index");
exports.CONFIG = require("./config");
exports.AUTH = require("./static/js/auth");
// exports.address_parse = require("./utils/address_parse");
// exports.TOOLS = require("./utils/tools");
// exports.wxpay = require("./utils/pay");
exports.app = getApp();
// exports.util = require("./utils/time");