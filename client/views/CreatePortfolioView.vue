<script setup lang="ts">
import CreatePortfolioPage from "@/components/Portfolio/CreatePortfolioPage.vue";
import PortfolioInformation from "@/components/Portfolio/PortfolioInformation.vue";
</script>

<template>
  <main>
    <RouterLink :to="{ name: 'Profile' }"> <h3>back to profile</h3> </RouterLink>
    <RouterLink :to="{ name: 'Portfolios' }"> <h1>choose an existing portfolio</h1> </RouterLink>
    <h1>or create a new portfolio</h1>
    <div><PortfolioInformation /></div>

    <CreatePortfolioPage />
  </main>
</template>

<style scoped>
h1,
h3,
div {
  text-align: center;
  font-family: Cambria, Cochin, Georgia, Times, "Times New Roman", serif;
}
</style>
