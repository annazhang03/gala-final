<script setup lang="ts">
import PostListComponent from "@/components/Post/PostListComponent.vue";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());
</script>

<template>
  <main>
    <h1>gala</h1>
    <h2>global artist linking app</h2>
    <section>
      <h1 v-if="isLoggedIn">welcome {{ currentUsername }}!</h1>
      <h1 v-else>please login!</h1>
    </section>
    <section>
      <h2>see today's <RouterLink :to="{ name: 'Featured' }"> featured artist </RouterLink></h2>
    </section>
    <PostListComponent />
  </main>
</template>

<style scoped>
h1,
h2 {
  text-align: center;
}
</style>
