const moment = require("./moment");

export function getDate(date, def) {
  return date instanceof Date
    ? date
    : date
    ? new Date(date.replace(/\-/g, "/").replace(/T/g, " ").substr(0, 19))
    : def;
}

export function formatNow(fmt = "yyyy-MM-dd") {
  return formatDate(new Date(), fmt);
}

export function formatDateTime(date, fmt = "yyyy-MM-dd hh:mm:ss") {
  return formatDate(date, fmt);
}

// 只用于发送数据格式化数据
export function formatDateTimeSend(date, fmt = "yyyy-MM-ddThh:mm:ss") {
  return formatDate(date, fmt);
}

export function formatDate(date, fmt = "yyyy-MM-dd") {
  const value = getDate(date);

  return value ? format(value, fmt) : date;
}
/**
 * 获取当前日期N天后日期
 * @param days GetDateStr
 */
export function getDateStr(days, fmt = "yyyy-MM-dd") {
  return formatDate(moment().add(days, "days").toDate(), fmt);
}

/**
 * 获取指定日期N天后日期
 * @param days GetDateStr
 */
export function getSetDateStr(date, days, fmt = "yyyy-MM-dd") {
  return formatDate(moment(getDate(date)).add(days, "days").toDate(), fmt);
}

export function formatDates(fmt = "yyyy-MM-dd") {
  return (date) => formatDate(date, fmt);
}

export function formatDateTimes(fmt = "yyyy-MM-dd hh:mm:ss") {
  return (date) => formatDate(date, fmt);
}

export function format(data, fmt) {
  const o = {
    "M+": data.getMonth() + 1, // 月份
    "d+": data.getDate(), // 日
    "h+": data.getHours(), // 小时
    "m+": data.getMinutes(), // 分
    "s+": data.getSeconds(), // 秒
    "q+": Math.floor((data.getMonth() + 3) / 3), // 季度
    S: data.getMilliseconds(), // 毫秒
  };

  if (/(y+)/.test(fmt))
    fmt = fmt.replace(
      RegExp.$1,
      (data.getFullYear() + "").substr(4 - RegExp.$1.length)
    );

  for (const k in o)
    if (new RegExp("(" + k + ")").test(fmt))
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)
      );

  return fmt;
}

Date.prototype.format = format;

export function formatTime(date, fmt = "hh:mm") {
  return formatDate(date, fmt);
}

/**
 * 判断周几
 */
export function getWeekStr(date, days) {
  let week = moment(getDate(date)).add(days, "days").day();
  let str;
  if (week === 0) {
    str = "周日";
  } else if (week === 1) {
    str = "周一";
  } else if (week === 2) {
    str = "周二";
  } else if (week === 3) {
    str = "周三";
  } else if (week === 4) {
    str = "周四";
  } else if (week === 5) {
    str = "周五";
  } else if (week === 6) {
    str = "周六";
  }
  return str;
}
