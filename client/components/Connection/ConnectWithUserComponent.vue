<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { fetchy } from "../../utils/fetchy";

const props = defineProps(["username", "status"]);
const emit = defineEmits(["refresh"]);
const { currentUsername } = storeToRefs(useUserStore());

const rejectConnection = async () => {
  try {
    await fetchy(`api/connection/reject/${props.username}`, "PUT");
  } catch {
    return;
  }
  emit("refresh");
};

const acceptConnection = async () => {
  try {
    await fetchy(`api/connection/accept/${props.username}`, "PUT");
  } catch {
    return;
  }
  emit("refresh");
};

const sendConnectionRequest = async () => {
  try {
    await fetchy(`api/connection/requests/${props.username}`, "POST");
  } catch {
    return;
  }
  emit("refresh");
};

const deleteConnectionRequest = async () => {
  try {
    await fetchy(`api/connection/requests/${props.username}`, "DELETE");
  } catch {
    return;
  }
  emit("refresh");
};

const removeConnection = async () => {
  try {
    await fetchy(`api/connections/${props.username}`, "DELETE");
  } catch {
    return;
  }
  emit("refresh");
};
</script>

<template>
  <div class="base">
    <menu>
      <li v-if="props.status === 'connected'"><button class="button-error btn-small pure-button" @click="removeConnection">disconnect</button></li>
      <div v-else-if="props.status === 'pendingCurr'">
        <li><button class="btn-small pure-button" @click="acceptConnection">accept connection request</button></li>
        <li><button class="button-error btn-small pure-button" @click="rejectConnection">reject connection request</button></li>
      </div>
      <li v-else-if="props.status === 'pendingUser'"><button class="button-error btn-small pure-button" @click="deleteConnectionRequest">delete connection request</button></li>
      <li v-else><button class="btn-small pure-button" @click="sendConnectionRequest">connect</button></li>
    </menu>
  </div>
</template>

<style scoped>
p {
  margin: 0em;
}

.author {
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
