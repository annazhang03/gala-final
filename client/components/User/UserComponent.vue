<script setup lang="ts">
import router from "@/router";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";

const props = defineProps(["user"]);
const { currentUsername } = storeToRefs(useUserStore());

const toUser = async () => {
  if (currentUsername.value == props.user) {
    void router.push({ name: "Profile" });
  } else {
    void router.push({ path: "/users", query: { username: props.user } });
  }
};
</script>

<template>
  <button class="btn-small pure-button" @click="toUser">
    <p class="username">{{ props.user }}</p>
  </button>
</template>

<style scoped>
p {
  margin: 0em;
}

.username {
  font-weight: bold;
  font-size: 1.5em;
  font-family: Cambria, Cochin, Georgia, Times, "Times New Roman", serif;
}

.pure-button {
  background-color: #bcd4e6;
  border-radius: 8px;
}
</style>
