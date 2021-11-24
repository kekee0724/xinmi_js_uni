/*
 * @Author: 可可同学
 * @Date: 2021-11-22 10:28:21
 * @LastEditTime: 2021-11-22 13:57:42
 * @LastEditors: 可可同学
 * @Description: 
 */
export function htmlInjectEncode(html, tagExp = /<\/?(iframe|script|link|style|frameset|frame)\b[^>]*?>/gi) {
    return html && html.replace(tagExp, d => `&lt;${d.substr(1, d.length - 2)}&gt;`);
}

export function htmlInjectDecode(html, tagExp = /&lt;\/?(iframe|script|link|style|frameset|frame)\b.*?&gt;/gi) {
    return html && html.replace(tagExp, d => `<${d.substr(4, d.length - 8)}>`);
}

export function removeHtmlTag(html, tagExp = /<\/?[^>]*?>/g) {
    return html && html.replace(tagExp, "");
}

export function htmlEncode(html, tagExp = /<\/?[^>]*?>/g) {
    return html && html.replace(tagExp, d => `&lt;${d.substr(1, d.length - 2)}&gt;`);
}

export function htmlDecode(html, tagExp = /&lt;\/?.*?&gt;/g) {
    return html && html.replace(tagExp, d => `<${d.substr(4, d.length - 8)}>`);
}
