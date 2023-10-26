<script setup lang="ts">
import FavoriteListComponent from "@/components/Connection/FavoriteListComponent.vue";
// import Favorite from "@/components/Connection/ConnectionRequestList.vue";

import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";

const { currentUsername, currentRole } = storeToRefs(useUserStore());
const { updateSession } = useUserStore();
// const isArtist = currentRole.value == "artist";
void updateSession();
</script>

<template>
  <main>
    <RouterLink :to="{ name: 'Profile' }"> <h2>back to profile</h2> </RouterLink>
    <FavoriteListComponent />
    <!-- <UserReviewsComponent :own="true" /> -->
    <!-- </div> -->
    <!-- <div v-else>Spectators do not have portfolios! You can change your role in <RouterLink :to="{ name: 'Settings' }"> Settings. </RouterLink></div> -->
  </main>
</template>

<style scoped>
h1,
h2 {
  text-align: center;
}
</style>
