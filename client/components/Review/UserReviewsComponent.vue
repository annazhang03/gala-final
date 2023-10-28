<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import CreateReviewForm from "./CreateReviewForm.vue";
import EditReviewForm from "./EditReviewForm.vue";
import ReviewComponent from "./ReviewComponent.vue";

const props = defineProps(["username", "own"]);

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());
let editing = ref("");

const loaded = ref(false);
let reviews = ref<Array<Record<string, string>>>([]);

async function getReviews() {
  let query: Record<string, string>;
  if (props.own) {
    query = { subject: currentUsername.value };
  } else {
    query = { subject: props.username };
  }
  let reviewResults;
  try {
    reviewResults = await fetchy("/api/reviews", "GET", { query });
  } catch (_) {
    return;
  }
  reviews.value = reviewResults;
}

function updateEditing(id: string) {
  editing.value = id;
}

onBeforeMount(async () => {
  await getReviews();
  loaded.value = true;
});
</script>

<template>
  <div class="reviewsList">
    <div v-if="!props.own">
      <section v-if="isLoggedIn && props.username !== currentUsername">
        <h2>create a review:</h2>
        <CreateReviewForm :username="props.username" @refreshReviews="getReviews" />
      </section>
    </div>
    <div class="row">
      <h2 v-if="!props.own">reviews for {{ props.username }}:</h2>
      <h2 v-else>your reviews:</h2>
    </div>
    <section class="reviews" v-if="loaded && reviews.length !== 0">
      <article v-for="review in reviews" :key="review._id">
        <ReviewComponent v-if="editing !== review._id" :review="review" @refreshReviews="getReviews" @editReview="updateEditing" />
        <EditReviewForm v-else :review="review" @refreshReviews="getReviews" @editReview="updateEditing" />
      </article>
    </section>
    <section v-else>
      <h3 v-if="loaded">no reviews found</h3>
      <h3 v-else>loading...</h3>
    </section>
  </div>
</template>

<style scoped>
.reviewsList {
  font-family: Cambria, Cochin, Georgia, Times, "Times New Roman", serif;
  padding-bottom: 2em;
}

section {
  display: flex;
  flex-direction: column;
  gap: 1em;
}

section,
p,
.row {
  margin: 0 auto;
  max-width: 60em;
}

article {
  background-color: var(--base-bg);
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding: 1em;
}

.posts {
  padding: 1em;
}

.row {
  display: flex;
  justify-content: space-between;
  margin: 0 auto;
  max-width: 60em;
}
</style>
