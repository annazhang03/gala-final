<script setup lang="ts">
import { fetchy } from "@/utils/fetchy";
import { onBeforeMount, ref } from "vue";
import SearchUserForm from "./SearchUserForm.vue";
import UserComponent from "./UserComponent.vue";

const loaded = ref(false);
let users = ref<Array<Record<string, string>>>([]);
let searchUser = ref("");

async function getUsers(username?: string) {
  let query: Record<string, string> = username !== undefined ? { username } : {};
  let userResults;
  try {
    userResults = await fetchy("/api/users", "GET", { query });
  } catch (_) {
    return;
  }
  searchUser.value = username ? username : "";
  users.value = userResults;
}

onBeforeMount(async () => {
  await getUsers();
  loaded.value = true;
});
</script>

<template>
  <div class="users">
    <div class="row">
      <h2 v-if="!searchUser">all users:</h2>
      <h2 v-else>{{ searchUser }}:</h2>
      <SearchUserForm @getUserByUsername="getUsers" />
    </div>
    <section class="users" v-if="loaded && users.length !== 0">
      <article v-for="user in users" :key="user._id">
        <UserComponent :user="user.username" @refreshUsers="getUsers" />
      </article>
    </section>
    <p v-else-if="loaded">no users found</p>
    <p v-else>loading...</p>
  </div>
</template>

<style scoped>
.users {
  font-family: Cambria, Cochin, Georgia, Times, "Times New Roman", serif;
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

.users {
  padding: 1em;
}

.row {
  display: flex;
  justify-content: space-between;
  margin: 0 auto;
  max-width: 60em;
}
</style>
