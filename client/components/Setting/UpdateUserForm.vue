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
  <h2>Update user details</h2>
  <form @submit.prevent="updateUsername" class="pure-form">
    <fieldset>
      <legend>Change your username</legend>
      <input type="text" placeholder="New username" v-model="username" required />
      <button type="submit" class="pure-button pure-button-primary">Update username</button>
    </fieldset>
  </form>

  <form @submit.prevent="updatePassword" class="pure-form">
    <fieldset>
      <legend>Change your password</legend>
      <input type="password" placeholder="New password" v-model="password" required />
      <button type="submit" class="pure-button pure-button-primary">Update password</button>
    </fieldset>
  </form>

  <form @submit.prevent="updateRole" class="pure-form">
    <fieldset>
      <legend>Change your role</legend>
      <input type="radio" id="artist" value="artist" v-model="role" />
      <label for="artist">artist</label>

      <input type="radio" id="spectator" value="spectator" v-model="role" />
      <label for="spectator">spectator</label>
      <button type="submit" class="pure-button pure-button-primary">Update role</button>
    </fieldset>
  </form>
</template>
