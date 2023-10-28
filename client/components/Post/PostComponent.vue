<script setup lang="ts">
import UserComponent from "@/components/User/UserComponent.vue";
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
</script>

<template>
  <div class="post">
    <div v-if="!justContent">
      <UserComponent :user="props.post.author" />
    </div>
    <div class="content">{{ props.post.content }}</div>
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
  </div>
</template>

<style scoped>
.post {
  font-family: Cambria, Cochin, Georgia, Times, "Times New Roman", serif;
  /* background-color: #f0efeb; */
}

.content {
  font-size: 1.5em;
  padding: 1em;
}

.base .pure-button {
  background-color: white;
  border-radius: 8px;
  margin-bottom: 0.5em;
  border-color: rgb(137, 136, 136);
}

.base .button-error {
  background-color: rgb(137, 136, 136);
}

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
