<script setup lang="ts">
import ConnectionListComponent from "@/components/Connection/ConnectionListComponent.vue";
import ConnectionRequestList from "@/components/Connection/ConnectionRequestList.vue";

import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";

const { currentUsername, currentRole } = storeToRefs(useUserStore());
const { updateSession } = useUserStore();
// const isArtist = currentRole.value == "artist";
void updateSession();
</script>

<template>
  <main>
    <RouterLink :to="{ name: 'Profile' }"> <h2>Back to profile</h2> </RouterLink>
    <h1>{{ currentUsername }}'s connection requests</h1>
    <ConnectionRequestList />
    <h1>{{ currentUsername }}'s connections</h1>
    <!-- <div v-if="isArtist"> -->
    <ConnectionListComponent />
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
