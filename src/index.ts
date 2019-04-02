import { Merge } from "type-fest";

type CompareFn<T> = (a: T, b: T) => number;
type ToNumber<T> = (item: T) => number;

const identity = (x: any) => x;
interface IKeyArray<T> {
  [key: string]: T[];
}
interface IMerged<T, K> {
  left: T;
  right: K;
}
export const pick = <T, K extends keyof T>(o: T, keys: K[]): Pick<T, K> =>
  keys.reduce((acc, key) => {
    acc[key] = o[key];
    return acc;
  }, {} as any);

class ChainedArray<T> {
  public where = this.filter;

  public count = this.size;

  private items: T[];
  constructor(items: T[] = []) {
    this.items = items;
  }
  public max(f: ToNumber<T> = identity): T {
    return this.items.reduce((previous: T, current: T) => {
      return f(previous) - f(current) >= 0 ? previous : current;
    });
  }
  public min(f: ToNumber<T> = identity): T {
    return this.items.reduce((previous: T, current: T) => {
      return f(previous) - f(current) <= 0 ? previous : current;
    });
  }
  public sum(f: ToNumber<T> = identity): number {
    return this.reduce((acc, item) => acc + f(item), 0);
  }

  public avg(f: ToNumber<T> = identity): number {
    return this.sum(f) / this.size();
  }
  public distinct(f: (item: T) => any = identity): ChainedArray<T> {
    const map = new Map();
    return this.reduce<ChainedArray<T>>((acc, item) => {
      const key = f(item);
      if (!map.get(key)) {
        map.set(key, true);
        acc.push(item);
      }
      return acc;
    }, new ChainedArray<T>());
  }

  public head(): T {
    return this.nth(0);
  }
  public tail(): T {
    return this.nth(this.items.length - 1);
  }
  public nth(index: number): T {
    return this.items[index];
  }
  public toArray(): T[] {
    return this.items;
  }
  public map<K>(f: (item: T) => K): ChainedArray<K> {
    const result: K[] = this.items.map(f);
    return new ChainedArray<K>(result);
  }
  public filter(f: (item: T) => boolean): ChainedArray<T> {
    const result: T[] = this.items.filter(f);
    return new ChainedArray(result);
  }
  public forEach(f: (item: T) => void): void {
    this.items.forEach(f);
  }
  public reduce<K>(f: (acc: K, item: T) => K, initial: K): K {
    return this.items.reduce(f, initial);
  }
  public sort(f?: CompareFn<T>): ChainedArray<T> {
    this.items.sort(f);
    return new ChainedArray(this.items);
  }
  public push(item: T): ChainedArray<T> {
    this.items.push(item);
    return this;
  }
  public size(): number {
    return this.items.length;
  }
  public select<K extends keyof T>(keys: K[]) {
    return this.map((item) => pick(item, keys));
  }
  public groupBy(f: (item: T) => string = identity): IKeyArray<T> {
    return this.items.reduce((acc, item) => {
      const key = f(item);
      if (Array.isArray(acc[key])) {
        acc[key].push(item);
      } else {
        acc[key] = [item];
      }
      return acc;
    }, {});
  }
  public innerJoin<K>(items: K[], compareFn: (a: T, b: K) => number): ChainedArray<IMerged<T, K>> {
    const merge = (a: T, b: K): IMerged<T, K> => ({
      left: a,
      right: b,
    });
    return this.reduce((acc, a) => {
      items.forEach((b) => {
        if (compareFn(a, b) === 0) {
          acc.push(merge(a, b));
        }
      });
      return acc;
    }, new ChainedArray<IMerged<T, K>>([]));
  }
}

export default ChainedArray;
