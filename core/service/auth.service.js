/*
 * @Author: 可可同学
 * @Date: 2021-11-22 10:28:21
 * @LastEditTime: 2021-11-23 09:37:40
 * @LastEditors: 可可同学
 * @Description: 
 */
const { isAnonymous } = require("../http/auth");
const { resolveService } = require("../funcs/resolve.service");
const { HttpService } = require("./core.service");

export class AuthHttpService extends HttpService {
  currentUserPromise;

  constructor() {
    super("authorization/oauth2");
  }

  getCurrentUser(data) {
    if (!isAnonymous()) {
      this.currentUserPromise ||
        (this.currentUserPromise = this.httpGet(
          "current-user",
          this.resolveRequestParams(data)
        ));
    }

    return this.currentUserPromise || Promise.resolve({});
  }

  clearCurrentUser() {
    delete this.currentUserPromise;
  }

  refreshCurrentUser(data) {
    return this.clearCurrentUser(), this.getCurrentUser(data);
  }

  logout() {
    this.clearCurrentUser();

    return this.http.logout();
  }
}

export const authService = resolveService(AuthHttpService);
