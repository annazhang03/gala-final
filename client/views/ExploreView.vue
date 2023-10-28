<script setup lang="ts"></script>

<template>
  <main>
    <div class="explore">
      <RouterLink :to="{ name: 'Posts' }">
        <div class="item" id="posts">posts</div>
      </RouterLink>
      <RouterLink :to="{ name: 'Jobs' }">
        <div class="item" id="jobs">jobs</div>
      </RouterLink>
      <RouterLink :to="{ name: 'Users' }">
        <div class="item" id="people">people</div>
      </RouterLink>
    </div>
  </main>
</template>

<style scoped>
.explore {
  text-align: center;
  font-family: Cambria, Cochin, Georgia, Times, "Times New Roman", serif;
  display: flex;
  justify-content: center;
  padding-top: 4em;
  font-size: 2em;
  text-decoration: none;
}

.item {
  padding: 3em;
  border-radius: 5px;
  margin: 1em;
  color: white;
}

#posts {
  background-color: var(--cadet);
}

#jobs {
  background-color: var(--cadet);
}

#people {
  background-color: var(--cadet);
}
</style>
