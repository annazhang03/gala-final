<script setup lang="ts">
import { fetchy } from "../../utils/fetchy";

const props = defineProps(["connection"]);
const emit = defineEmits(["refreshConnections"]);

const deleteConnection = async () => {
  try {
    await fetchy(`api/connections/${props.connection._id}`, "DELETE");
  } catch {
    return;
  }
  emit("refreshConnections");
};
</script>

<template>
  <p class="author">{{ props.connection }}</p>
  <div class="base">
    <menu>
      <li><button class="button-error btn-small pure-button" @click="deleteConnection">Delete</button></li>
    </menu>
  </div>
</template>

<style scoped>
p {
  margin: 0em;
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
