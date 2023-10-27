<script setup lang="ts">
import { onBeforeMount, ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const props = defineProps(["job"]);
const applicants = ref({ apps: [], is_expand: false });
const loaded = ref(false);

async function getApplicants() {
  let results;
  try {
    results = await fetchy(`/api/job/applicants/${props.job._id}`, "GET");
  } catch {
    return;
  }
  applicants.value.apps = results.applicants;
}

onBeforeMount(async () => {
  await getApplicants();
  loaded.value = true;
});
</script>
<template>
  <section class="jobs" v-if="loaded && applicants.apps.length !== 0">
    <label @click="applicants.is_expand = !applicants.is_expand">applicants: {{ job.numApplicants }} (click to view)</label>
    <article v-for="applicant in applicants.apps" class="min-item" v-show="applicants.is_expand" :key="applicant">
      {{ applicant }}
    </article>
  </section>
  <p v-else-if="loaded">applicants: 0</p>
  <p v-else>loading...</p>
</template>

<style scoped>
.min-item {
  display: flex;
}
</style>
