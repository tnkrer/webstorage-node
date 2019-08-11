import { StorageBackend } from "./backend";
import { StorageProxy } from "./proxy";
import { Storage, StorageType } from "./types";

export const sessionStorage: Storage = new Proxy(
  new StorageBackend(StorageType.SessionStorage),
  StorageProxy,
);

export const localStorage: Storage = new Proxy(
  new StorageBackend(StorageType.LocalStorage),
  StorageProxy,
);

export const WebStorageNode = {
  sessionStorage,
  localStorage,
};

export default WebStorageNode;
