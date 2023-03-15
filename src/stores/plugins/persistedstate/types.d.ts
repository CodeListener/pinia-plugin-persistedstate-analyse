type Prettify<T> = {
  [K in keyof T]: T[K];
};
type StorageLike = Pick<Storage, 'getItem'|'setItem'>
type Serializer = {
  serialize: (value: StateTree) => string;
  deserialize: (value: string) => StateTree;
};
type PersistedStateOptions = {
  key?: string;
  storage?: StorageLike;
  paths?: Array<string>;
  serializer?: Serializer;
  beforeRestore?: (context: PiniaPluginContext) => void;
  afterRestore?: (context: PiniaPluginContext) => void;
  debug?: boolean;
};

type PersistedStateFactoryOptions = Prettify<
  Pick<PersistedStateOptions, "storage" | "serializer" | "beforeRestore" | "afterRestore" | "debug"> & {
    key?: (storeKey: string) => string;
    auto?: boolean;
  }
>;
