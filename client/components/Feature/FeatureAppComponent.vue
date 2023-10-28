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
  <div>
    <button id="apply" v-if="!props.applied" class="btn-small pure-button" @click="apply">apply to be featured</button>
    <button id="withdraw" v-else class="button-error btn-small pure-button" @click="withdraw">unapply to be featured</button>
  </div>
</template>

<style scoped>
p {
  margin: 0em;
}

div {
  text-align: center;
  font-size: 1em;
  padding-bottom: 3em;
}
.pure-button {
  border-radius: 8px;
  width: auto;
  font-size: 0.9em;
  color: white;
}

#apply {
  background-color: var(--cadet);
}
#withdraw {
  background-color: var(--violet);
}
</style>
