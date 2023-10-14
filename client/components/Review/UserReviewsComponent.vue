<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import CreateReviewForm from "./CreateReviewForm.vue";
import EditReviewForm from "./EditReviewForm.vue";
import ReviewComponent from "./ReviewComponent.vue";

const props = defineProps(["user"]);

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());
let editing = ref("");

const loaded = ref(false);
let reviews = ref<Array<Record<string, string>>>([]);

async function getReviews() {
  let query: Record<string, string> = { subject: props.user.username };
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
  <section v-if="isLoggedIn && props.user.username !== currentUsername">
    <h3>Create a review:</h3>
    <CreateReviewForm :user="props.user" @refreshReviews="getReviews" />
  </section>
  <div class="row">
    <h3>Reviews for {{ props.user.username }}:</h3>
  </div>
  <section class="reviews" v-if="loaded && reviews.length !== 0">
    <article v-for="review in reviews" :key="review._id">
      <ReviewComponent v-if="editing !== review._id" :review="review" @refreshReviews="getReviews" @editReview="updateEditing" />
      <EditReviewForm v-else :review="review" @refreshReviews="getReviews" @editReview="updateEditing" />
    </article>
  </section>
  <p v-else-if="loaded">No reviews found</p>
  <p v-else>Loading...</p>
</template>

<style scoped>
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

.reviews {
  padding: 1em;
}

.row {
  display: flex;
  justify-content: space-between;
  margin: 0 auto;
  max-width: 60em;
}
</style>
