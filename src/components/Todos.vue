<template>
  <div>
    <h2>{{ todos.title }}</h2>
    <input type="text" v-model="text" @keyup.enter.enter="confirm" />
    <button @click="confirm">confirm</button>
    <ul>
      <li v-for="(item, index) in todos.list" :key="item.id">
        <input disabled type="checkbox" :checked="item.complete" /> {{ item.name }} <button @click="todos.removeItem(item.id!)">X</button>
      </li>
    </ul>
    <h5>未完成个数：{{ todos.unComplete.length }}</h5>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { useTodoStore } from "../stores/todo";

const text = ref("");
const todos = useTodoStore();

function confirm() {
  todos.add(text.value);
  text.value = "";
}

todos.$onAction(({ after }) => {
  console.log("async todo before");
  after(() => {
    console.log("async todo after");
  });
}, true);
</script>
