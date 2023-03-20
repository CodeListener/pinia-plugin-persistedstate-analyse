import { createPinia } from "pinia";
import createPersistedState from "./plugins/persistedstate";

const pinia = createPinia();

pinia.use(
  createPersistedState({
    key: (k) => `__${k}___`,
    beforeRestore() {
      console.log("global beforeRestore");
    },
    afterRestore() {
      console.log("global afterRestore");
    },
    debug: true,
    storage: sessionStorage,
    auto: true
  })
);
export default pinia;
