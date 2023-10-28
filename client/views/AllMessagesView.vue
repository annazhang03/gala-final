<script setup lang="ts">
import MessagesComponent from "@/components/Message/MessagesComponent.vue";
import router from "@/router";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { onBeforeMount } from "vue";
import { useRoute } from "vue-router";
import AllUsersMessaged from "../components/Message/AllUsersMessaged.vue";

const currentRoute = useRoute();
const { currentUsername } = storeToRefs(useUserStore());
const { updateSession } = useUserStore();
void updateSession();

onBeforeMount(async () => {
  if (currentRoute.query.username === currentUsername.value) {
    void router.push({ name: "Profile" });
  }
});
</script>

<template>
  <main>
    <div v-if="$route.query.username === undefined">
      <h1>messages</h1>
      <AllUsersMessaged />
    </div>
    <div v-else>
      <RouterLink :to="{ name: 'Messages' }"> <h3>back to all messages</h3> </RouterLink>
      <h1>messages</h1>
      <MessagesComponent :user="$route.query.username" />
    </div>
  </main>
</template>

<style scoped>
h1,
h3 {
  text-align: center;
  font-family: Cambria, Cochin, Georgia, Times, "Times New Roman", serif;
}
</style>
