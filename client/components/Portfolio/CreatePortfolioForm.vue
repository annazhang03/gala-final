<script setup lang="ts">
import PostComponent from "@/components/Post/PostComponent.vue";
import router from "@/router";
import { onBeforeMount, ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const content = ref([]);
const bio = ref("");
const emit = defineEmits(["refreshPortfolios"]);
const props = defineProps(["posts"]);
const posts2 = ref(props.posts);

const reorder = () => {
  posts2.value = [...props.posts].sort((a: any, b: any) => a.id - b.id).filter((a: any) => a.show);
};

const createPortfolio = async (content: string, bio: string) => {
  try {
    await fetchy("api/portfolio", "POST", {
      body: { content, bio },
    });
  } catch (_) {
    return;
  }
  void router.push({ name: "Profile" });
  emit("refreshPortfolios");
  emptyForm();
};

const emptyForm = () => {
  content.value = [];
  bio.value = "";
};

onBeforeMount(async () => {
  posts2.value = props.posts;
});
</script>

<template>
  <h2>preview your portfolio:</h2>
  <button @click="reorder">preview portfolio</button>
  {{ bio }}
  <div v-for="post in posts2" :key="post.id">
    <PostComponent :post="post.name" :justContent="true" />
  </div>
  <h2>make your portfolio:</h2>
  <form @submit.prevent="createPortfolio(posts2.map((p: any) => p.name._id).join(), bio)">
    <h2>your bio:</h2>
    <textarea id="bio" v-model="bio" placeholder="add a bio" required> </textarea>
    <h2>edit order of your posts:</h2>
    <div v-for="post in props.posts" :key="post.id">
      <PostComponent :post="post.name" :justContent="true" />
      <input type="number" placeholder="placement, e.g. 1" v-model="post.id" />
      <input type="checkbox" v-model="post.show" />
    </div>
    <button type="submit" class="pure-button-primary pure-button">done!</button>
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
