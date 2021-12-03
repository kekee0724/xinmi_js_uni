/*
 * @Author: 可可同学
 * @Date: 2021-11-22 10:28:21
 * @LastEditTime: 2021-11-22 17:56:05
 * @LastEditors: 可可同学
 * @Description: 
 */
const { resolveService } = require("../funcs/resolve.service"); // require("../funcs/index");
const { AttachService } = require("./attach.service");


export class PictureService extends AttachService {
    constructor(controllerName = "attach/picture") {
        super(controllerName);
    }
    
    getPictureUrls(data) {
        return this.httpGet(this.resolveUrl("urls"), this.resolveRequestParams(data));
    }

    getPictureUrl(data) {
        return this.httpGet(this.resolveUrl("url"), this.resolveRequestParams(data));
    }

    getPictureList(data) {
        return this.httpGet(this.resolveUrl("list"), this.resolveRequestParams(data));
    }

    getEditorUploadUrl() {
        return this.getRootUrl(this.transformUrl("upload-img"));
    }
}

export const pictureService = resolveService(PictureService);
