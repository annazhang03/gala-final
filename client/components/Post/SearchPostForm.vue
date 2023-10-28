<script setup lang="ts">
import { ref } from "vue";

const author = ref("");
const emit = defineEmits(["getPostsByAuthor"]);
</script>

<template>
  <form @submit.prevent="emit('getPostsByAuthor', author)" class="pure-form">
    <fieldset>
      <legend>search by author</legend>
      <input id="author" type="text" v-model="author" placeholder="username" />
      <button type="submit" class="pure-button pure-button-primary">search</button>
    </fieldset>
  </form>
</template>

<style scoped>
form {
  display: flex;
  gap: 0.5em;
  padding: 1em;
  align-items: center;
}

button {
  background-color: var(--violet);
  border-radius: 8px;
  font-size: 0.9em;
  margin: 0.5em;
}
</style>
