const { encode, decode } = require("../funcs/base-64");
const { getObjectProp } = require("../funcs/get.object.prop");
const {
  getLocalStorage,
  setLocalStorage,
  removeLocalStorage,
} = require("../funcs/storage");
const { httpRequest } = require("./http.network");
const http_request = require("./http.request");
const { onLine } = require("./utils");
// console.log(http_request);
const anonymousTokenKey = `anonymousToken`,
  tokenKey = `token`,
  sidKey = `sid`,
  rsidKey = `rsid`,
  uidKey = `uid`,
  lastDateKey = `lastDate`,
  allowAnonymous = getObjectProp(uni.server, "auth.anonymousLogin", true),
  logoutRouter = getObjectProp(uni.client, "logoutRouter", "/login");

export function getLocalToken() {
  return getLocalStorage(tokenKey);
}

export function verifyUID() {
  return !!getLocalStorage(uidKey);
}

function getUID() {
  const uid = getLocalStorage(uidKey);

  return uid && JSON.parse(decode(uid));
}

function cleanUID() {
  removeLocalStorage(uidKey);
}

function verifyAutoLogin() {
  return uni.server.auth.autoLogin && verifyUID();
}

export function logged() {
  return !!(getLocalToken() || verifyUID());
}

export function isAllowAnonymous() {
  return allowAnonymous;
}

export function getLocalAnonymousToken() {
  return isAllowAnonymous() ? getLocalStorage(anonymousTokenKey) : null;
}

export function getCurrentToken() {
  return getLocalToken() || getLocalAnonymousToken();
}

function getRsid() {
  return getLocalStorage(rsidKey);
}

function clearLocalToken() {
  [sidKey, rsidKey, tokenKey, lastDateKey].forEach((key) =>
    removeLocalStorage(key)
  );
}

function isTokenInvalid(_ = {}) {
  return !onLine();
}

function clearToken(_) {
  isTokenInvalid() && cleanUID();
}

function transformToken(token) {
  return {
    [tokenKey]: token.token_str,
    [sidKey]: token.access_token,
    [rsidKey]: token.refresh_token,
  };
}

function refreshLocalToken(token, iskeep) {
  const auth = (iskeep && clearLocalToken(), token);

  (auth[tokenKey] || token[anonymousTokenKey]) &&
    setLocalStorage(lastDateKey, new Date().toDateString());

  Object.keys(auth).forEach((key) => setLocalStorage(key, auth[key]));
}

function accessToken(params) {
  return httpRequest(
    new http_request.HttpRequest(
      `${uni.server.url}${uni.server.auth.oauth2Url}/access_token`,
      {
        params: Object.assign(Object.assign({}, params), {
          client_id: uni.server.apiKey.apiKey,
          client_secret: uni.server.apiKey.secret,
        }),
      }
    )
  )
    .then((response) => response.data)
    .then(transformToken);
}

function getAnonymousToken() {
  return accessToken({ grant_type: "client_credentials" });
}

export function refreshAnonymousToken() {
  return isAllowAnonymous()
    ? getAnonymousToken().then((token) =>
        refreshLocalToken({ [anonymousTokenKey]: token[tokenKey] }, !1)
      )
    : Promise.resolve({});
}

export function autoLogin() {
  return new Promise((resolve, reject) => {
    verifyAutoLogin()
      ? accessToken({ ...getUID(), grant_type: "password" }).then(
          (token) => (refreshLocalToken(token, !0), resolve(token)),
          (error) => (clearToken(error), reject(error))
        )
      : reject({ status: 401, errmsg: "请重新登录。" });
  });
}

export function refreshToken() {
  return new Promise((resolve, reject) => {
    const rsid = getRsid();

    (rsid
      ? accessToken({ refresh_token: rsid, grant_type: "refresh_token" }).then(
          (token) => (refreshLocalToken(token, !0), token),
          (error) => (onLine() ? autoLogin() : Promise.reject(error))
        )
      : autoLogin()
    ).then(resolve, reject);
  });
}

export function cycleRefreshToken() {
  if (uni.server.auth.autoRefreshToken) {
    const date = new Date().toDateString();

    if (getLocalStorage(lastDateKey) === date) return;

    setLocalStorage(lastDateKey, date);

    refreshAnonymousToken();
    refreshToken();
  }
}

export function refreshUID(uid) {
  uid ? setLocalStorage(uidKey, encode(JSON.stringify(uid))) : cleanUID();
}

export function refreshSystemToken(token, iskeep) {
  refreshLocalToken(transformToken(token), iskeep);
}

export function logout() {
  cleanUID(), clearLocalToken(), refreshAnonymousToken();
}

export function logoutAndJump(jumpRouter) {
  logout(), uni.reLaunch({ url: jumpRouter || logoutRouter });
}
