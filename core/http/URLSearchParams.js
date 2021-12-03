export function paramParser(rawParams = "") {
  const map = new Map();
  if (rawParams.length > 1) {
    if (rawParams.charAt(0) === "?") rawParams = rawParams.substr(1);

    const params = rawParams.split("&");
    params.forEach((param) => {
      const eqIdx = param.indexOf("=");
      const [key, val] =
        eqIdx === -1
          ? [param, ""]
          : [param.slice(0, eqIdx), param.slice(eqIdx + 1)];
      const list = map.get(key) || [];
      list.push(val);
      map.set(key, list);
    });
  }

  return map;
}

export class QueryEncoder {
  encodeKey(k) {
    return standardEncoding(k);
  }

  encodeValue(v) {
    return standardEncoding(v);
  }
}

function standardEncoding(v) {
  return encodeURIComponent(v)
    .replace(/%40/gi, "@")
    .replace(/%3A/gi, ":")
    .replace(/%24/gi, "$")
    .replace(/%2C/gi, ",")
    .replace(/%3B/gi, ";")
    .replace(/%2B/gi, "+")
    .replace(/%3D/gi, "=")
    .replace(/%3F/gi, "?")
    .replace(/%2F/gi, "/");
}

export class URLSearchParams {
  paramsMap;
  constructor(rawParams = "", queryEncoder = new QueryEncoder()) {
    this.queryEncoder = queryEncoder;
    this.paramsMap = paramParser(rawParams);
  }

  clone() {
    const clone = new URLSearchParams("", this.queryEncoder);
    clone.appendAll(this);
    return clone;
  }

  has(param) {
    return this.paramsMap.has(param);
  }

  get(param) {
    const storedParam = this.paramsMap.get(param);

    return Array.isArray(storedParam) ? storedParam[0] : null;
  }

  getAll(param) {
    return this.paramsMap.get(param) || [];
  }

  set(param, val) {
    if (val === void 0 || val === null) {
      this.delete(param);
      return;
    }
    const list = this.paramsMap.get(param) || [];
    list.length = 0;
    list.push(val);
    this.paramsMap.set(param, list);
  }

  setAll(searchParams) {
    searchParams.paramsMap.forEach((value, param) => {
      const list = this.paramsMap.get(param) || [];
      list.length = 0;
      list.push(value[0]);
      this.paramsMap.set(param, list);
    });
  }

  append(param, val) {
    if (val === void 0 || val === null) return;
    const list = this.paramsMap.get(param) || [];
    list.push(val);
    this.paramsMap.set(param, list);
  }

  appendAll(searchParams) {
    searchParams.paramsMap.forEach((value, param) => {
      const list = this.paramsMap.get(param) || [];
      for (let i = 0; i < value.length; ++i) {
        list.push(value[i]);
      }
      this.paramsMap.set(param, list);
    });
  }

  replaceAll(searchParams) {
    searchParams.paramsMap.forEach((value, param) => {
      const list = this.paramsMap.get(param) || [];
      list.length = 0;
      for (let i = 0; i < value.length; ++i) {
        list.push(value[i]);
      }
      this.paramsMap.set(param, list);
    });
  }

  toString() {
    const paramsList = [];
    this.paramsMap.forEach((values, k) => {
      values.forEach((v) =>
        paramsList.push(
          this.queryEncoder.encodeKey(k) +
            "=" +
            this.queryEncoder.encodeValue(v)
        )
      );
    });
    return paramsList.join("&");
  }

  delete(param) {
    this.paramsMap.delete(param);
  }
}
