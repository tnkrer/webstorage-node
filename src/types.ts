// Storage interface implementation
// Based on the HTML Living Standard specification
// https://html.spec.whatwg.org/multipage/webstorage.html

export interface Storage {
  readonly length: number;
  key: (index: number) => string;
  getItem: (key: string) => string;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
  clear: () => void;
  // Custom handling of getter/setters operators
  get: (name: any) => string;
  set: (name, value) => string;
}

// Library API
export interface WebStorage {
  readonly sessionStorage: Storage;
  readonly localStorage: Storage;
}

// Internal backend API
export enum StorageType {
  SessionStorage = "sessionStorage",
  LocalStorage = "localStorage"
}
