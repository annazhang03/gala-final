<script setup lang="ts">
import { fetchy } from "@/utils/fetchy";
import { onBeforeMount, ref } from "vue";
import FanComponent from "./FanComponent.vue";
import FavoriteComponent from "./FavoriteComponent.vue";

const loaded = ref(false);
let favorites = ref<Array<Record<string, string>>>([]);
let fans = ref<Array<Record<string, string>>>([]);

async function getFavorites() {
  let results;
  try {
    results = await fetchy("/api/favorites", "GET");
  } catch (_) {
    return;
  }
  favorites.value = results;
}

async function getFans() {
  let results;
  try {
    results = await fetchy("/api/fans", "GET");
  } catch (_) {
    return;
  }
  fans.value = results;
}

onBeforeMount(async () => {
  await getFavorites();
  await getFans();
  loaded.value = true;
});
</script>

<template>
  <div class="row">
    <h3>favorites:</h3>
  </div>
  <section class="reviews" v-if="loaded && favorites.length !== 0">
    <article v-for="fav in favorites" :key="fav._id">
      <FavoriteComponent :favorite="fav" @refreshFavorites="getFavorites" />
    </article>
  </section>
  <p v-else-if="loaded">no favorites yet!</p>
  <p v-else>loading...</p>
  <div class="row">
    <h3>fans:</h3>
  </div>
  <section class="reviews" v-if="loaded && fans.length !== 0">
    <article v-for="fan in fans" :key="fan._id">
      <FanComponent :fan="fan" @refreshFavorites="getFans" />
    </article>
  </section>
  <p v-else-if="loaded">no fans yet!</p>
  <p v-else>loading...</p>
</template>

<style scoped>
section {
  display: flex;
  flex-direction: column;
  gap: 1em;
}

section,
p,
.row {
  margin: 0 auto;
  max-width: 60em;
}

article {
  background-color: var(--base-bg);
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding: 1em;
}

.reviews {
  padding: 1em;
}

.row {
  display: flex;
  justify-content: space-between;
  margin: 0 auto;
  max-width: 60em;
}
</style>
