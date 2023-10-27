<script setup lang="ts">
import router from "@/router";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";

const props = defineProps(["user"]);
const { currentUsername } = storeToRefs(useUserStore());

const toUser = async () => {
  if (currentUsername.value == props.user.username) {
    void router.push({ name: "Profile" });
  } else {
    void router.push({ path: "/users", query: { username: props.user.username } });
  }
};
</script>

<template>
  <button class="btn-small pure-button" @click="toUser">
    <p class="username">{{ props.user.username }}</p>
  </button>
</template>

<style scoped>
p {
  margin: 0em;
}

.username {
  font-weight: bold;
  font-size: 1.2em;
}

menu {
  list-style-type: none;
  display: flex;
  flex-direction: row;
  gap: 1em;
  padding: 0;
  margin: 0;
}

.timestamp {
  display: flex;
  justify-content: flex-end;
  font-size: 0.9em;
  font-style: italic;
}

.base {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.base article:only-child {
  margin-left: auto;
}
</style>
