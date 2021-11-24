const { HttpClient } = require("./http.client");
const { HttpRequest } = require("./http.request");

export class BaseHttpService {
  static http;

  http;

  constructor(controllerName, http) {
    this.controllerName = controllerName;
    this.http = http
      ? (BaseHttpService.http = http)
      : BaseHttpService.http || (BaseHttpService.http = new HttpClient());
  }

  httpGet(url, options) {
    return this.http.get(this.transformUrl(url), options);
  }

  httpPost(url, body = null, options) {
    return this.http.post(this.transformUrl(url), body, options);
  }

  httpPut(url, body = null, options) {
    return this.http.put(this.transformUrl(url), body, options);
  }

  httpDelete(url, options) {
    return this.http.delete(this.transformUrl(url), options);
  }

  httpPatch(url, body = null, options) {
    return this.http.patch(this.transformUrl(url), body, options);
  }

  httpHead(url, options) {
    return this.http.head(this.transformUrl(url), options);
  }

  httpOptions(url, options) {
    return this.http.options(this.transformUrl(url), options);
  }

  httpUpload(url, data, options) {
    return this.httpPost(url, data, this.resolveRequestHeaders({}, options));
  }

  /**
   * 文件下载
   * @param url 下载地址
   * @param  filename 文件名
   * @param  options 配置项
   * @return  响应等待对象
   */
  httpGetDownload(url, options, filename) {
    return this.http
      .get(this.transformUrl(url), { observe: "response", ...options })
      .then(downloadFile.bind(this, filename));
  }

  /**
   * 文件下载
   * @param  url 下载地址
   * @param  body 数据
   * @param  filename 文件名
   * @param  options 配置项
   * @return  响应等待对象
   */
  httpPostDownload(url, body = null, options, filename) {
    return this.http
      .post(this.transformUrl(url), body, { observe: "response", ...options })
      .then(downloadFile.bind(this, filename));
  }

  transformRequestUrl(url) {
    if (url instanceof HttpRequest) {
      url.urls = this.transformUrl(url.url);

      return url;
    }

    return this.transformUrl(url);
  }

  resolveRequestContentType(
    contentType = "application/json;charset=UTF-8",
    options
  ) {
    return this.resolveRequestHeaders({ "Content-Type": contentType }, options);
  }

  resolveRequestHeaders(headers, options = {}) {
    return { ...options, headers: { ...options.headers, ...headers } };
  }

  resolveRequestParams(params, options = {}) {
    return { ...options, params: { ...options.params, ...params } };
  }

  resolveUrl(...args) {
    return args.join("/");
  }

  transformUrl(url = "") {
    return this.controllerName + "/" + url;
  }

  getRootUrl(url = "") {
    return this.http.transformUrl(url);
  }
}

/**
 * 文件下载
 * @param  filename 文件名
 * @param  response 接口响应对象
 */
function downloadFile(filename, response) {
  if (
    filename &&
    (filename = response.headers.get("Content-Disposition")) &&
    (filename = filename.match(/(filename)=(.*);\s?(?:\1\*=UTF-8''(.*))?$/i))
  ) {
    filename = decodeURIComponent(filename[3] || filename[2]);
  }

  filename = filename || "文件下载";

  response.blob().then((blob) => {
    if ("msSaveOrOpenBlob" in window.navigator) {
      window.navigator.msSaveOrOpenBlob(blob, filename);
    } else {
      const a = document.createElement("a"),
        url = window.URL.createObjectURL(blob);

      a.href = url;
      a.download = filename;
      a.type = response.headers.get("Content-Type");

      a.click();

      window.URL.revokeObjectURL(url);
    }
  });
}
