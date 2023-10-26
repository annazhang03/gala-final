<script setup lang="ts">
import PostListComponent from "@/components/Post/PostListComponent.vue";
import UserReviewsComponent from "@/components/Review/UserReviewsComponent.vue";

import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";

const { currentUsername, currentRole } = storeToRefs(useUserStore());
const { updateSession } = useUserStore();
const isArtist = currentRole.value == "artist";
void updateSession();
</script>

<template>
  <main>
    <h1>{{ currentUsername }}</h1>
    <div v-if="isArtist">
      <PostListComponent :own="true" />
      <UserReviewsComponent :own="true" />
    </div>
    <div v-else>Spectators do not have portfolios! You can change your role in <RouterLink :to="{ name: 'Settings' }"> Settings. </RouterLink></div>
  </main>
</template>

<style scoped>
h1 {
  text-align: center;
}
</style>
