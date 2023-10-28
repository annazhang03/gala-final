<script setup lang="ts">
import { ref } from "vue";

const expanded = ref(false);

async function toggleExpanded() {
  expanded.value = !expanded.value;
}
</script>
<template>
  <div class="info">
    <button class="btn-small pure-button" @click="toggleExpanded">what's a spectator?</button>
    <article v-show="expanded">
      Some GALA users are spectators. Spectators do not have posts or a portfolio, but can still interact with other GALA users and artists' posts. Users can change their role in settings anytime!
    </article>
  </div>
</template>

<style scoped>
.pure-button {
  background-color: lightgray;
  border-radius: 8px;
}

article {
  margin-top: 0.5em;
  margin-left: 15%;
  margin-right: 15%;
}
</style>
