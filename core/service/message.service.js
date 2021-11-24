/*
 * @Author: 可可同学
 * @Date: 2021-11-22 10:28:22
 * @LastEditTime: 2021-11-22 17:54:07
 * @LastEditors: 可可同学
 * @Description: 
 */
const { resolveService } = require("../funcs/resolve.service"); // require("../funcs/index");
const { HttpService } = require("./core.service");

export class NotificationService extends HttpService {
  constructor() {
    super("notification/notification");
  }

  getScene(data) {
    return this.httpGet("scene", this.resolveRequestParams(data));
  }

  /**
   * 阅读消息
   */
  readNotification(data) {
    return this.httpPost("read?deliveryId=" + data);
  }

  /**
   * 阅读消息
   */
  readAllNotification(data) {
    return this.httpPost(
      "read-all?notificationType=" +
        data.notificationType +
        "&sceneId=" +
        data.sceneId
    );
  }

  deleteNotification(id) {
    return this.httpDelete(`${id}`);
  }
}
export const notificationService = resolveService(NotificationService);
export class NotificationSceneService extends HttpService {
  constructor() {
    super("notification/scene");
  }

  getAllScene(data) {
    return this.httpGet("list", this.resolveRequestParams(data));
  }
  getTakeScene(productCode) {
    return this.httpGet("list/" + productCode);
  }
  takeScene(data) {
    return this.httpPost("take", data);
  }
  cancelTake(data) {
    return this.httpPost("cancel-take", data);
  }
}

export const notificationSceneService = resolveService(
  NotificationSceneService
);
