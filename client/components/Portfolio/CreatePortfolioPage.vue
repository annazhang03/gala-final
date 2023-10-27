<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import CreatePortfolioForm from "./CreatePortfolioForm.vue";

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());

const loaded = ref(false);
let posts = ref<Array<Record<string, string>>>([]);
let postsMap = ref();

async function getPosts() {
  let query: Record<string, string> = { author: currentUsername.value };
  let postResults;
  try {
    postResults = await fetchy("api/posts", "GET", { query });
  } catch (_) {
    return;
  }
  posts.value = postResults;
  let i = -1;
  postsMap.value = posts.value.map((p: any) => {
    i += 1;
    return { id: i, show: true, name: p };
  });
}

onBeforeMount(async () => {
  await getPosts();
  loaded.value = true;
});
</script>

<template>
  <section v-if="isLoggedIn">
    <CreatePortfolioForm :posts="postsMap" @refreshPortfolios="getPosts" />
  </section>
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
