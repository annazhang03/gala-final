<script setup lang="ts">
import JobListComponent from "@/components/Job/JobListComponent.vue";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());
</script>

<template>
  <main>
    <h1>jobs</h1>
    <JobListComponent />
  </main>
</template>

<style scoped>
h1 {
  text-align: center;
}
</style>
