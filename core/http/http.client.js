const { getApiUrl } = require("../funcs/transform.url");
const { HttpRequest } = require("./http.request");
const { httpRequest } = require("./http.network");
const { verifyAuth, refreshTokens } = require("./auth");
const {
  logout,
  logoutAndJump,
  refreshSystemToken,
  refreshUID,
  cycleRefreshToken,
  getCurrentToken,
} = require("./token");

function addBody(options, data) {
  return Object.assign(Object.assign({}, options), { data });
}
class HttpClient {
  constructor() {
    this.logout = logout;
    this.logoutAndJump = logoutAndJump;
    this.authProvider = {
      refreshToken: refreshSystemToken,
      refreshUID: refreshUID,
      getCurrentToken: getCurrentToken,
    };
  }
  transformUrl(url = "") {
    return /^\s?(https?:)?\/\//i.test(url) ? url : `${getApiUrl()}${url}`;
  }
  request(first, url, options = {}) {
    return verifyAuth(options.allowAnonymous).then(
      (verify) =>
        verify
          ? this.handleRequest(first, url, options)
          : Promise.reject({ status: 408, errmsg: "会话超时，请重新登录.。" }),
      (error) =>
        Promise.reject({
          status: 401,
          errmsg: "会话超时，请重新登录..。",
          error,
        })
    );
  }
  delete(url, options = {}) {
    return this.request("DELETE", url, options);
  }
  get(url, options = {}) {
    return this.request("GET", url, options);
  }
  head(url, options = {}) {
    return this.request("HEAD", url, options);
  }
  options(url, options = {}) {
    return this.request("OPTIONS", url, options);
  }
  patch(url, body, options = {}) {
    return this.request("PATCH", url, addBody(options, body));
  }
  post(url, body, options = {}) {
    return this.request("POST", url, addBody(options, body));
  }
  put(url, body, options = {}) {
    return this.request("PUT", url, addBody(options, body));
  }
  
  handleRequest(first, url, options = {}) {
    const req = this.transformRequest(first, url, options);
    cycleRefreshToken();
    return this.transformResponse(first, req, httpRequest(req)).then(
      null,
      (error) => this.handleResponseError(error, first, req)
    );
  }

  handleResponseError(error, first, req) {
    return new Promise((resolve, reject) => {
      const { headers } = req.options;
      if (
        !req.options.allowAnonymous &&
        !(headers && headers.Authorization) &&
        (error.status === 401 ||
          error.status === 405 ||
          error.errcode === "USERNAME_NOT_FOUND" ||
          error.errcode === "ACCESS_DENIED")
      ) {
        this.retryRequest(first, req).then(resolve, reject);
      } else {
        reject(error);
      }
    });
  }

  retryRequest(first, req) {
    return refreshTokens().then(() =>
      this.transformResponse(first, req, httpRequest(req))
    );
  }

  transformRequestInfo(first, url, options = {}) {
    return new HttpRequest(
      this.transformUrl(url),
      ((options.method = first), options)
    );
  }

  transformRequest(first, url, options = {}) {
    return first instanceof HttpRequest
      ? ((first.urls = this.transformUrl(first.url)), first)
      : this.transformRequestInfo(first, url, options);
  }

  transformResponse(first, req, events$) {
    if (first instanceof HttpRequest || req.options.observe === "events") {
      return events$;
    }
    switch (req.options.observe || "body") {
      case "body":
        switch (req.responseType) {
          case "arraybuffer":
            return events$.then((res) => res.arrayBuffer());
          case "blob":
            return events$.then((res) => res.blob());
          case "text":
            return events$.then((res) => res.text());
          case "json":
          default:
            return events$.then((res) => {
              const status = res && (res.statusCode || res.status);
              return !status || status === 204
                ? void 0
                : Promise[status >= 200 && status < 300 ? "resolve" : "reject"](
                    res.data
                  );
            });
        }
      case "response":
        return events$;
      default:
        throw new Error(
          `Unreachable: unhandled observe type ${req.options.observe}}`
        );
    }
  }
}
exports.HttpClient = HttpClient;
