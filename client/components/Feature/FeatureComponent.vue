<script setup lang="ts">
import FeatureAppComponent from "@/components/Feature/FeatureAppComponent.vue";
import PostListComponent from "@/components/Post/PostListComponent.vue";
import UserComponent from "@/components/User/UserComponent.vue";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const { currentUsername } = storeToRefs(useUserStore());
let featuredArtist = ref<Record<string, string>>({});
let status = ref(false);
const loaded = ref(false);

async function getStatus() {
  let featureResults;
  try {
    featureResults = await fetchy(`/api/feature/${currentUsername}`, "GET");
  } catch (_) {
    return;
  }
  status.value = featureResults;
}

async function getFeature() {
  await getStatus();
  let featureResults;
  try {
    featureResults = await fetchy("/api/featured", "GET");
    featuredArtist.value = featureResults;
  } catch (_) {
    return;
  }
}

onBeforeMount(async () => {
  await getFeature();
  loaded.value = true;
});
</script>

<template>
  <div class="feature">
    <FeatureAppComponent :applied="status" @refreshFeature="getFeature" />
    <div v-if="!featuredArtist.owner"><h2>no active applicants for featured artist!</h2></div>
    <div v-else>
      <h2><UserComponent :user="featuredArtist.owner" /></h2>
      <PostListComponent :isPortfolio="true" :owner="featuredArtist.owner" :featured="true" />
    </div>
  </div>
</template>

<style scoped>
.feature {
  font-family: Cambria, Cochin, Georgia, Times, "Times New Roman", serif;
}
h2 {
  text-align: center;
}
p {
  margin: 0em;
}

.employer {
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
