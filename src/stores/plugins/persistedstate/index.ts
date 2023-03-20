import { PiniaPluginContext, StateTree, Store } from "pinia";
import { normalizeOptions, pick } from "./utils";
// 这块声明主要是为了能够支持typescript类型提醒，拓展store的参数
declare module "pinia" {
  export interface DefineStoreOptionsBase<S, Store> {
    persist?: boolean | PersistedStateOptions | PersistedStateOptions[];
  }
}

interface Persistence {
  storage: StorageLike;
  serializer: Serializer;
  key: string;
  paths?: string[];
  debug: boolean;
}

export default function createPersistedState(globalOptons: PersistedStateFactoryOptions = {}) {
  const { auto = false } = globalOptons || {};
  return (context: PiniaPluginContext) => {
    const { options, store } = context;
    const { persist = auto } = options;
    if (!persist) return;
    // 由于需要支持Array和object，我们统一将其转换成Array方便后面处理
    // 这个方法你可以理解为persist类型进行参数规范化，同时在第一个
    // 参数获取不到值时到第二个参数获取，由于还没考虑到全局配置，这里先忽略normalizeOptions的第二个参数
    let persistOptions = (Array.isArray(persist) ? persist.map((p) => normalizeOptions(p, globalOptons)) : [normalizeOptions(persist, globalOptons)]).map((option) => {
      const {
        storage = localStorage,
        beforeRestore,
        afterRestore,
        serializer = {
          serialize: JSON.stringify,
          deserialize: JSON.parse,
        },
        key = store.$id,
        paths,
        debug = false,
      } = option;
      return {
        storage,
        beforeRestore,
        afterRestore,
        serializer,
        key: (globalOptons.key ?? ((k) => k))(key),
        paths,
        debug,
      };
    });
    persistOptions.forEach((option) => {
      const { beforeRestore, afterRestore } = option;
      beforeRestore?.(context);
      // 解析同步到state
      hydrateStore(store, option);
      afterRestore?.(context);

      store.$subscribe(
        (_mutation, state) => {
          persistState(state, option);
        },
        {
          detached: true,
        }
      );
    });
  };
}

// 解析数据同步到state
function hydrateStore(store: Store, option: Persistence) {
  const { storage, serializer, debug } = option;
  const fromStorage = storage.getItem(option.key);
  if (fromStorage) {
    try {
      store.$patch(serializer.deserialize(fromStorage));
    } catch (error) {
      if (debug) console.error(error);
    }
  }
}
// 序列化之后存储到storage
function persistState(state: StateTree, option: Persistence) {
  const { paths, storage, serializer, key, debug } = option;
  try {
    const result = Array.isArray(paths) ? pick(state, paths) : state;
    storage.setItem(key, serializer.serialize(result));
  } catch (error) {
    if (debug) console.error(error);
  }
}
