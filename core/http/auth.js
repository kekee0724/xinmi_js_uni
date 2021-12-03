/*
 * @Author: 可可同学
 * @Date: 2021-11-22 10:28:21
 * @LastEditTime: 2021-11-22 17:03:15
 * @LastEditors: 可可同学
 * @Description: 
 */
const { isAllowAnonymous, getLocalToken, verifyUID, refreshAnonymousToken, refreshToken, autoLogin, getCurrentToken, logged } = require("./token");

let refreshPromise, loginPromise, anonymousPromise;

export function isAnonymous() {
  return !getLocalToken();
}

export function isAuth() {
  return !!getLocalToken() || verifyUID();
}

if (isAllowAnonymous()) {
  Promise.resolve().then(() => { refreshAnonymousToken() })
}

export function refreshAnonymousTokens() {
  if (!anonymousPromise) {
    anonymousPromise = refreshAnonymousToken();

    anonymousPromise.finally(() => (anonymousPromise = null));
  }

  return anonymousPromise;
}

export function refreshTokens() {
  if (!refreshPromise) {
    refreshPromise = logged() ? refreshToken() : refreshAnonymousTokens();

    refreshPromise.finally(() => (refreshPromise = null));
  }

  return refreshPromise;
}

export function autoLogins() {
  if (!loginPromise) {
    loginPromise = autoLogin();

    loginPromise.finally(() => (loginPromise = null));
  }

  return loginPromise;
}

export function verifyAuth(allowAnonymous = false) {
  allowAnonymous = allowAnonymous || isAllowAnonymous();

  if (!!getCurrentToken() || allowAnonymous) return Promise.resolve(!0);

  return (allowAnonymous ? refreshAnonymousTokens : refreshTokens)().then(() => !!getCurrentToken());
}
