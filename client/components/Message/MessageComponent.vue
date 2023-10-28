<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { formatDate } from "@/utils/formatDate";
import { storeToRefs } from "pinia";

const props = defineProps(["message"]);
const { currentUsername } = storeToRefs(useUserStore());
</script>

<template>
  <h3 v-if="props.message.to === currentUsername">from: {{ props.message.from }}</h3>
  <h3 v-else>to: {{ props.message.to }}</h3>
  <p class="content">{{ props.message.content }}</p>
  <div class="base">
    <article class="timestamp">
      <p>{{ formatDate(props.message.dateCreated) }}</p>
    </article>
  </div>
</template>

<style scoped>
p {
  margin: 0em;
}

.content {
  font-size: 1.5em;
  padding: 1em;
}

.author {
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
