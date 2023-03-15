import { createPinia } from "pinia";
import createPersistedState from "./plugins/persistedstate";

const pinia = createPinia();

pinia.use(createPersistedState());
export default pinia;
