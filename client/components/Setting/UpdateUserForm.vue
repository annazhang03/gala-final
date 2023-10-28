<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { ref } from "vue";

let username = ref("");
let password = ref("");
let role = ref("");

const { updateUser, updateSession } = useUserStore();

async function updateUsername() {
  await updateUser({ username: username.value });
  await updateSession();
  username.value = "";
}

async function updatePassword() {
  await updateUser({ password: password.value });
  await updateSession();
  password.value = "";
}

async function updateRole() {
  await updateUser({ role: role.value });
  await updateSession();
  password.value = "";
}
</script>

<template>
  <h2>update details</h2>
  <form @submit.prevent="updateUsername" class="pure-form">
    <fieldset>
      <legend>change your username</legend>
      <input type="text" placeholder="new username" v-model="username" required @keydown.space.prevent />
      <button type="submit" class="pure-button pure-button-primary">update username</button>
    </fieldset>
  </form>

  <form @submit.prevent="updatePassword" class="pure-form">
    <fieldset>
      <legend>change your password</legend>
      <input type="password" placeholder="new password" v-model="password" required />
      <button type="submit" class="pure-button pure-button-primary">update password</button>
    </fieldset>
  </form>

  <form @submit.prevent="updateRole" class="pure-form">
    <fieldset>
      <legend>change your role</legend>
      <input type="radio" id="artist" value="Artist" v-model="role" />
      <label for="Artist">artist</label>
      <input type="radio" id="spectator" value="Spectator" v-model="role" />
      <label for="Spectator">spectator</label>
      <button type="submit" class="pure-button pure-button-primary">update role</button>
    </fieldset>
  </form>
</template>

<style scoped>
.radio {
  display: flex;
  justify-content: center;
}
.option {
  padding: 1em;
  margin-right: 2em;
}

#artist,
#spectator {
  margin-right: 0.5em;
  margin-left: 0.5em;
}

.pure-button {
  margin-left: 0.5em;
  background-color: var(--cadet);
  border-radius: 8px;
}

.button-error {
  background-color: var(--violet);
}
</style>
