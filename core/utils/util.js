/*
 * @Author: 可可同学
 * @Date: 2021-11-22 10:28:21
 * @LastEditTime: 2021-11-22 14:31:17
 * @LastEditors: 可可同学
 * @Description:
 */
// export const formatTime = (date: Date) => {
//   const year = date.getFullYear()
//   const month = date.getMonth() + 1
//   const day = date.getDate()
//   const hour = date.getHours()
//   const minute = date.getMinutes()
//   const second = date.getSeconds()

//   return (
//     [year, month, day].map(formatNumber).join('/') +
//     ' ' +
//     [hour, minute, second].map(formatNumber).join(':')
//   )
// }

// const formatNumber = (n: number) => {
//   const s = n.toString()
//   return s[1] ? s : '0' + s
// }

export function removeFromArr(arr, item) {
  const newArr = arr.filter((itm) => {
    return itm != item;
  });

  return newArr;
}

// 深度拷贝
export function deepClone(obj) {
  if (!obj) return obj;
  let _obj = JSON.stringify(obj);
  return JSON.parse(_obj);
}
