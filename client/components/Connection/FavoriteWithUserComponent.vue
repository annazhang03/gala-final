<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { fetchy } from "../../utils/fetchy";

const props = defineProps(["username", "favoriteStatus", "fanStatus"]);
const emit = defineEmits(["refresh"]);
const { currentUsername } = storeToRefs(useUserStore());

const removeFavorite = async () => {
  try {
    await fetchy(`api/favorites/${props.username}`, "DELETE");
  } catch {
    return;
  }
  emit("refresh");
};

const addFavorite = async () => {
  try {
    await fetchy(`api/favorite/${props.username}`, "POST");
  } catch {
    return;
  }
  emit("refresh");
};

const removeFan = async () => {
  try {
    await fetchy(`api/fans/${props.username}`, "DELETE");
  } catch {
    return;
  }
  emit("refresh");
};
</script>

<template>
  <div class="base">
    <menu>
      <li v-if="props.favoriteStatus"><button class="button-error btn-small pure-button" @click="removeFavorite">unfavorite</button></li>
      <li v-else><button class="btn-small pure-button" @click="addFavorite">favorite</button></li>
      <li v-if="props.fanStatus"><button class="button-error btn-small pure-button" @click="removeFan">remove from fans</button></li>
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
