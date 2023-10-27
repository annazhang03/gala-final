<script setup lang="ts">
import SendMessageForm from "@/components/Message/SendMessage.vue";
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import MessageComponent from "./MessageComponent.vue";

const { isLoggedIn } = storeToRefs(useUserStore());

const loaded = ref(false);
let messages = ref<Array<Record<string, string>>>([]);
const props = defineProps(["user"]);

async function getMessages(user2?: string) {
  let messageResults;
  if (user2) {
    try {
      messageResults = await fetchy(`/api/messages/${user2}`, "GET");
    } catch (_) {
      return;
    }
  } else {
    try {
      messageResults = await fetchy("api/messages", "GET");
    } catch (_) {
      return;
    }
  }
  messages.value = messageResults;
}

onBeforeMount(async () => {
  if (props.user) {
    await getMessages(props.user);
  } else {
    await getMessages();
  }
  loaded.value = true;
});
</script>

<template>
  <section v-if="isLoggedIn">
    <h2>send a message:</h2>
    <SendMessageForm @refreshMessages="getMessages(props.user)" :user="props.user" />
  </section>
  <div class="row">
    <h2>messages with {{ $props.user }}:</h2>
  </div>
  <section class="messages" v-if="loaded && messages.length !== 0">
    <article v-for="message in messages" :key="message._id">
      <MessageComponent :message="message" />
    </article>
  </section>
  <p v-else-if="loaded">no message yet!</p>
  <p v-else>loading...</p>
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
