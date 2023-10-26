<script setup lang="ts">
import ConnectionListComponent from "@/components/Connection/ConnectionListComponent.vue";
import ConnectionRequestList from "@/components/Connection/ConnectionRequestList.vue";

import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";

const { currentUsername } = storeToRefs(useUserStore());
const { updateSession } = useUserStore();
void updateSession();
</script>

<template>
  <main>
    <RouterLink :to="{ name: 'Profile' }"> <h2>Back to profile</h2> </RouterLink>
    <h1>{{ currentUsername }}'s connection requests</h1>
    <ConnectionRequestList />
    <h1>{{ currentUsername }}'s connections</h1>
    <ConnectionListComponent />
  </main>
</template>

<style scoped>
h1,
h2 {
  text-align: center;
}
</style>
