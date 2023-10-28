<script setup lang="ts">
import UserComponent from "@/components/User/UserComponent.vue";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import { fetchy } from "../../utils/fetchy";
const props = defineProps(["post"]);
const likes = ref({ likes: [], is_expand: false });
const loaded = ref(false);
const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());
const viewing = ref(false);

async function getLikes() {
  let results;
  try {
    results = await fetchy(`/api/likes/${props.post._id}`, "GET");
  } catch {
    return;
  }
  likes.value.likes = results;
}

const unlike = async () => {
  try {
    await fetchy(`/api/like/${props.post._id}`, "DELETE");
  } catch {
    return;
  }
  await getLikes();
};

const like = async () => {
  try {
    await fetchy(`/api/like`, "POST", { body: { post: props.post._id } });
  } catch {
    return;
  }
  await getLikes();
};

async function toggleViewing() {
  viewing.value = !viewing.value;
  await getLikes();
}

onBeforeMount(async () => {
  await getLikes();
  loaded.value = true;
});
</script>
<template>
  <div class="likes">
    <section v-if="loaded && likes.likes.length !== 0">
      <button class="btn-small pure-button" @click="toggleViewing">{{ likes.likes.length }} likes</button>
      <article v-for="like in likes.likes" class="min-item" v-show="viewing" :key="like">
        <UserComponent style="background-color: lightgray" :user="like['author']" />
      </article>
    </section>
    <p v-else-if="loaded">no likes yet!</p>
    <p v-else>loading...</p>
    <section v-if="isLoggedIn" class="like">
      <div v-if="!likes.likes.map((l: any) => l.author).includes(currentUsername)"><button class="btn-small pure-button" @click="like">like</button></div>
      <div v-else><button class="button-error btn-small pure-button" @click="unlike">remove like</button></div>
    </section>
  </div>
</template>

<style scoped>
.min-item {
  display: flex;
}
p {
  margin: 0em;
}

.likes {
  font-family: Cambria, Cochin, Georgia, Times, "Times New Roman", serif;
  margin-top: 1.5em;
  font-size: 0.9em;
}

.like {
  margin-top: 0.5em;
  margin-bottom: 1em;
}

.pure-button {
  background-color: lightgray;
  border-radius: 8px;
  margin-bottom: 0.5em;
}

.like .pure-button {
  background-color: var(--cadet);
  color: white;
}

.like .button-error {
  background-color: var(--taupe);
}
</style>
