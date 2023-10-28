<script setup lang="ts">
import router from "@/router";
import { useUserStore } from "@/stores/user";
import { ref } from "vue";

const username = ref("");
const password = ref("");
const { loginUser, updateSession } = useUserStore();

async function login() {
  await loginUser(username.value, password.value);
  void updateSession();
  void router.push({ name: "Home" });
}
</script>

<template>
  <form class="pure-form pure-form-aligned" @submit.prevent="login">
    <h3>login</h3>
    <fieldset>
      <div class="pure-control-group">
        <label for="aligned-name">username</label>
        <input v-model.trim="username" type="text" id="aligned-name" placeholder="username" required @keydown.space.prevent />
      </div>
      <div class="pure-control-group">
        <label for="aligned-password">password</label>
        <input type="password" v-model.trim="password" id="aligned-password" placeholder="password" required />
      </div>
      <div class="pure-controls">
        <button type="submit" class="pure-button pure-button-primary">submit</button>
      </div>
    </fieldset>
  </form>
</template>

<style scoped>
h3 {
  display: flex;
  justify-content: center;
}

.pure-button {
  background-color: var(--cadet);
  border-radius: 8px;
}
</style>
