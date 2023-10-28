<script setup lang="ts">
import SendMessageForm from "@/components/Message/SendMessage.vue";
import router from "@/router";
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import MessageComponent from "./MessageComponent.vue";

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());

const loaded = ref(false);
let users = ref<Array<Record<string, string>>>([]);
let latestMessages = ref<Array<Record<string, string>>>([]);

async function getUsersMessaged() {
  let messageResults;
  try {
    messageResults = await fetchy("/api/messages", "GET");
  } catch (_) {
    return;
  }
  const allUsers = messageResults.map((m: any) => (m.to === currentUsername.value ? m.from : m.to));
  users.value = allUsers.filter((item: any, pos: any) => allUsers.indexOf(item) === pos);
  latestMessages.value = messageResults.filter((item: any, pos: any) => allUsers.indexOf(item.to === currentUsername.value ? item.from : item.to) === pos);
}

onBeforeMount(async () => {
  await getUsersMessaged();
  loaded.value = true;
});

const toUser = async (u: string) => {
  void router.push({ path: "/messages", query: { username: u } });
};
</script>

<template>
  <div class="messagesList">
    <section v-if="isLoggedIn">
      <h2>send a message:</h2>
      <SendMessageForm @refreshMessages="getUsersMessaged" />
    </section>
    <div class="row">
      <h2>messages:</h2>
    </div>
    <section class="messages" v-if="loaded && users.length !== 0">
      <article v-for="message in latestMessages" :key="message._id">
        <button class="btn-small pure-button" @click="toUser((message.to === currentUsername ? message.from : message.to).toString())">
          <p class="author">{{ message.to === currentUsername ? message.from : message.to }}</p>
        </button>
        <MessageComponent :message="message" />
      </article>
    </section>
    <section v-else>
      <p v-if="loaded">no messages yet!</p>
      <p v-else>loading...</p>
    </section>
  </div>
</template>

<style scoped>
.messagesList {
  font-family: Cambria, Cochin, Georgia, Times, "Times New Roman", serif;
  padding-bottom: 2em;
}
section {
  display: flex;
  flex-direction: column;
  gap: 1em;
}
.pure-button {
  border-radius: 8px;
  width: auto;
  font-size: 0.9em;
  color: white;
  background-color: var(--taupe);
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

.messages {
  padding: 1em;
}

.row {
  display: flex;
  justify-content: space-between;
  margin: 0 auto;
  max-width: 60em;
}
</style>
