<script setup lang="ts">
import ChoosePortfolio from "@/components/Portfolio/ChoosePortfolio.vue";
import PortfolioInformation from "@/components/Portfolio/PortfolioInformation.vue";
</script>

<template>
  <main>
    <RouterLink :to="{ name: 'Profile' }"> <h3>back to profile</h3> </RouterLink>
    <RouterLink :to="{ name: 'Create Portfolio' }"> <h1>create a new portfolio</h1> </RouterLink>
    <h1>or choose an existing portfolio</h1>
    <div><PortfolioInformation /></div>
    <ChoosePortfolio />
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
