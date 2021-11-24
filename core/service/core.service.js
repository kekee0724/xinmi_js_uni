/*
 * @Author: 可可同学
 * @Date: 2021-11-22 10:28:21
 * @LastEditTime: 2021-11-22 18:13:15
 * @LastEditors: 可可同学
 * @Description:
 */
import { BaseHttpService } from "../http/http.service";

export class HttpService extends BaseHttpService {
  get(id, options) {
    return this.httpGet(this.resolveUrl(id), options);
  }

  getList(data, options) {
    return this.httpGet(
      this.resolveUrl("list"),
      this.resolveRequestParams(data, options)
    );
  }

  getPaged(data, options) {
    return this.httpGet(
      this.resolveUrl(""),
      this.resolveRequestParams(data, options)
    );
  }

  post(data, options) {
    return this.httpPost(this.resolveUrl(""), data, options);
  }

  put(id, data, options) {
    return this.httpPut(this.resolveUrl(id), data, options);
  }

  delete(id, options) {
    return this.httpDelete(this.resolveUrl(id), options);
  }

  batchdelete(data, options) {
    return this.httpPut(this.resolveUrl("batch-delete"), data, options);
  }

  valid(id, isValid, options) {
    return this.httpPut(
      this.resolveUrl("valid", id),
      null,
      this.resolveRequestParams(
        { isValid },
        this.resolveRequestContentType(undefined, options)
      )
    );
  }

  sequence(data, options) {
    return this.httpPut(this.resolveUrl("sequence"), data, options);
  }

  enabled(id, options) {
    return this.httpPut(this.resolveUrl("enabled", id), null, options);
  }

  disabled(id, options) {
    return this.httpPut(this.resolveUrl("disabled", id), null, options);
  }

  publish(id, options) {
    return this.httpPut(this.resolveUrl("publish", id), null, options);
  }

  batchEnabled(id, options) {
    return this.httpPut(this.resolveUrl("batch-enabled"), id, options);
  }

  batchDisabled(id, options) {
    return this.httpPut(this.resolveUrl("batch-disabled"), id, options);
  }

  batchPublish(id, options) {
    return this.httpPut(this.resolveUrl("batch-publish"), id, options);
  }
}
