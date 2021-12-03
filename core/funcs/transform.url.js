/*
 * @Author: 可可同学
 * @Date: 2021-11-22 10:28:21
 * @LastEditTime: 2021-11-22 14:35:54
 * @LastEditors: 可可同学
 * @Description: 
 */
function transform(url) {
    if (url && url.charAt(0) === "~") {
        return ((url = url.substr(2)), `${getApiUrl()}${url}`)
    } else if (url && url.charAt(0) === "/") {
        return 'http:' + url
    }
    return url;
}

export function getApiUrl() {
    return uni.server.url || "";
}

export function transformUrl(url, def) {
    return url && (transform(url) || transform(def));
}

const v = 2;

export function transformImageUrl(url, width, height, def) {
    return url && `${transformAssetsUrl(url, def)}?width=${width * v}&height=${height * v}`;
}

function transformAssets(url) {
    if (url && url.charAt(0) === "~") {
        return ((url = url.substr(2)), `${getAssetsUrl()}${url}`)
    } else if (url && url.charAt(0) === "/") {
        return 'http:' + url
    }
    return url;
}

export function getAssetsUrl() {
    return uni.server.assetsUrl || getApiUrl();
}

export function transformAssetsUrl(url, def) {
    return url && (transformAssets(url) || transformAssets(def));
}

export function connectlocalUrl(url) {
    return uni.server.localImageUrl + url;
}
