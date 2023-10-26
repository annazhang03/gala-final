<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
// import CreateReviewForm from "./CreateReviewForm.vue";
// import EditReviewForm from "./EditReviewForm.vue";
import ConnectionRequestComponent from "./ConnectionRequestComponent.vue";
// const props = defineProps(["username", "own"]);

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());
// let editing = ref("");

const loaded = ref(false);
let incoming = ref<Array<Record<string, string>>>([]);
let outgoing = ref<Array<Record<string, string>>>([]);

async function getConnectionRequests() {
  //   let query: Record<string, string>;
  //   if (props.own) {
  //     query = { subject: currentUsername.value };
  //   } else {
  //     query = { subject: props.username };
  //   }
  let results;
  try {
    results = await fetchy("/api/connection/requests", "GET");
  } catch (_) {
    return;
  }
  incoming.value = results.filter((r) => r.to === currentUsername.value && r.status === "pending");
  outgoing.value = results.filter((r) => r.from === currentUsername.value && r.status === "pending");
}

// function updateEditing(id: string) {
//   editing.value = id;
// }
// const pendingRequests = computed(() => requests.value);

// computed: {
//     pendingRequests() {
//         return requests.filter(r => r.status === "pending")
//     }
// }

onBeforeMount(async () => {
  await getConnectionRequests();
  loaded.value = true;
});
</script>

<template>
  <!-- <div v-if="!props.own">
    <section v-if="isLoggedIn && props.username !== currentUsername">
      <h3>Create a review:</h3>
      <CreateReviewForm :username="props.username" @refreshReviews="getReviews" />
    </section>
  </div> -->
  <div class="row">
    <h3>Incoming connection requests:</h3>
  </div>
  <section class="reviews" v-if="loaded && incoming.length !== 0">
    <article v-for="request in incoming" :key="request._id">
      <ConnectionRequestComponent :request="request" @refreshRequests="getConnectionRequests" />
      <!-- <EditReviewForm v-else :review="review" @refreshReviews="getReviews" @editReview="updateEditing" /> -->
    </article>
  </section>
  <p v-else-if="loaded">No incoming connection requests!</p>
  <p v-else>Loading...</p>
  <div class="row">
    <h3>Outgoing connection requests:</h3>
  </div>
  <section class="reviews" v-if="loaded && outgoing.length !== 0">
    <article v-for="request in outgoing" :key="request._id">
      <ConnectionRequestComponent :request="request" @refreshRequests="getConnectionRequests" />
      <!-- <EditReviewForm v-else :review="review" @refreshReviews="getReviews" @editReview="updateEditing" /> -->
    </article>
  </section>
  <p v-else-if="loaded">No outgoing connection requests!</p>
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
