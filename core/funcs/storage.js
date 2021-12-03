const { encode } = require("./base-64");
const { merge, set } = require("./lodash");

const { getObjectProp } = require("./get.object.prop");

const appDomain = encode(
  getObjectProp(uni, "client.appDomain") ||
    getObjectProp(uni, "server.url", "api")
);

function non(value) {
  return value !== null && value !== void 0;
}

function getKey(key) {
  return `${key}_${appDomain}`;
}

function getValue(key) {
  return uni.getStorageSync(getKey(key));
}

function setValue(key, value) {
  non(value)
    ? uni.setStorageSync(getKey(key), value)
    : uni.removeStorageSync(getKey(key));
}

function getObject(key) {
  const json = getValue(key);

  return json ? JSON.parse(json) : json;
}

function setObject(key, value) {
  non(value)
    ? setValue(key, JSON.stringify(value))
    : uni.removeStorageSync(getKey(key));
}

export function getLocalStorage(key) {
  return getValue(key);
}

export function setLocalStorage(key, value) {
  return setValue(key, value), value;
}

export function getLocalStorageObject(key) {
  return getObject(key);
}

export function setLocalStorageObject(key, value) {
  return setObject(key, value), value;
}

export function updateLocalStorageObject(key, value) {
  return (
    setObject(key, (value = merge({}, getLocalStorageObject(key), value))),
    value
  );
}

export function setLocalStorageObjectKey(key, keyPath, value) {
  return setObject(key, set(getLocalStorageObject(key), keyPath, value)), value;
}

export function deleteLocalStorageObjectKey(key, keyPath) {
  setLocalStorageObjectKey(key, keyPath, null);
}

export function removeLocalStorage(key) {
  uni.removeStorageSync(getKey(key));
}

export function clearLocalStorage() {
  uni.clearStorageSync();
}

export function createLocalStorageScene(key, keyPath) {
  const backKey = key;

  return {
    resetKey(subKey) {
      key = `${backKey}_${subKey}`;
    },
    setObjectKey(value) {
      return setLocalStorageObjectKey(key, keyPath, value);
    },
    deleteObjectKey() {
      deleteLocalStorageObjectKey(key, keyPath);
    },
  };
}

export function createLocalStorage(key) {
  const backKey = key;

  return {
    resetKey(subKey) {
      key = `${backKey}_${subKey}`;
    },
    has() {
      return !!getLocalStorage(key);
    },
    get() {
      return getLocalStorage(key);
    },
    set(value) {
      return setLocalStorage(key, value);
    },
    getObject() {
      return getLocalStorageObject(key);
    },
    setObject(value) {
      return setLocalStorageObject(key, value);
    },
    updateObject(value) {
      return updateLocalStorageObject(key, value);
    },
    setObjectKey(keyPath, value) {
      return setLocalStorageObjectKey(key, keyPath, value);
    },
    deleteObjectKey(keyPath) {
      deleteLocalStorageObjectKey(key, keyPath);
    },
    remove() {
      removeLocalStorage(key);
    },
    clear() {
      clearLocalStorage();
    },
    createScene(keyPath) {
      return createLocalStorageScene(key, keyPath);
    },
  };
}

let memoryStorageKeys = {},
  memoryStorage = new WeakMap();

function getMemoryStorageKey(key) {
  return memoryStorageKeys[key] || (memoryStorageKeys[key] = {});
}

function removeMemoryStorageKey(key) {
  delete memoryStorageKeys[key];
}

export function getMemoryStorage(key) {
  return memoryStorage.get(getMemoryStorageKey(key));
}

export function setMemoryStorage(key, value) {
  return memoryStorage.set(getMemoryStorageKey(key), value), value;
}

export function updateMemoryStorageObject(key, value) {
  return (
    memoryStorage.set(
      getMemoryStorageKey(key),
      (value = merge({}, getMemoryStorage(key), value))
    ),
    value
  );
}

export function setMemoryStorageObjectKey(key, keyPath, value) {
  return (
    memoryStorage.set(
      getMemoryStorageKey(key),
      set(getMemoryStorage(key), keyPath, value)
    ),
    value
  );
}

export function deleteMemoryStorageObjectKey(key, keyPath) {
  setMemoryStorageObjectKey(key, keyPath, null);
}

export function removeMemoryStorage(key) {
  memoryStorage.delete(getMemoryStorageKey(key));

  removeMemoryStorageKey(key);
}

export function clearMemoryStorage() {
  memoryStorageKeys = {};

  memoryStorage = new Map();
}

export function createMemoryStorageScene(key, keyPath) {
  const backKey = key;

  return {
    resetKey(subKey) {
      key = `${backKey}_${subKey}`;
    },
    setObjectKey(value) {
      return setMemoryStorageObjectKey(key, keyPath, value);
    },
    deleteObjectKey() {
      deleteMemoryStorageObjectKey(key, keyPath);
    },
  };
}

export function createMemoryStorage(key) {
  const backKey = key;

  return {
    resetKey(subKey) {
      key = `${backKey}_${subKey}`;
    },
    has() {
      return !!getMemoryStorage(key);
    },
    get() {
      return getMemoryStorage(key);
    },
    set(value) {
      return setMemoryStorage(key, value);
    },
    getObject() {
      return getMemoryStorage(key);
    },
    setObject(value) {
      return setMemoryStorage(key, value);
    },
    updateObject(value) {
      return updateMemoryStorageObject(key, value);
    },
    setObjectKey(keyPath, value) {
      return setMemoryStorageObjectKey(key, keyPath, value);
    },
    deleteObjectKey(keyPath) {
      deleteMemoryStorageObjectKey(key, keyPath);
    },
    remove() {
      removeMemoryStorage(key);
    },
    clear() {
      clearMemoryStorage();
    },
    createScene(keyPath) {
      return createMemoryStorageScene(key, keyPath);
    },
  };
}

