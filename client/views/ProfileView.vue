<script setup lang="ts">
import JobListComponent from "@/components/Job/JobListComponent.vue";
import PostListComponent from "@/components/Post/PostListComponent.vue";
import UserReviewsComponent from "@/components/Review/UserReviewsComponent.vue";

import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";

const { currentUsername, currentRole } = storeToRefs(useUserStore());
const { updateSession } = useUserStore();
const isArtist = currentRole.value === "Artist";
void updateSession();
</script>

<template>
  <main>
    <h1>{{ currentUsername }}</h1>
    <div class="row">
      <RouterLink v-if="currentRole === 'Artist'" :to="{ name: 'Portfolios' }"> <h2 class="button">portfolios</h2> </RouterLink>
      <RouterLink :to="{ name: 'Connections' }"> <h2 class="button">connections</h2> </RouterLink>
      <RouterLink :to="{ name: 'Favorites' }"> <h2 class="button">favorites</h2> </RouterLink>
      <RouterLink :to="{ name: 'Settings' }"> <h2 class="button">settings</h2> </RouterLink>
    </div>

    <div v-if="isArtist">
      <PostListComponent :isPortfolio="true" :owner="currentUsername" />
      <UserReviewsComponent :own="true" />
      <JobListComponent :own="true" />
    </div>
    <div v-else>
      <h2>Spectators do not have portfolios! You can change your role in <RouterLink :to="{ name: 'Settings' }"> Settings. </RouterLink></h2>
    </div>
  </main>
</template>

<style scoped>
h1,
h2 {
  text-align: center;
}

h1 {
  font-size: 2em;
}

.row {
  display: flex;
  justify-content: space-between;
  margin: 0 auto;
  max-width: 60em;
}

.button {
  padding: 1em;
  background-color: lightgray;
  border-radius: 20px;
  font-size: 1em;
}

main {
  font-family: Cambria, Cochin, Georgia, Times, "Times New Roman", serif;
}
</style>
