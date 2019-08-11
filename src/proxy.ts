import { Storage } from "./types";

// Use ES6 proxies to allow properties to be get, set and deleted using
// JS operators (i.e. storage.x = y, y = storage.x, delete storage.x)
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy

export class WebStorageAPIError extends Error {
  constructor() {
    super("Overriding methods/properties of the Web Storage API is forbidden");
    this.name = "WebStorageAPIError";
  }
}

export const StorageProxy: ProxyHandler<Storage> = {
  get(backend, prop) {
    const property = String(prop);
    const methodsAndProps = Object.keys(Object.getPrototypeOf(backend));
    return methodsAndProps.includes(property)
      ? backend[property].bind(backend)
      : backend.getItem(property);
  },
  set(backend, prop, value) {
    const property = String(prop);
    const methodsAndProps = Object.keys(Object.getPrototypeOf(backend));
    if (methodsAndProps.includes(property)) {
      throw new WebStorageAPIError();
    }
    backend.setItem(property, value);
    return true;
  },
  deleteProperty(backend, prop) {
    const property = String(prop);
    const methodsAndProps = Object.keys(Object.getPrototypeOf(backend));
    if (methodsAndProps.includes(property)) {
      throw new WebStorageAPIError();
    }
    backend.removeItem(property);
    return true;
  },
};