export function getStorage(key) {
  return value(key, getMemoryStorage, getLocalStorage);
}

export function getStorageObject(key) {
  return value(key, getMemoryStorage, getLocalStorageObject);
}

function value(key, ...storages) {
  for (const storage of storages) {
    const value = storage(key);

    if (non(value)) {
      return value;
    }
  }
}

export function setStorage(key, value) {
  return setMemoryStorage(key, value), setLocalStorage(key, value);
}

export function setStorageObject(key, value) {
  return setMemoryStorage(key, value), setLocalStorageObject(key, value);
}

export function updateStorageObject(key, value) {
  return (
    updateMemoryStorageObject(key, value), updateLocalStorageObject(key, value)
  );
}

export function setStorageObjectKey(key, keyPath, value) {
  return (
    setMemoryStorageObjectKey(key, keyPath, value),
    setLocalStorageObjectKey(key, keyPath, value)
  );
}

export function deleteStorageObjectKey(key, keyPath) {
  deleteMemoryStorageObjectKey(key, keyPath),
    deleteLocalStorageObjectKey(key, keyPath);
}

export function removeStorage(key) {
  removeMemoryStorage(key), removeLocalStorage(key);
}

export function clearStorage() {
  clearMemoryStorage(), clearLocalStorage();
}

export function createStorageScene(key, keyPath) {
  const backKey = key;

  return {
    resetKey(subKey) {
      key = `${backKey}_${subKey}`;
    },
    setObjectKey(value) {
      return setStorageObjectKey(key, keyPath, value);
    },
    deleteObjectKey() {
      deleteStorageObjectKey(key, keyPath);
    },
  };
}

export function createStorage(key) {
  const backKey = key;

  return {
    resetKey(subKey) {
      key = `${backKey}_${subKey}`;
    },
    has() {
      return !!getStorage(key);
    },
    get() {
      return getStorage(key);
    },
    set(value) {
      return setStorage(key, value);
    },
    getObject() {
      return getStorageObject(key);
    },
    setObject(value) {
      return setStorageObject(key, value);
    },
    updateObject(value) {
      return updateStorageObject(key, value);
    },
    setObjectKey(keyPath, value) {
      return setStorageObjectKey(key, keyPath, value);
    },
    deleteObjectKey(keyPath) {
      deleteStorageObjectKey(key, keyPath);
    },
    remove() {
      removeStorage(key);
    },
    clear() {
      clearStorage();
    },
    createScene(keyPath) {
      return createStorageScene(key, keyPath);
    },
  };
}

export function storageSceneFactory(key, keyPath, ...storageCreaters) {
  const storages = storageCreaters.map((storageCreater) => storageCreater(key));

  return {
    resetKey(subKey) {
      storages.forEach((storage) => storage.resetKey(subKey));
    },
    setObjectKey(value) {
      return (
        storages.forEach((storage) => storage.setObjectKey(keyPath, value)),
        value
      );
    },
    deleteObjectKey() {
      storages.forEach((storage) => storage.deleteObjectKey(keyPath));
    },
  };
}

export function storageFactory(key, ...storageCreaters) {
  const backKey = key,
    storages = storageCreaters.map((storageCreater) => storageCreater(key));

  return {
    resetKey(subKey) {
      key = `${backKey}_${subKey}`;

      storages.forEach((storage) => storage.resetKey(subKey));
    },
    has() {
      return !!storages[storages.length - 1]?.has();
    },
    get() {
      for (const storage of storages) {
        const value = storage.get();

        if (non(value)) {
          return value;
        }
      }
    },
    set(value) {
      return storages.forEach((storage) => storage.set(value)), value;
    },
    getObject() {
      for (const storage of storages) {
        const value = storage.getObject();

        if (non(value)) {
          return value;
        }
      }
    },
    setObject(value) {
      return storages.forEach((storage) => storage.setObject(value)), value;
    },
    updateObject(value) {
      return storages.forEach((storage) => storage.updateObject(value)), value;
    },
    setObjectKey(keyPath, value) {
      return (
        storages.forEach((storage) => storage.setObjectKey(keyPath, value)),
        value
      );
    },
    deleteObjectKey(keyPath) {
      storages.forEach((storage) => storage.deleteObjectKey(keyPath));
    },
    remove() {
      storages.forEach((storage) => storage.remove());
    },
    clear() {
      storages.forEach((storage) => storage.clear());
    },
    createScene(keyPath) {
      return {
        setObjectKey(value) {
          return (
            storages.forEach((storage) => storage.setObjectKey(keyPath, value)),
            value
          );
        },
        deleteObjectKey() {
          storages.forEach((storage) => storage.deleteObjectKey(keyPath));
        },
      };
    },
  };
}

export function createStorageByKey(key) {
  if (memoryStorageKeys[key]) {
    return createMemoryStorage(key);
  }

  if (uni.getStorageSync(getKey(key))) {
    return createLocalStorage(key);
  }
}
