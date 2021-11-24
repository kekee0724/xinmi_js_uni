const {
  createLocalStorage,
  createLocalStorageScene,
  createMemoryStorage,
  createMemoryStorageScene,
  createStorage,
  createStorageByKey,
  createStorageScene,
  deleteLocalStorageObjectKey,
  deleteMemoryStorageObjectKey,
  deleteStorageObjectKey,
  getLocalStorage,
  getLocalStorageObject,
  getMemoryStorage,
  getStorage,
  getStorageObject,
  removeLocalStorage,
  removeMemoryStorage,
  removeStorage,
  setLocalStorage,
  setLocalStorageObject,
  setLocalStorageObjectKey,
  setMemoryStorage,
  setMemoryStorageObjectKey,
  setStorage,
  setStorageObject,
  setStorageObjectKey,
  storageFactory,
  storageSceneFactory,
  updateLocalStorageObject,
  updateMemoryStorageObject,
  updateStorageObject,
} = require("./storage");

function getCurrentUserKey(key) {
  return `${key}_${getLocalStorage("currentUserId") || 0}`;
}

export function getCurrentUserLocalStorage(key) {
  return getLocalStorage(getCurrentUserKey(key));
}

export function setCurrentUserLocalStorage(key, value) {
  return setLocalStorage(getCurrentUserKey(key), value);
}

export function getCurrentUserLocalStorageObject(key) {
  return getLocalStorageObject(getCurrentUserKey(key));
}

export function setCurrentUserLocalStorageObject(key, value) {
  return setLocalStorageObject(getCurrentUserKey(key), value);
}

export function updateCurrentUserLocalStorageObject(key, value) {
  return updateLocalStorageObject(getCurrentUserKey(key), value);
}

export function setCurrentUserLocalStorageObjectKey(key, keyPath, value) {
  return setLocalStorageObjectKey(getCurrentUserKey(key), keyPath, value);
}

export function deleteCurrentUserLocalStorageObjectKey(key, keyPath) {
  deleteLocalStorageObjectKey(getCurrentUserKey(key), keyPath);
}

export function removeCurrentUserLocalStorage(key) {
  removeLocalStorage(getCurrentUserKey(key));
}

export function createCurrentUserLocalStorageScene(key, keyPath) {
  return createLocalStorageScene(getCurrentUserKey(key), keyPath);
}

export function createCurrentUserLocalStorage(key) {
  return createLocalStorage(getCurrentUserKey(key));
}

export function getCurrentUserMemoryStorage(key) {
  return getMemoryStorage(getCurrentUserKey(key));
}

export function setCurrentUserMemoryStorage(key, value) {
  return setMemoryStorage(getCurrentUserKey(key), value);
}

export function updateCurrentUserMemoryStorageObject(key, value) {
  return updateMemoryStorageObject(getCurrentUserKey(key), value);
}

export function setCurrentUserMemoryStorageObjectKey(key, keyPath, value) {
  return setMemoryStorageObjectKey(getCurrentUserKey(key), keyPath, value);
}

export function deleteCurrentUserMemoryStorageObjectKey(key, keyPath) {
  deleteMemoryStorageObjectKey(getCurrentUserKey(key), keyPath);
}

export function removeCurrentUserMemoryStorage(key) {
  removeMemoryStorage(getCurrentUserKey(key));
}

export function createCurrentUserMemoryStorageScene(key, keyPath) {
  return createMemoryStorageScene(getCurrentUserKey(key), keyPath);
}

export function createCurrentUserMemoryStorage(key) {
  return createMemoryStorage(getCurrentUserKey(key));
}

export function getCurrentUserStorage(key) {
  return getStorage(getCurrentUserKey(key));
}

export function getCurrentUserStorageObject(key) {
  return getStorageObject(getCurrentUserKey(key));
}

export function setCurrentUserStorage(key, value) {
  return setStorage(getCurrentUserKey(key), value);
}

export function setCurrentUserStorageObject(key, value) {
  return setStorageObject(getCurrentUserKey(key), value);
}

export function updateCurrentUserStorageObject(key, value) {
  return updateStorageObject(getCurrentUserKey(key), value);
}

export function setCurrentUserStorageObjectKey(key, keyPath, value) {
  return setStorageObjectKey(getCurrentUserKey(key), keyPath, value);
}

export function deleteCurrentUserStorageObjectKey(key, keyPath) {
  deleteStorageObjectKey(getCurrentUserKey(key), keyPath);
}

export function removeCurrentUserStorage(key) {
  removeStorage(getCurrentUserKey(key));
}

export function createCurrentUserStorageScene(key, keyPath) {
  return createStorageScene(getCurrentUserKey(key), keyPath);
}

export function createCurrentUserStorage(key) {
  return createStorage(getCurrentUserKey(key));
}

export function storageCurrentUserSceneFactory(
  key,
  keyPath,
  ...storageCreaters
) {
  return storageSceneFactory(
    getCurrentUserKey(key),
    keyPath,
    ...storageCreaters
  );
}

export function storageCurrentUserFactory(key, ...storageCreaters) {
  return storageFactory(getCurrentUserKey(key), ...storageCreaters);
}

export function createCurrentUserStorageByKey(key) {
  return createStorageByKey(getCurrentUserKey(key));
}
