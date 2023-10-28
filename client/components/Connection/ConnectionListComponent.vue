<script setup lang="ts">
import { fetchy } from "@/utils/fetchy";
import { onBeforeMount, ref } from "vue";
import ConnectionComponent from "./ConnectionComponent.vue";

const loaded = ref(false);
let connections = ref<Array<Record<string, string>>>([]);

async function getConnections() {
  let results;
  try {
    results = await fetchy("/api/connections", "GET");
  } catch (_) {
    return;
  }
  connections.value = results;
}

onBeforeMount(async () => {
  await getConnections();
  loaded.value = true;
});
</script>

<template>
  <div class="connections">
    <div class="row">
      <h3>your connections:</h3>
    </div>
    <section class="reviews" v-if="loaded && connections.length !== 0">
      <article v-for="conn in connections" :key="conn._id">
        <ConnectionComponent :connection="conn" @refreshConnections="getConnections" />
      </article>
    </section>
    <section v-else class="reviews">
      <p v-if="loaded">no connections yet!</p>
      <p v-else>loading...</p>
    </section>
  </div>
</template>

<style scoped>
.connections {
  font-family: Cambria, Cochin, Georgia, Times, "Times New Roman", serif;
}
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
