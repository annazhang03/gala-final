<script setup lang="ts">
import ConnectOrFavorite from "@/components/Connection/ConnectOrFavorite.vue";
import JobListComponent from "@/components/Job/JobListComponent.vue";
import PostListComponent from "@/components/Post/PostListComponent.vue";
import UserReviewsComponent from "@/components/Review/UserReviewsComponent.vue";

import router from "@/router";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { onBeforeMount } from "vue";
import { useRoute } from "vue-router";

const currentRoute = useRoute();
const { currentUsername } = storeToRefs(useUserStore());
const { updateSession } = useUserStore();
void updateSession();

onBeforeMount(async () => {
  if (currentRoute.query.username === undefined) {
    void router.push({ name: "Home" });
  } else if (currentRoute.query.username === currentUsername.value) {
    void router.push({ name: "Profile" });
  }
});
</script>

<template>
  <main>
    <h1>{{ $route.query.username }}'s profile</h1>
    <ConnectOrFavorite :username="$route.query.username" />
    <PostListComponent :author="$route.query.username" />
    <UserReviewsComponent :username="$route.query.username" />
    <JobListComponent :employer="$route.query.username" />
  </main>
</template>

<style scoped>
h1 {
  text-align: center;
}
</style>
