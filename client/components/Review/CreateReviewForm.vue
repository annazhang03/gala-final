<script setup lang="ts">
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const props = defineProps(["user"]);
const content = ref("");
const emit = defineEmits(["refreshReviews"]);

const createReview = async (content: string) => {
  try {
    await fetchy("api/reviews", "POST", {
      body: { content, subject: props.user.username },
    });
  } catch (_) {
    return;
  }
  emit("refreshReviews");
  emptyForm();
};

const emptyForm = () => {
  content.value = "";
};
</script>

<template>
  <form @submit.prevent="createReview(content)">
    <label for="content">Leave a review for {{ props.user.username }}:</label>
    <textarea id="content" v-model="content" placeholder="Write a review!" required> </textarea>
    <button type="submit" class="pure-button-primary pure-button">Create Review</button>
  </form>
</template>

<style scoped>
form {
  background-color: var(--base-bg);
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding: 1em;
}

textarea {
  font-family: inherit;
  font-size: inherit;
  height: 6em;
  padding: 0.5em;
  border-radius: 4px;
  resize: none;
}
</style>
