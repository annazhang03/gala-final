<script setup lang="ts">
import FavoriteListComponent from "@/components/Connection/FavoriteListComponent.vue";

import { useUserStore } from "@/stores/user";

const { updateSession } = useUserStore();
void updateSession();
</script>

<template>
  <main>
    <RouterLink :to="{ name: 'Profile' }"> <h2>back to profile</h2> </RouterLink>
    <FavoriteListComponent />
  </main>
</template>

<style scoped>
h1,
h2 {
  text-align: center;
}
</style>
