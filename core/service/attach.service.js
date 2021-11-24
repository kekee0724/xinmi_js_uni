/*
 * @Author: 可可同学
 * @Date: 2021-11-22 10:28:21
 * @LastEditTime: 2021-11-22 17:48:13
 * @LastEditors: 可可同学
 * @Description: 
 */
const { resolveService } = require("../funcs/resolve.service"); // require("../funcs/index");
const { HttpService } = require("./core.service");

export class AttachService extends HttpService {
    guid;

    constructor(controllerName = "attach/index") {
        super(controllerName);

        this.guid = guid();
    }

    getUploadChunkUrl(uploadId) {
        return this.getRootUrl(this.transformUrl(this.resolveUrl("upload-chunk", uploadId)));
    }

    getPreviewUrl(id, uploadId, options) {
        return this.httpGet(this.resolveUrl("preview-url", id), this.resolveRequestParams({ uploadId }, options));
    }

    downloadFile(uploadId, id, options) {
        return this.httpGetDownload(this.resolveUrl("download", id), this.resolveRequestParams({ uploadId }, options));
    }
}

export const attachService = resolveService(AttachService);

function guid() {
    let counter = 0;

    return (prefix) => {
        let uid = (+new Date()).toString(32),
            i = 0;

        for (; i < 5; i++) {
            uid += Math.floor(Math.random() * 65535).toString(32);
        }

        return (prefix || "wu_") + uid + (counter++).toString(32);
    };
}
