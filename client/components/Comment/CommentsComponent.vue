<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import { fetchy } from "../../utils/fetchy";
import CommentComponent from "./CommentComponent.vue";
import CreateCommentForm from "./CreateCommentForm.vue";
const props = defineProps(["post"]);
const comments = ref({ comments: [], is_expand: false });
const loaded = ref(false);
const { isLoggedIn } = storeToRefs(useUserStore());

async function getComments() {
  let results;
  try {
    results = await fetchy(`/api/comments/${props.post._id}`, "GET");
  } catch {
    return;
  }
  comments.value.comments = results;
}

onBeforeMount(async () => {
  await getComments();
  loaded.value = true;
});
</script>
<template>
  <section class="jobs" v-if="loaded && comments.comments.length !== 0">
    <label @click="comments.is_expand = !comments.is_expand">view {{ comments.comments.length }} comments:</label>
    <article v-for="comment in comments.comments" class="min-item" v-show="comments.is_expand" :key="comment">
      <CommentComponent :comment="comment" @refreshComments="getComments" />
    </article>
  </section>
  <p v-else-if="loaded">no comments yet!</p>
  <p v-else>loading...</p>
  <section v-if="isLoggedIn">
    <h2>add a comment:</h2>
    <CreateCommentForm :post="props.post" @refreshComments="getComments" />
  </section>
</template>

<style scoped>
.min-item {
  display: flex;
}
</style>
