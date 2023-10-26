<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { fetchy } from "../../utils/fetchy";

const props = defineProps(["connection"]);
const emit = defineEmits(["refreshConnections"]);
const { currentUsername } = storeToRefs(useUserStore());

const deleteConnection = async () => {
  try {
    await fetchy(`api/connections/${props.connection._id}`, "DELETE");
  } catch {
    return;
  }
  emit("refreshConnections");
};

// const toUser = async () => {
//   if (currentUsername.value == props.post.author) {
//     void router.push({ name: "Profile" });
//   } else {
//     void router.push({ path: "/user", query: { username: props.post.author } });
//   }
// };
</script>

<template>
  <p class="author">{{ props.connection }}</p>
  <!-- <p>{{ props.post.content }}</p> -->
  <div class="base">
    <menu>
      <!-- <li><button class="btn-small pure-button" @click="emit('editPost', props.post._id)">Edit</button></li> -->
      <li><button class="button-error btn-small pure-button" @click="deleteConnection">Delete</button></li>
    </menu>
    <!-- <article class="timestamp">
      <p v-if="props.post.dateCreated !== props.post.dateUpdated">Edited on: {{ formatDate(props.post.dateUpdated) }}</p>
      <p v-else>Created on: {{ formatDate(props.post.dateCreated) }}</p>
    </article> -->
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
