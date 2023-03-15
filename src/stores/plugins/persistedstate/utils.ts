import { StateTree } from "pinia";
export function normalizeOptions(options: boolean | PersistedStateOptions, globalOptons: PersistedStateFactoryOptions): PersistedStateOptions {
  options = (typeof options === "boolean" ? Object.create(null) : options) as PersistedStateOptions;
  return new Proxy(options, {
    get(target, key, receiver) {
      if (key === "key") {
        return Reflect.get(target, key, receiver);
      }
      return Reflect.get(target, key, receiver) || Reflect.get(globalOptons, key, receiver);
    },
  });
}

export function get(state: StateTree, paths: string[]) {
  return paths.reduce((prev, path) => {
    return prev?.[path];
  }, state);
}

function set(state: StateTree, paths: string[], value: unknown) {
  const res = paths.slice(0, -1).reduce((prev, p) => {
    return (prev[p] = prev[p] || {});
  }, state);
  res[paths[paths.length - 1]] = value;
  return state;
}

export function pick(state: StateTree, paths: string[]): StateTree {
  return paths.reduce<StateTree>((prev, path) => {
    const pathArr = path.split(".");
    return set(prev, pathArr, get(state, pathArr));
  }, {});
}
