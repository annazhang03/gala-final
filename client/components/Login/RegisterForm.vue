<script setup lang="ts">
import router from "@/router";
import { useUserStore } from "@/stores/user";
import { ref } from "vue";

const username = ref("");
const password = ref("");
const role = ref<"Artist" | "Spectator">("Artist");
const { createUser, loginUser, updateSession } = useUserStore();

async function register() {
  await createUser(username.value, password.value, role.value);
  await loginUser(username.value, password.value);
  void updateSession();
  void router.push({ name: "Home" });
}
</script>

<template>
  <form class="pure-form pure-form-aligned" @submit.prevent="register">
    <h3>register</h3>
    <fieldset>
      <div class="pure-control-group">
        <label for="aligned-name">username</label>
        <input v-model.trim="username" type="text" id="aligned-name" placeholder="username" required @keydown.space.prevent />
      </div>
      <div class="pure-control-group">
        <label for="aligned-password">password</label>
        <input type="password" v-model.trim="password" id="aligned-password" placeholder="password" required />
      </div>
      <div class="radio">
        <div class="option">
          <input type="radio" id="artist" value="Artist" v-model="role" :checked="true" required />
          <label for="Artist">artist</label>
        </div>
        <div class="option">
          <input type="radio" id="spectator" value="Spectator" v-model="role" required />
          <label for="Spectator">spectator</label>
        </div>
      </div>

      <div class="pure-controls">
        <button type="submit" class="pure-button pure-button-primary">create</button>
      </div>
    </fieldset>
  </form>
</template>

<style scoped>
.info {
  text-align: center;
  font-family: Cambria, Cochin, Georgia, Times, "Times New Roman", serif;
}

h3 {
  display: flex;
  justify-content: center;
}

.pure-button {
  background-color: var(--cadet);
  border-radius: 8px;
}

.radio {
  display: flex;
  justify-content: center;
}
.option {
  padding: 1em;
  margin-right: 2em;
}

#artist,
#spectator {
  margin-right: 0.5em;
}
</style>
