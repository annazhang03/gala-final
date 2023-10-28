<script setup lang="ts">
import router from "@/router";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import UpdateUserForm from "../components/Setting/UpdateUserForm.vue";
import SpectatorInformation from "../components/User/SpectatorInformation.vue";

const { currentUsername } = storeToRefs(useUserStore());
const { logoutUser, deleteUser } = useUserStore();

async function logout() {
  await logoutUser();
  void router.push({ name: "Home" });
}

async function delete_() {
  await deleteUser();
  void router.push({ name: "Home" });
}
</script>

<template>
  <main class="column">
    <RouterLink :to="{ name: 'Profile' }"> <h3>back to profile</h3> </RouterLink>
    <SpectatorInformation />
    <h1>settings for {{ currentUsername }}</h1>
    <button class="pure-button pure-button-primary" @click="logout">logout</button>
    <button class="button-error pure-button" @click="delete_">delete account</button>
    <UpdateUserForm />
  </main>
</template>

<style scoped>
main {
  font-family: Cambria, Cochin, Georgia, Times, "Times New Roman", serif;
  padding-bottom: 1em;
  text-align: center;
}
h3 {
  display: flex;
  justify-content: center;
}

.pure-button {
  background-color: var(--cadet);
  border-radius: 8px;
}

.button-error {
  background-color: var(--violet);
}
</style>
