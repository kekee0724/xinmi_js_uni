/*
 * @Author: 可可同学
 * @Date: 2021-12-02 16:14:31
 * @LastEditTime: 2021-12-02 16:18:43
 * @LastEditors: 可可同学
 * @Description: 
 */
const { resolveService } = require("../../../core/funcs/resolve.service"); // require("../funcs/index");
const { HttpService } = require("../../../core/service/core.service");

export class LocationHttpService extends HttpService {
  constructor() {
    super("location");
  }

  /**
   * 产业资源-产业园区-获取详情
   * @param data
   */
  resourcePark(data) {
    return this.httpGet(`resource-park/${data.baseId}`);
  }

  /**
   * 产业资源-招商地块-获取详情
   * @param data
   */
  resourceLand(data) {
    return this.httpGet(`resource-land/${data.baseId}`);
  }

  /**
   * 产业资源-办公楼宇-获取详情
   * @param data
   */
  resourceBuilding(data) {
    return this.httpGet(`resource-building/${data.baseId}`);
  }

  /**
   * 产业资源-标准厂房/仓库-获取详情
   * @param data
   */
  resourceFactory(data) {
    return this.httpGet(`resource-factory/${data.baseId}`);
  }

  /**
   * 产业资源-创新服务资源-获取详情
   * @param data
   */
  resourceService(data) {
    return this.httpGet(`resource-service/${data.baseId}`);
  }

  /**
   * 产业资源-生产生活资源-获取详情
   * @param data
   */
  resourceLife(data) {
    return this.httpGet(`resource-life/${data.baseId}`);
  }
}

export const LocationService = resolveService(LocationHttpService);
