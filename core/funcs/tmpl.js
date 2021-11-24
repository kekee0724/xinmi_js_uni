/*
 * @Author: 可可同学
 * @Date: 2021-11-22 10:28:21
 * @LastEditTime: 2021-11-22 14:35:03
 * @LastEditors: 可可同学
 * @Description: 
 */
const FIELDS_REGEXP = /\${\s*?(\w+(?:\.\w+)*)\s*?}/g,
  FIELD_REGEXP = /(\w+)(?:\.(\w+(?:\.\w+)*))*/;

export function tmpl(tmpl, data, cache = {}, fieldCache = {}) {
  return tmpl.replace(FIELDS_REGEXP, function (_m1, m2) {
    return m2 && data && fieldCache.hasOwnProperty(m2)
      ? fieldCache[m2]
      : (fieldCache[m2] =
          (cache.hasOwnProperty(m2) ? cache[m2] : (cache[m2] = fnParse(m2)))(
            data
          ) || "");
  });
}

function fnParse(format) {
  if (format) {
    format = FIELD_REGEXP.exec(format);

    const prefix = format[1],
      fn = fnParse(format[2]);

    return (context) =>
      (context = context[prefix]) !== undefined && fn ? fn(context) : context;
  }
}
