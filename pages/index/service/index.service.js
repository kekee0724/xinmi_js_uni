/*
 * @Author: 可可同学
 * @Date: 2021-11-22 10:48:49
 * @LastEditTime: 2021-11-22 18:08:02
 * @LastEditors: 可可同学
 * @Description:
 */
const { resolveService } = require("../../../core/funcs/resolve.service"); // require("../funcs/index");
const { HttpService } = require("../../../core/service/core.service");

export class IndustrialMapHttpService extends HttpService {
  constructor() {
    super("location/industrial-map");
  }

  /**
   * 项目选址-生产生活资源查询
   * @param data
   */
  lifeResourcePage(data) {
    return this.httpGet("life-resource-page", this.resolveRequestParams(data));
  }

  /**
   * 一级空间区域信息查询
   * @param data
   */
  oneRegion(data) {
    return this.httpGet("one-region", this.resolveRequestParams(data));
  }

  /**
   * 次级空间区域信息查询
   * @param data
   */
  lowRegion(data) {
    return this.httpGet(`low-region/${data.resourceId}`);
  }

  /**
   * 项目选址-创新服务资源查询
   * @param data
   */
  serviceResourcePage(data) {
    return this.httpGet(`service-resource-page/${data.resourceId}`);
  }

  /**
   * 项目选址-空间资源查询
   * @param data
   */
  spaceResourcePage(data) {
    return this.httpGet(`space-resource-page`, this.resolveRequestParams(data));
  }

  /**
   * 项目选址-资源类型数量统计
   * @param data
   */
  resourceTypeCount(data) {
    return this.httpGet(`resource-type-count`, this.resolveRequestParams(data));
  }

  /**
   * 项目选址-各个标签的资源数量统计
   * @param data
   */
  getTagByTagClasses(data) {
    return this.httpGet(`resource-tag-count`, this.resolveRequestParams(data));
  }

  /**
   * 项目选址-各个区域的资源数量
   * @param data
   */
  resourceRegionCount(data) {
    return this.httpGet(
      `resource-region-count`,
      this.resolveRequestParams(data)
    );
  }
}
export const industrialMapHttpService = resolveService(
  IndustrialMapHttpService
);

export class ImportantIndustryHttpService extends HttpService {
  constructor() {
    super("location/important-industry");
  }

  /**
   * 重点产业-查询该区域关联的重点产业标签
   * @param data
   */
  listbyRegion(data) {
    return this.httpGet(`list-by-region/${data.regionName}`);
  }
}
export const importantIndustryHttpService = resolveService(
  ImportantIndustryHttpService
);

export class ResourceRegionHttpService extends HttpService {
  constructor() {
    super("location/resource-region");
  }
}
export const resourceRegionHttpService = resolveService(
  ResourceRegionHttpService
);
