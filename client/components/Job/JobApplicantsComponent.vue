<script setup lang="ts">
import UserComponent from "@/components/User/UserComponent.vue";
import { onBeforeMount, ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const props = defineProps(["job"]);
const applicants = ref({ apps: [], is_expand: false });
const loaded = ref(false);
const expanded = ref(false);

async function getApplicants() {
  let results;
  try {
    results = await fetchy(`/api/job/applicants/${props.job._id}`, "GET");
  } catch {
    return;
  }
  applicants.value.apps = results.applicants;
}

async function toggleExpanded() {
  expanded.value = !expanded.value;
}

onBeforeMount(async () => {
  await getApplicants();
  loaded.value = true;
});
</script>
<template>
  <div class="applicants">
    <section class="jobs" v-if="loaded && applicants.apps.length !== 0">
      <button class="btn-small pure-button" @click="toggleExpanded">applicants: {{ job.numApplicants }}</button>
      <article v-for="applicant in applicants.apps" class="min-item" v-show="expanded" :key="applicant">
        <UserComponent style="background-color: lightgray" :user="applicant" />
      </article>
    </section>
    <p v-else-if="loaded">no applicants yet!</p>
    <p v-else>loading...</p>
  </div>
</template>

<style scoped>
.min-item {
  display: flex;
}

.applicants {
  font-family: Cambria, Cochin, Georgia, Times, "Times New Roman", serif;
}

.pure-button {
  background-color: lightgray;
  border-radius: 8px;
}

article {
  margin-top: 0.5em;
}
</style>
