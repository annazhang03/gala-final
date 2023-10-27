<script setup lang="ts">
import { ref } from "vue";

const employer = ref("");
const emit = defineEmits(["getJobsByEmployer"]);
</script>

<template>
  <form @submit.prevent="emit('getJobsByEmployer', employer)" class="pure-form">
    <fieldset>
      <legend>search by employer</legend>
      <input id="employer" type="text" v-model="employer" placeholder="username" />
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
</style>
