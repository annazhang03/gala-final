<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import { fetchy } from "../../utils/fetchy";
import ConnectWithUserComponent from "./ConnectWithUserComponent.vue";
import FavoriteWithUserComponent from "./FavoriteWithUserComponent.vue";

const props = defineProps(["username"]);
const { currentUsername } = storeToRefs(useUserStore());
const connectStatus = ref<"connected" | "pendingCurr" | "pendingUser" | "notConnected">("notConnected");
const favoriteStatus = ref(false);
const fanStatus = ref(false);
const loaded = ref(false);

async function getConnectStatus() {
  let results;
  try {
    results = await fetchy("/api/connections", "GET");
  } catch (_) {
    return;
  }
  if (results.includes(props.username)) {
    connectStatus.value = "connected";
  } else {
    try {
      results = await fetchy("/api/connection/requests", "GET");
    } catch (_) {
      return;
    }
    const incoming = results.filter((r: any) => r.to === currentUsername.value && r.status === "pending").map((r: any) => r.from);
    if (incoming.includes(props.username)) {
      connectStatus.value = "pendingCurr";
    } else {
      const outgoing = results.filter((r: any) => r.from === currentUsername.value && r.status === "pending").map((r: any) => r.to);
      if (outgoing.includes(props.username)) {
        connectStatus.value = "pendingUser";
      } else {
        connectStatus.value = "notConnected";
      }
    }
  }
}

async function getFavoriteStatus() {
  let results;
  try {
    results = await fetchy("/api/favorites", "GET");
  } catch (_) {
    return;
  }
  if (results.includes(props.username)) {
    favoriteStatus.value = true;
  } else {
    favoriteStatus.value = false;
  }
  try {
    results = await fetchy("/api/fans", "GET");
  } catch (_) {
    return;
  }
  if (results.includes(props.username)) {
    fanStatus.value = true;
  } else {
    fanStatus.value = false;
  }
}

async function getStatus() {
  await getConnectStatus();
  await getFavoriteStatus();
}

onBeforeMount(async () => {
  await getStatus();
  loaded.value = true;
});
</script>

<template>
  <div class="base">
    <div class="connect">
      <ConnectWithUserComponent :username="props.username" :status="connectStatus" @refresh="getStatus" />
    </div>
    <FavoriteWithUserComponent :username="props.username" :favoriteStatus="favoriteStatus" :fanStatus="fanStatus" @refresh="getStatus" />
  </div>
</template>

<style scoped>
.connect {
  margin-right: 3em;
}
.base {
  display: flex;
  justify-content: center;
}
</style>
