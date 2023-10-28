<script setup lang="ts">
import UserComponent from "@/components/User/UserComponent.vue";
import { useUserStore } from "@/stores/user";
import { formatDate } from "@/utils/formatDate";
import { storeToRefs } from "pinia";
import { fetchy } from "../../utils/fetchy";

const props = defineProps(["review"]);
const emit = defineEmits(["editReview", "refreshReviews"]);
const { currentUsername } = storeToRefs(useUserStore());

const deleteReview = async () => {
  try {
    await fetchy(`api/reviews/${props.review._id}`, "DELETE");
  } catch {
    return;
  }
  emit("refreshReviews");
};
</script>

<template>
  <div class="review">
    <div class="author">
      <UserComponent :user="props.review.author" />
    </div>
    <!-- <p class="author">{{ props.review.author }}</p> -->
    <p class="content">{{ props.review.content }}</p>
    <div class="base">
      <menu v-if="props.review.author == currentUsername">
        <li><button class="btn-small pure-button" @click="emit('editReview', props.review._id)">edit</button></li>
        <li><button class="button-error btn-small pure-button" @click="deleteReview">delete</button></li>
      </menu>
      <article class="timestamp">
        <p v-if="props.review.dateCreated !== props.review.dateUpdated">Edited on: {{ formatDate(props.review.dateUpdated) }}</p>
        <p v-else>Created on: {{ formatDate(props.review.dateCreated) }}</p>
      </article>
    </div>
  </div>
</template>

<style scoped>
.review {
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
