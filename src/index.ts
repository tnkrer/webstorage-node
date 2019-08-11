import { StorageBackend } from "./backend";
import { StorageProxy } from "./proxy";
import { Storage, StorageType } from "./types";

export const sessionStorage: Storage =
  typeof window !== "undefined" && window.sessionStorage
    ? window.sessionStorage
    : new Proxy(new StorageBackend(StorageType.SessionStorage), StorageProxy);

export const localStorage: Storage =
  typeof window !== "undefined" && window.localStorage
    ? window.localStorage
    : new Proxy(new StorageBackend(StorageType.LocalStorage), StorageProxy);

export const WebStorageNode = {
  sessionStorage,
  localStorage,
};

export default WebStorageNode;
