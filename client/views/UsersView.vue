<script setup lang="ts">
import ConnectOrFavorite from "@/components/Connection/ConnectOrFavorite.vue";
import JobListComponent from "@/components/Job/JobListComponent.vue";
import PostListComponent from "@/components/Post/PostListComponent.vue";
import UserReviewsComponent from "@/components/Review/UserReviewsComponent.vue";

import UserListComponent from "@/components/User/UserListComponent.vue";
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
  if (currentRoute.query.username === currentUsername.value) {
    void router.push({ name: "Profile" });
  }
});

const toUser = async () => {
  void router.push({ path: "/messages", query: { username: currentRoute.query.username } });
};
</script>

<template>
  <main v-if="$route.query.username !== undefined">
    <RouterLink :to="{ name: 'Users' }"> <h2>back to all users</h2> </RouterLink>
    <h1>{{ $route.query.username }}'s profile</h1>
    <ConnectOrFavorite :username="$route.query.username" />
    <button class="btn-small pure-button" @click="toUser">message</button>
    <PostListComponent :isPortfolio="true" :owner="$route.query.username" />
    <UserReviewsComponent :username="$route.query.username" />
    <JobListComponent :employer="$route.query.username" />
  </main>
  <main v-else>
    <h1>users</h1>
    <UserListComponent />
  </main>
</template>

<style scoped>
p {
  margin: 0em;
}

.author {
  font-weight: bold;
  font-size: 1.2em;
}

menu {
  list-style-type: none;
  display: flex;
  flex-direction: row;
  gap: 1em;
  padding: 0;
  margin: 0;
}

.timestamp {
  display: flex;
  justify-content: flex-end;
  font-size: 0.9em;
  font-style: italic;
}

.base {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.base article:only-child {
  margin-left: auto;
}
h1 {
  text-align: center;
}
</style>
