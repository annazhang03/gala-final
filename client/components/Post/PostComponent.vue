<script setup lang="ts">
import router from "@/router";
import { useUserStore } from "@/stores/user";
import { formatDate } from "@/utils/formatDate";
import { storeToRefs } from "pinia";
import { fetchy } from "../../utils/fetchy";
import CommentsComponent from "../Comment/CommentsComponent.vue";
import LikesComponent from "../Post/LikesComponent.vue";

const props = defineProps(["post", "justContent", "noChanges"]);
const emit = defineEmits(["editPost", "refreshPosts"]);
const { currentUsername } = storeToRefs(useUserStore());

const deletePost = async () => {
  try {
    await fetchy(`api/posts/${props.post._id}`, "DELETE");
  } catch {
    return;
  }
  emit("refreshPosts");
};

const toUser = async () => {
  if (currentUsername.value == props.post.author) {
    void router.push({ name: "Profile" });
  } else {
    void router.push({ path: "/users", query: { username: props.post.author } });
  }
};
</script>

<template>
  <button v-if="!justContent" class="btn-small pure-button" @click="toUser">
    <p class="author">{{ props.post.author }}</p>
  </button>
  <p>{{ props.post.content }}</p>
  <div v-if="!justContent"><CommentsComponent :post="props.post" /></div>
  <div v-if="!justContent"><LikesComponent :post="props.post" /></div>
  <div v-if="!justContent && !noChanges" class="base">
    <menu v-if="props.post.author == currentUsername">
      <li><button class="btn-small pure-button" @click="emit('editPost', props.post._id)">Edit</button></li>
      <li><button class="button-error btn-small pure-button" @click="deletePost">Delete</button></li>
    </menu>
    <article class="timestamp">
      <p v-if="props.post.dateCreated !== props.post.dateUpdated">Edited on: {{ formatDate(props.post.dateUpdated) }}</p>
      <p v-else>Created on: {{ formatDate(props.post.dateCreated) }}</p>
    </article>
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
