/*
 * @Author: 可可同学
 * @Date: 2021-12-02 17:56:59
 * @LastEditTime: 2021-12-02 18:09:42
 * @LastEditors: 可可同学
 * @Description: 
 */
const { resolveService } = require("../../../core/funcs/resolve.service"); // require("../funcs/index");
const { HttpService } = require("../../../core/service/core.service");

/**
 * 咨询工单接口管理
 */
export class ConsultOrderHttpService extends HttpService {
  constructor() {
    super("bussinessopp/consult-order");
  }

  /**
   * 获取短信验证码
   * @param data
   */
  getCode(data) {
    return this.httpGet("code", this.resolveRequestParams(data));
  }
}
export const consultOrderService = resolveService(ConsultOrderHttpService);
