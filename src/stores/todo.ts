import { defineStore } from "pinia";

type TodoItem = { name: string; complete: boolean; id?: string };
export const useTodoStore = defineStore("todos", {
  persist: {
    key: "hahahah",
    beforeRestore() {
      console.log("beforeRestore");
    },
    afterRestore() {
      console.log("afterRestore");
    },
    paths: ["a.b.c.d"],
  },
  state() {
    return {
      title: "todo",
      list: [] as TodoItem[],
      a: { b: { c: { d: { name: 1 } } } },
    };
  },
  getters: {
    unComplete(): TodoItem[] {
      return this.list.filter((item) => !item.complete);
    },
  },
  actions: {
    add(text: string) {
      this.list.push({ id: `${Math.random()}`, name: text, complete: false });
    },
    removeItem(id: string) {
      const idx = this.list.findIndex((item) => item.id === id);
      this.$patch((state) => {
        state.list.splice(idx, 1);
      });
    },
  },
});
