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
const creating = ref(false);

async function getComments() {
  let results;
  try {
    results = await fetchy(`/api/comments/${props.post._id}`, "GET");
  } catch {
    return;
  }
  comments.value.comments = results;
}

async function toggleCreating() {
  creating.value = !creating.value;
}

onBeforeMount(async () => {
  await getComments();
  loaded.value = true;
});
</script>

<template>
  <div class="comments">
    <section v-if="loaded && comments.comments.length !== 0">
      <button class="btn-small pure-button" @click="toggleCreating">{{ comments.comments.length }} comments</button>
      <article v-for="comment in comments.comments" class="min-item" v-show="creating" :key="comment">
        <CommentComponent :comment="comment" @refreshComments="getComments" />
      </article>
    </section>
    <p v-else-if="loaded"><button class="btn-small pure-button" @click="toggleCreating">write the first comment</button></p>
    <p v-else>loading...</p>
    <section v-if="isLoggedIn">
      <div v-if="creating">
        <CreateCommentForm :post="props.post" @refreshComments="getComments" />
      </div>
    </section>
  </div>
</template>

<style scoped>
.min-item {
  display: flex;
}

.comments {
  font-family: Cambria, Cochin, Georgia, Times, "Times New Roman", serif;
}

.pure-button {
  background-color: lightgray;
  border-radius: 8px;
}
</style>
