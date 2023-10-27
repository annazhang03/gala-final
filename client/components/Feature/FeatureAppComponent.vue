<script setup lang="ts">
import { fetchy } from "../../utils/fetchy";

const props = defineProps(["applied"]);
const emit = defineEmits(["refreshFeature"]);

const apply = async () => {
  try {
    await fetchy(`api/featured`, "POST");
  } catch {
    return;
  }
  emit("refreshFeature");
};

const withdraw = async () => {
  try {
    await fetchy(`api/featured`, "PATCH");
  } catch {
    return;
  }
  emit("refreshFeature");
};
</script>

<template>
  <menu>
    <li v-if="!props.applied"><button class="btn-small pure-button" @click="apply">apply to be featured</button></li>
    <li v-else><button class="button-error btn-small pure-button" @click="withdraw">withdraw from being featured</button></li>
  </menu>
</template>

<style scoped>
p {
  margin: 0em;
}

.employer {
  font-weight: bold;
  font-size: 1.2em;
}

menu {
  list-style-type: none;
  display: flex;
  flex-direction: row;
  gap: 1em;
  padding: 0;
  margin: 0;
}

.timestamp {
  display: flex;
  justify-content: flex-end;
  font-size: 0.9em;
  font-style: italic;
}

.base {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.base article:only-child {
  margin-left: auto;
}
</style>
