<script setup lang="ts">
// import CreatePortfolioPage from "@/components/Portfolio/CreatePortfolioPage.vue";
import ChoosePortfolio from "@/components/Portfolio/ChoosePortfolio.vue";
</script>

<template>
  <main>
    <RouterLink :to="{ name: 'Profile' }"> <h2>back to profile</h2> </RouterLink>
    <RouterLink :to="{ name: 'Create Portfolio' }"> <h1>create a new portfolio</h1> </RouterLink>
    <h1>or choose an existing portfolio</h1>
    <ChoosePortfolio />
  </main>
</template>

<style scoped>
h1 {
  text-align: center;
}
</style>
