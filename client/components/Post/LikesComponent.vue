<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import { fetchy } from "../../utils/fetchy";
const props = defineProps(["post"]);
const likes = ref({ likes: [], is_expand: false });
const loaded = ref(false);
const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());

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

onBeforeMount(async () => {
  await getLikes();
  loaded.value = true;
});
</script>
<template>
  <section class="jobs" v-if="loaded && likes.likes.length !== 0">
    <label @click="likes.is_expand = !likes.is_expand">view {{ likes.likes.length }} likes:</label>
    <article v-for="like in likes.likes" class="min-item" v-show="likes.is_expand" :key="like">
      {{ like["author"] }}
    </article>
  </section>
  <p v-else-if="loaded">no likes yet!</p>
  <p v-else>loading...</p>
  <section v-if="isLoggedIn">
    <menu>
      <li v-if="!likes.likes.map((l: any) => l.author).includes(currentUsername)"><button class="btn-small pure-button" @click="like">like</button></li>
      <li v-else><button class="button-error btn-small pure-button" @click="unlike">remove like</button></li>
    </menu>
  </section>
</template>

<style scoped>
.min-item {
  display: flex;
}
p {
  margin: 0em;
}

.employer {
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
