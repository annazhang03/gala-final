<script setup lang="ts">
import PostComponent from "@/components/Post/PostComponent.vue";
import router from "@/router";
import { fetchy } from "@/utils/fetchy";
import { onBeforeMount, ref } from "vue";

const loaded = ref(false);
let portfolios = ref<Array<Record<string, any>>>([]);
const current = ref();
const selected = ref(1);
async function getPortfolios() {
  let portfolioResults;
  try {
    portfolioResults = await fetchy("api/portfolio", "GET");
  } catch (_) {
    return;
  }
  portfolios.value = portfolioResults;
}

onBeforeMount(async () => {
  await getPortfolios();
  loaded.value = true;
});

const updatePortfolio = async (portfolio: string) => {
  try {
    await fetchy(`/api/portfolio/${portfolio}`, "PATCH");
  } catch (_) {
    return;
  }
  void router.push({ name: "Profile" });
};
</script>

<template>
  {{ current }}
  <section class="portfolios" v-if="loaded && portfolios.length !== 0">
    <ol>
      <article v-for="portfolio in portfolios" :key="portfolio._id">
        <li>
          {{ portfolio.bio }}
          <div v-for="post in portfolio.content" :key="post.id">
            <PostComponent :post="post" :justContent="true" />
          </div>
        </li>
      </article>
    </ol>
    <form @submit.prevent="updatePortfolio(portfolios[selected - 1]._id)">
      <div id="app">
        <select v-model="selected">
          <option v-for="n in portfolios.length" :value="n" :key="n">{{ n }}</option>
        </select>
      </div>
      <button type="submit" class="pure-button-primary pure-button">set new portfolio</button>
    </form>
  </section>
  <p v-else-if="loaded">no portfolios yet!</p>
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

.portfolios {
  padding: 1em;
}

.row {
  display: flex;
  justify-content: space-between;
  margin: 0 auto;
  max-width: 60em;
}
</style>
