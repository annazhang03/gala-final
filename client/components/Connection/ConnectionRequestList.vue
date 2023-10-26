<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import ConnectionRequestComponent from "./ConnectionRequestComponent.vue";

const { currentUsername } = storeToRefs(useUserStore());
const loaded = ref(false);
let incoming = ref<Array<Record<string, string>>>([]);
let outgoing = ref<Array<Record<string, string>>>([]);

async function getConnectionRequests() {
  let results;
  try {
    results = await fetchy("/api/connection/requests", "GET");
  } catch (_) {
    return;
  }
  incoming.value = results.filter((r: any) => r.to === currentUsername.value && r.status === "pending");
  outgoing.value = results.filter((r: any) => r.from === currentUsername.value && r.status === "pending");
}

onBeforeMount(async () => {
  await getConnectionRequests();
  loaded.value = true;
});
</script>

<template>
  <div class="row">
    <h3>incoming connection requests:</h3>
  </div>
  <section class="reviews" v-if="loaded && incoming.length !== 0">
    <article v-for="request in incoming" :key="request._id">
      <ConnectionRequestComponent :request="request" @refreshRequests="getConnectionRequests" />
    </article>
  </section>
  <p v-else-if="loaded">no incoming connection requests!</p>
  <p v-else>loading...</p>
  <div class="row">
    <h3>outgoing connection requests:</h3>
  </div>
  <section class="reviews" v-if="loaded && outgoing.length !== 0">
    <article v-for="request in outgoing" :key="request._id">
      <ConnectionRequestComponent :request="request" @refreshRequests="getConnectionRequests" />
    </article>
  </section>
  <p v-else-if="loaded">no outgoing connection requests!</p>
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
