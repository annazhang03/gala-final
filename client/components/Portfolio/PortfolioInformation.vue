<script setup lang="ts">
import { ref } from "vue";

const expanded = ref(false);

async function toggleExpanded() {
  expanded.value = !expanded.value;
}
</script>
<template>
  <div class="info">
    <button class="btn-small pure-button" @click="toggleExpanded">what's a portfolio?</button>
    <article v-show="expanded">
      GALA portfolios allow artists to order their posts however they see fit, rather than just chronologically. To choose an existing portfolio, select its number from the dropdown at the bottom of
      the page. To create a new portfolio, check the boxes next to the posts you want to include, and enter a number representing the post's placement (1 for the first post, 2 for the second post,
      etc.). Enter a bio, and press the preview button to make sure your portfolio looks good! Then press done at the bottom of the page.
    </article>
  </div>
</template>

<style scoped>
.pure-button {
  background-color: lightgray;
  border-radius: 8px;
}

article {
  margin-top: 0.5em;
  margin-left: 15%;
  margin-right: 15%;
}
</style>
