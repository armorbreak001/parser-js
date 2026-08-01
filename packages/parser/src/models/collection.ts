import type { BaseModel } from './base';
import type { DetailedAsyncAPI } from '../types';

export interface CollectionMetadata<T = any> {
  originalData?: Record<string, T>;
  asyncapi?: DetailedAsyncAPI;
  pointer?: string;
}

export abstract class Collection<T extends BaseModel = BaseModel, M extends Record<string, any> = {}> extends Array<T> {
  constructor(
    protected readonly collections: T[],
    protected readonly _meta: CollectionMetadata<T> & M = {} as CollectionMetadata<T> & M,
  ) {
    super(...collections);
  }

  abstract get(id: string): T | undefined;

  has(id: string): boolean {
    return typeof this.get(id) !== 'undefined';
  }

  all(): T[] {
    return this.collections;
  }

  isEmpty(): boolean {
    return this.collections.length === 0;
  }

  filterBy(filter: (item: T) => boolean): T[] {
    return this.collections.filter(filter);
  }

  /**
   * Delegate Array iteration methods to the internal collections array.
   * This fixes issues where native Array methods like map(), filter(), etc.
   * throw "Spread syntax requires ...iterable[Symbol.iterator] to be a function"
   * when called on Array subclasses that use super(...items) in the constructor.
   * @see https://github.com/asyncapi/parser-js/issues/874
   */
  map<U>(callback: (item: T, index: number, array: T[]) => U, thisArg?: any): U[] {
    return this.collections.map(callback, thisArg);
  }

  filter(callback: (item: T, index: number, array: T[]) => unknown, thisArg?: any): T[] {
    return this.collections.filter(callback, thisArg);
  }

  flatMap<U>(callback: (item: T, index: number, array: T[]) => U | readonly U[], thisArg?: any): U[] {
    return this.collections.flatMap(callback, thisArg);
  }

  find(predicate: (item: T, index: number, obj: T[]) => unknown, thisArg?: any): T | undefined {
    return this.collections.find(predicate, thisArg);
  }

  findIndex(predicate: (item: T, index: number, obj: T[]) => unknown, thisArg?: any): number {
    return this.collections.findIndex(predicate, thisArg);
  }

  some(predicate: (item: T, index: number, array: T[]) => unknown, thisArg?: any): boolean {
    return this.collections.some(predicate, thisArg);
  }

  every(predicate: (item: T, index: number, array: T[]) => unknown, thisArg?: any): boolean {
    return this.collections.every(predicate, thisArg);
  }

  reduce(callback: (previousValue: T, currentValue: T, currentIndex: number, array: T[]) => T): T;
  reduce<U>(callback: (previousValue: U, currentValue: T, currentIndex: number, array: T[]) => U, initialValue: U): U;
  reduce(...args: any[]): any {
    return (this.collections as any).reduce(...args);
  }

  slice(start?: number, end?: number): T[] {
    return this.collections.slice(start, end);
  }

  concat(...items: (T | ConcatArray<T>)[]): T[] {
    return this.collections.concat(...items);
  }

  includes(item: T, fromIndex?: number): boolean {
    return this.collections.includes(item, fromIndex);
  }

  indexOf(item: T, fromIndex?: number): number {
    return this.collections.indexOf(item, fromIndex);
  }

  meta(): CollectionMetadata<T> & M;
  meta<K extends keyof (CollectionMetadata<T> & M)>(key: K): (CollectionMetadata<T> & M)[K];
  meta(key?: keyof (CollectionMetadata<T> & M)) {
    if (key === undefined) return this._meta;
    if (!this._meta) return;
    return this._meta[String(key)];
  }
}
