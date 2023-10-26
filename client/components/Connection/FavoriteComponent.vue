<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { fetchy } from "../../utils/fetchy";

const props = defineProps(["favorite"]);
const emit = defineEmits(["refreshFavorites"]);
const { currentUsername } = storeToRefs(useUserStore());

const removeFavorite = async () => {
  try {
    await fetchy(`api/favorites/${props.favorite}`, "DELETE");
  } catch {
    return;
  }
  emit("refreshFavorites");
};
</script>

<template>
  <p class="author">{{ props.favorite }}</p>
  <div class="base">
    <menu>
      <li><button class="button-error btn-small pure-button" @click="removeFavorite">remove favorite</button></li>
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
