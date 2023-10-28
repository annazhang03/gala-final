<script setup lang="ts">
import { ref } from "vue";

const username = ref("");
const emit = defineEmits(["getUserByUsername"]);
</script>

<template>
  <form @submit.prevent="emit('getUserByUsername', username)" class="pure-form">
    <fieldset>
      <legend>search by username</legend>
      <input id="username" type="text" v-model="username" placeholder="username" />
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
