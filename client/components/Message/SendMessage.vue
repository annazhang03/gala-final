<script setup lang="ts">
import router from "@/router";
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const content = ref("");
const to = ref("");
const emit = defineEmits(["refreshMessages"]);
const props = defineProps(["user"]);

const sendMessage = async (content: string, to: string) => {
  try {
    await fetchy("api/messages", "POST", {
      body: { to, content },
    });
  } catch (_) {
    return;
  }
  emit("refreshMessages");
  emptyForm();
  await toUser(to);
};

const emptyForm = () => {
  content.value = "";
  to.value = "";
};

async function toUser(u: string) {
  void router.push({ path: "/messages", query: { username: u } });
}
</script>

<template>
  <form v-if="!props.user" @submit.prevent="sendMessage(content, to)">
    <label for="content">send message:</label>
    <input id="to" v-model="to" placeholder="username" required />
    <textarea id="content" v-model="content" placeholder="write a message" required> </textarea>
    <button type="submit" class="pure-button-primary pure-button">send message</button>
  </form>
  <form v-else @submit.prevent="sendMessage(content, props.user)">
    <label for="content">send message to {{ props.user }}:</label>
    <textarea id="content" v-model="content" placeholder="write a message" required> </textarea>
    <button type="submit" class="pure-button-primary pure-button">send message</button>
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
</style>
