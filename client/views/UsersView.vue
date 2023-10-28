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
  <div class="users">
    <main v-if="$route.query.username !== undefined">
      <RouterLink :to="{ name: 'Users' }"> <h3>see all users</h3> </RouterLink>
      <h1>{{ $route.query.username }}'s profile</h1>
      <ConnectOrFavorite :username="$route.query.username" />
      <div class="message">
        <button class="btn-small pure-button" @click="toUser">message</button>
      </div>
      <PostListComponent :isPortfolio="true" :owner="$route.query.username" />
      <UserReviewsComponent :username="$route.query.username" />
      <JobListComponent :employer="$route.query.username" />
    </main>
    <main v-else>
      <h1>users</h1>
      <UserListComponent />
    </main>
  </div>
</template>

<style scoped>
.users {
  font-family: Cambria, Cochin, Georgia, Times, "Times New Roman", serif;
}
p {
  margin: 0em;
}

.message {
  text-align: center;
}
.pure-button {
  margin-top: 0.5em;
  background-color: var(--cadet);
  border-radius: 8px;
  width: auto;
  font-size: 0.9em;
  color: white;
}

menu {
  list-style-type: none;
  display: flex;
  flex-direction: row;
  gap: 1em;
  padding: 0;
  margin: 0;
}

h1,
h3 {
  text-align: center;
}
</style>
