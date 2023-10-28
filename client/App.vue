<script setup lang="ts">
import { useToastStore } from "@/stores/toast";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { computed, onBeforeMount } from "vue";
import { RouterLink, RouterView, useRoute } from "vue-router";

const currentRoute = useRoute();
const currentRouteName = computed(() => currentRoute.name);
const userStore = useUserStore();
const { isLoggedIn } = storeToRefs(userStore);
const { toast } = storeToRefs(useToastStore());

// Make sure to update the session before mounting the app in case the user is already logged in
onBeforeMount(async () => {
  try {
    await userStore.updateSession();
  } catch {
    // User is not logged in
  }
});
</script>

<template>
  <header>
    <nav>
      <div class="title">
        <img src="@/assets/images/home.png" />
        <RouterLink :to="{ name: 'Home' }" :class="{ underline: currentRouteName == 'Home' }"> home </RouterLink>
      </div>
      <ul v-if="isLoggedIn">
        <img src="@/assets/images/explore.png" />
        <li>
          <RouterLink :to="{ name: 'Explore' }" :class="{ underline: currentRouteName == 'Explore' }"> explore </RouterLink>
        </li>
        <img src="@/assets/images/messages.png" />
        <li>
          <RouterLink :to="{ name: 'Messages' }" :class="{ underline: currentRouteName == 'Messages' }"> messages </RouterLink>
        </li>
        <img src="@/assets/images/profile.png" />
        <li>
          <RouterLink :to="{ name: 'Profile' }" :class="{ underline: currentRouteName == 'Profile' }"> profile </RouterLink>
        </li>
      </ul>
      <ul v-else>
        <img src="@/assets/images/login.png" />
        <li>
          <RouterLink :to="{ name: 'Login' }" :class="{ underline: currentRouteName == 'Login' }"> login </RouterLink>
        </li>
      </ul>
    </nav>
    <article v-if="toast !== null" class="toast" :class="toast.style">
      <p>{{ toast.message }}</p>
    </article>
  </header>
  <RouterView />
</template>

<style scoped>
@import "./assets/toast.css";

nav {
  padding: 1em 2em;
  background-color: var(--taupe);
  display: flex;
  align-items: center;
  height: 2em;
}

h1 {
  font-size: 2em;
  margin: 0;
}

.title {
  display: flex;
  align-items: center;
  gap: 0.5em;
}

img {
  height: 2em;
  padding-right: 0em;
}

a {
  font-size: large;
  color: white;
  text-decoration: none;
}

ul {
  list-style-type: none;
  margin-left: auto;
  display: flex;
  align-items: center;
  flex-direction: row;
  gap: 0.5em;
}

li {
  padding-left: 0em;
  padding-right: 1.5em;
}

.title,
li {
  font-family: Cambria, Cochin, Georgia, Times, "Times New Roman", serif;
}

.underline {
  text-decoration: underline;
}
</style>
