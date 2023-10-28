<script setup lang="ts">
import UserComponent from "@/components/User/UserComponent.vue";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { fetchy } from "../../utils/fetchy";

const props = defineProps(["request"]);
const emit = defineEmits(["refreshRequests"]);
const { currentUsername } = storeToRefs(useUserStore());

const rejectConnection = async () => {
  try {
    await fetchy(`api/connection/reject/${props.request.from}`, "PUT");
  } catch {
    return;
  }
  emit("refreshRequests");
};

const acceptConnection = async () => {
  try {
    await fetchy(`api/connection/accept/${props.request.from}`, "PUT");
  } catch {
    return;
  }
  emit("refreshRequests");
};

const deleteConnection = async () => {
  try {
    await fetchy(`api/connection/requests/${props.request.to}`, "DELETE");
  } catch {
    return;
  }
  emit("refreshRequests");
};
</script>

<template>
  <div v-if="props.request.to == currentUsername">
    <p class="author"><UserComponent :user="props.request.from" /></p>
    <div class="base">
      <menu>
        <li><button class="btn-small pure-button" @click="acceptConnection">accept</button></li>
        <li><button class="button-error btn-small pure-button" @click="rejectConnection">reject</button></li>
      </menu>
    </div>
  </div>
  <div v-else>
    <p class="author"><UserComponent :user="props.request.to" /></p>
    <div class="base">
      <menu>
        <li><button class="button-error btn-small pure-button" @click="deleteConnection">delete</button></li>
      </menu>
    </div>
  </div>
</template>

<style scoped>
p {
  margin: 0em;
}

.base .pure-button {
  margin-top: 0.5em;
  background-color: var(--cadet);
  border-radius: 8px;
  width: auto;
  font-size: 0.9em;
}
.base .button-error {
  background-color: var(--violet);
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
