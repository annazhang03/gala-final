<script setup lang="ts">
import PostListComponent from "@/components/Post/PostListComponent.vue";
import UserReviewsComponent from "@/components/Review/UserReviewsComponent.vue";

import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());
const { updateSession } = useUserStore();
void updateSession();
// const props = defineProps(["username"]);
</script>

<template>
  <main>
    <h1>{{ $route.query.username }}'s profile</h1>
    <PostListComponent :author="$route.query.username" />
    <UserReviewsComponent :username="$route.query.username" />
  </main>
</template>

<style scoped>
h1 {
  text-align: center;
}
</style>
