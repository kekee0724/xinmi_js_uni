/*
 * @Author: 可可同学
 * @Date: 2021-11-22 10:28:22
 * @LastEditTime: 2021-11-22 17:53:29
 * @LastEditors: 可可同学
 * @Description: 
 */
const { resolveService } = require("../funcs/resolve.service"); // require("../funcs/index");
const { HttpService } = require("./core.service");

export class TagHttpService extends HttpService {
  constructor() {
      super("tag/tag");
  }

  getTagByTagClass(data) {
      return this.httpGet("by-tagclass", this.resolveRequestParams(data));
  }
  getTagByTagClasses(data) {
      return this.httpGet("by-tagclasses", this.resolveRequestParams(data));
  }
}

export const tagService = resolveService(TagHttpService);
