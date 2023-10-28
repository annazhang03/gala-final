<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());
</script>

<template>
  <main>
    <section>
      <h1>GALA</h1>
      <p>global artist linking app</p>
    </section>
    <section>
      <h2 v-if="isLoggedIn">welcome, {{ currentUsername }}!</h2>
      <h2 v-else>please login!</h2>
    </section>
    <section v-if="isLoggedIn">
      <p>see today's <RouterLink :to="{ name: 'Featured' }"> featured artist </RouterLink></p>
    </section>
  </main>
</template>

<style scoped>
p {
  text-align: center;
  font-family: Cambria, Cochin, Georgia, Times, "Times New Roman", serif;
  font-style: normal;
  font-size: 2em;
}

h2 {
  font-family: Cambria, Cochin, Georgia, Times, "Times New Roman", serif;
  font-style: italic;
  font-size: 3em;
  padding-top: 1em;
  padding-bottom: 0em;
  display: flex;
  justify-content: center;
  align-items: center;
}

h1 {
  font-family: Cambria, Cochin, Georgia, Times, "Times New Roman", serif;
  font-style: italic;
  font-size: 4em;
  padding-top: 1.5em;
  padding-bottom: 0em;
  display: flex;
  justify-content: center;
  align-items: center;
}

main {
  background-image: linear-gradient(white, var(--cadet));
  padding: 0;
  margin: 0;
  width: 100%;
  min-height: 100vh;
}
</style>
