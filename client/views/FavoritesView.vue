<script setup lang="ts">
import FavoriteListComponent from "@/components/Connection/FavoriteListComponent.vue";

import { useUserStore } from "@/stores/user";

const { updateSession } = useUserStore();
void updateSession();
</script>

<template>
  <main>
    <RouterLink :to="{ name: 'Profile' }"> <h3>back to profile</h3> </RouterLink>
    <FavoriteListComponent />
  </main>
</template>

<style scoped>
h1,
h3 {
  text-align: center;
  font-family: Cambria, Cochin, Georgia, Times, "Times New Roman", serif;
}
</style>
