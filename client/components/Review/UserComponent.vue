<script setup lang="ts">
import UserReviewsComponent from "./UserReviewsComponent.vue";

const props = defineProps(["user"]);
</script>

<template>
  <p class="username">{{ props.user.username }}</p>
  <UserReviewsComponent :user="props.user" />
</template>

<style scoped>
p {
  margin: 0em;
}

.username {
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
