/*
 * @Author: 可可同学
 * @Date: 2021-11-22 10:28:21
 * @LastEditTime: 2021-11-22 13:56:41
 * @LastEditors: 可可同学
 * @Description: 
 */
const { getDate, format } = require("./formatTime");

function getTime(date) {
  return typeof date === "number" ? date : getDate(date).getTime();
}

const preMinute = 1000 * 60,
  preHour = preMinute * 60,
  preDay = preHour * 24;

export function friendlyTime(startDate, endDate) {
  if (!startDate) return "";

  const dates = getDate(startDate),
    start = getTime(dates),
    end = getTime(endDate || Date.now());

  if (isNaN(start)) return startDate;

  const det = end - start;

  if (det < preMinute) return "刚刚";
  else if (det < preHour) return Math.round(det / preMinute) + "分钟前";
  else if (det < preDay) return Math.round(det / preHour) + "小时前";
  else if (det < preDay * 7) return Math.round(det / preDay) + "天前";
  else if (dates.getFullYear() !== new Date().getFullYear())
    return format(dates, "yyyy-MM-dd hh:mm");
  else return format(dates, "MM-dd hh:mm");
}
