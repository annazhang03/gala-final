<script setup lang="ts">
import CreatePortfolioPage from "@/components/Portfolio/CreatePortfolioPage.vue";
</script>

<template>
  <main>
    <RouterLink :to="{ name: 'Portfolios' }"> <h1>choose an existing portfolio</h1> </RouterLink>
    <h1>or create a new portfolio</h1>
    <CreatePortfolioPage />
  </main>
</template>

<style scoped>
h1 {
  text-align: center;
}
</style>
