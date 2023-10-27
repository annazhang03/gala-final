<script setup lang="ts">
import CreatePostForm from "@/components/Post/CreatePostForm.vue";
import EditPostForm from "@/components/Post/EditPostForm.vue";
import PostComponent from "@/components/Post/PostComponent.vue";
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import SearchPostForm from "./SearchPostForm.vue";

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());

const loaded = ref(false);
let posts = ref<Array<Record<string, string>>>([]);
let bio = ref("");
let editing = ref("");
let searchAuthor = ref("");
const props = defineProps(["own", "author", "isPortfolio", "owner", "featured"]);

async function getPosts(author?: string) {
  let query: Record<string, string> = {};
  let postResults;
  if (props.isPortfolio) {
    try {
      const portfolio = await fetchy(`/api/portfolio/${props.owner}`, "GET");
      postResults = portfolio.content;
      bio.value = portfolio.bio;
    } catch (_) {
      return;
    }
  } else {
    if (props.author !== undefined || author !== undefined) {
      if (props.author !== undefined) {
        query = { author: props.author };
      } else if (author !== undefined) {
        query = { author };
      }
      try {
        postResults = await fetchy("api/posts", "GET", { query });
      } catch (_) {
        return;
      }
    } else {
      try {
        postResults = await fetchy("api/feed", "GET");
      } catch (_) {
        return;
      }
    }
  }

  searchAuthor.value = author ? author : "";
  posts.value = postResults;
}

function updateEditing(id: string) {
  editing.value = id;
}

onBeforeMount(async () => {
  if (props.own) {
    await getPosts(currentUsername.value);
  } else {
    await getPosts();
  }
  loaded.value = true;
});
</script>

<template>
  <section v-if="!props.featured && isLoggedIn && !props.author && (!props.isPortfolio || currentUsername === props.owner)">
    <h2>Create a post:</h2>
    <CreatePostForm @refreshPosts="getPosts" />
  </section>
  <div v-if="!props.isPortfolio" class="row">
    <h2 v-if="!searchAuthor">Posts:</h2>
    <h2 v-else>Posts by {{ searchAuthor }}:</h2>
    <SearchPostForm v-if="!props.own && !props.author" @getPostsByAuthor="getPosts" />
  </div>
  <div v-else>
    <h2>bio: {{ bio }}</h2>
    <h2>posts:</h2>
  </div>
  <section class="posts" v-if="loaded && posts.length !== 0">
    <article v-for="post in posts" :key="post._id">
      <PostComponent v-if="editing !== post._id" :post="post" @refreshPosts="getPosts" @editPost="updateEditing" />
      <EditPostForm v-else :post="post" @refreshPosts="getPosts" @editPost="updateEditing" />
    </article>
  </section>
  <p v-else-if="loaded">No posts found</p>
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
