import { PiniaPluginContext, StateTree, Store } from "pinia";

// 这块声明主要是为了能够支持typescript类型提醒，拓展store的参数
declare module "pinia" {
  export interface DefineStoreOptionsBase<S, Store> {
    persist?: boolean | PersistedStateOptions;
  }
}

export default function createPersistedState() {
  return (context: PiniaPluginContext) => {
    // option可以获取到persist
    const { options, store } = context;
    const { persist } = options;
    // 判断persist, falsy类型直接退出
    if (!persist) return;
    // 解析同步到state
    // $store.id 获取store的唯一标识符
    hydrateStore(store, store.$id);

    // 监听数据变化
    store.$subscribe(
      (mutation, state) => {
        // 持久化存储状态
        persistState(state, store.$id);
      },
      {
        // 组件销毁时，当前监听不会被销毁
        detached: true,
      }
    );
  };
}

// 解析数据同步到state
function hydrateStore(store: Store, key: string) {
  const fromStorage = localStorage.getItem(key);
  if (fromStorage) {
    try {
      store.$patch(JSON.parse(fromStorage));
    } catch (err) {
      console.error(err);
    }
  }
}
// 序列化之后存储到storage
function persistState(state: StateTree, key: string) {
  try {
    localStorage.setItem(key, JSON.stringify(state));
  } catch (err) {
    console.error(err);
  }
}

// 使用伪代码
// pinia.use(createPersistedState())
// const useXXStore = defineStore({
//       state: ()=> ({}),
//       persist: true
// })
