<script setup lang="ts">
import UserComponent from "@/components/User/UserComponent.vue";
import { useUserStore } from "@/stores/user";
import { formatDate } from "@/utils/formatDate";
import { storeToRefs } from "pinia";
import { fetchy } from "../../utils/fetchy";

const props = defineProps(["comment"]);
const emit = defineEmits(["refreshComments"]);
const { currentUsername } = storeToRefs(useUserStore());

const deleteComment = async () => {
  try {
    await fetchy(`/api/comment/${props.comment._id}`, "DELETE");
  } catch {
    return;
  }
  emit("refreshComments");
};
</script>

<template>
  <div class="comment">
    <div class="author">
      <UserComponent style="background-color: lightgray" :user="props.comment.author" />
    </div>
    <div class="content">
      <p>{{ props.comment.comment }}</p>
    </div>
    <div class="base">
      <div v-if="props.comment.author == currentUsername">
        <button class="button-error btn-small pure-button" @click="deleteComment">delete</button>
      </div>
      <article class="timestamp">
        <p>{{ formatDate(props.comment.dateCreated) }}</p>
      </article>
    </div>
  </div>
</template>

<style scoped>
.comment {
  border-radius: 20px;
  background-color: white;
  padding: 0.5em;
  margin: 0.5em;
}
.author {
  font-weight: 200;
  font-size: 0.8em;
  padding-top: 0.5em;
}

.content {
  font-family: Cambria, Cochin, Georgia, Times, "Times New Roman", serif;
  font-size: 0.9em;
  padding-right: 1em;
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
  font-size: 0.7em;
  font-style: italic;
  padding-right: 1em;
  padding-left: 1em;
}

.base {
  font-family: Cambria, Cochin, Georgia, Times, "Times New Roman", serif;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1em;
}

.base article:only-child {
  margin-left: auto;
}

.pure-button {
  background-color: darkgray;
  border-radius: 8px;
}
</style>
