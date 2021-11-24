/*
 * @Author: 可可同学
 * @Date: 2021-11-19 14:57:08
 * @LastEditTime: 2021-11-23 17:47:33
 * @LastEditors: 可可同学
 * @Description: 
 */
const { getCurrentUserStorage } = require("../funcs/current-user.storage");
const { getCurrentToken } = require("./token");
const { urlEncodeParams, resolveUrl } = require("./utils");

export class HttpRequest {
    constructor(url, options = {}) {
        this.url = url;
        this.responseType = 'json';
        this.responseType = options.responseType || this.responseType;
        this.options = options;
    }

    get request() {
        const { headers: rawHeaders, data, params } = this.options;
        const header = this.getHeaders(rawHeaders);
        return Object.assign(Object.assign({}, this.options), {
            url: resolveUrl(this.url, this.getUrlEncodeParams(params)),
            data,
            header
        });
    }

    getUrlEncodeParams(params) {
        return typeof params === 'object' ? urlEncodeParams(params) : params;
    }

    getHeaders(headers) {
        headers = this.attachAuthorization(
            Object.assign(
                {
                    Accept: 'application/json, text/plain, */*',
                    'Content-Type': 'application/json; charset=utf-8'
                },
                headers
            )
        );
        this.attachUnitId(headers);
        this.attachParkId(headers);
        return headers;
    }

    attachAuthorization(headers) {
        const { allowAnonymous } = this.options;

        if (!allowAnonymous && !headers.Authorization) {
            const authorization = getCurrentToken();

            if (authorization) {
                headers.Authorization = authorization;
            }
        }

        return headers;
    }

    attachUnitId(headers) {
        const { unitId = getCurrentUserStorage('unitId') } = this.options;
        delete headers.unitId;

        if (unitId) {
            headers.unitId = unitId;
        }
    }

    attachParkId(headers) {
        const { parkId = getCurrentUserStorage('parkId') } = this.options;
        delete headers.parkId;

        if (parkId) {
            headers.parkId = parkId;
        }
    }

    clone() {
        return new HttpRequest(this.url, this.options);
    }
}

exports.HttpRequest = HttpRequest;
