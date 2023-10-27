<script setup lang="ts">
import JobListComponent from "@/components/Job/JobListComponent.vue";
import PostListComponent from "@/components/Post/PostListComponent.vue";
import UserReviewsComponent from "@/components/Review/UserReviewsComponent.vue";

import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
// import SinglePortfolioComponent from "../components/Portfolio/SinglePortfolioComponent.vue";

const { currentUsername, currentRole } = storeToRefs(useUserStore());
const { updateSession } = useUserStore();
const isArtist = currentRole.value === "Artist";
void updateSession();
</script>

<template>
  <main>
    <h1>{{ currentUsername }}</h1>
    <RouterLink :to="{ name: 'Portfolios' }"> <h2>portfolios</h2> </RouterLink>
    <RouterLink :to="{ name: 'Connections' }"> <h2>Connections</h2> </RouterLink>
    <RouterLink :to="{ name: 'Favorites' }"> <h2>Favorites</h2> </RouterLink>
    <div v-if="isArtist">
      <PostListComponent :isPortfolio="true" :owner="currentUsername" />
      <!-- <PostListComponent :own="true" /> -->
      <UserReviewsComponent :own="true" />
      <JobListComponent :own="true" />
    </div>
    <div v-else>Spectators do not have portfolios! You can change your role in <RouterLink :to="{ name: 'Settings' }"> Settings. </RouterLink></div>
  </main>
</template>

<style scoped>
h1,
h2 {
  text-align: center;
}
</style>
