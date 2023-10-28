<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import CreateJobForm from "./CreateJobForm.vue";
import EditJobForm from "./EditJobForm.vue";
import JobComponent from "./JobComponent.vue";
import SearchJobForm from "./SearchJobForm.vue";

const props = defineProps(["own", "employer"]);

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());
let editing = ref("");
let searchEmployer = ref("");
let hideInactiveJobs = ref(true);
let showOnlyAppliedJobs = ref(false);

const loaded = ref(false);
let jobs = ref<Array<Record<string, string>>>([]);
let appliedJobs = ref<Array<Record<string, string>>>([]);

async function getJobs(employer?: string) {
  let query: Record<string, string> = {};
  if (employer) {
    query = { employer: employer };
  }
  let jobResults;
  try {
    jobResults = await fetchy("/api/jobs", "GET", { query });
  } catch (_) {
    return;
  }
  searchEmployer.value = employer ? employer : "";
  jobs.value = jobResults;
  if (showOnlyAppliedJobs.value) {
    jobs.value = appliedJobs.value;
  }
  if (hideInactiveJobs.value) {
    jobs.value = jobs.value.filter((j: any) => j.status === "Active");
  }
}

async function getAppStatus() {
  let jobResults;
  try {
    jobResults = await fetchy("/api/jobs/applied", "GET");
  } catch (_) {
    return;
  }
  appliedJobs.value = jobResults;
}

async function getJobsAndStatus() {
  await getAppStatus();
  if (props.own) {
    await getJobs(currentUsername.value);
  } else if (props.employer) {
    await getJobs(props.employer);
  } else {
    await getJobs();
  }
}

function updateEditing(id: string) {
  editing.value = id;
}

async function toggleActivePref() {
  hideInactiveJobs.value = !hideInactiveJobs.value;
  await getJobsAndStatus();
}

async function toggleAppliedPref() {
  showOnlyAppliedJobs.value = !showOnlyAppliedJobs.value;
  await getJobsAndStatus();
}

onBeforeMount(async () => {
  await getJobsAndStatus();
  loaded.value = true;
});
</script>

<template>
  <div class="jobsList">
    <section v-if="isLoggedIn && !props.employer">
      <h2>post a job:</h2>
      <CreateJobForm @refreshJobs="getJobs" />
    </section>
    <div class="row">
      <h2 v-if="props.own">your jobs</h2>
      <h2 v-else-if="!searchEmployer">jobs:</h2>
      <h2 v-else>jobs from {{ searchEmployer }}:</h2>
      <SearchJobForm v-if="!props.own && !props.employer" @getJobsByEmployer="getJobs" />
    </div>
    <section class="jobs" v-if="loaded && jobs.length !== 0">
      <div class="row">
        <div v-if="isLoggedIn && !props.own">
          <button v-if="hideInactiveJobs" class="btn-small pure-button" @click="toggleActivePref">show active and inactive jobs</button>
          <button v-else class="btn-small pure-button" @click="toggleActivePref">show only active jobs</button>
        </div>
        <div v-if="isLoggedIn && !props.own">
          <button v-if="showOnlyAppliedJobs" class="btn-small pure-button" @click="toggleAppliedPref">show all jobs</button>
          <button v-else class="btn-small pure-button" @click="toggleAppliedPref">show only applied jobs</button>
        </div>
      </div>
      <article v-for="job in jobs" :key="job._id">
        <JobComponent v-if="editing !== job._id" :job="job" :appliedJobs="appliedJobs.map((j: any) => j._id)" @refreshJobs="getJobsAndStatus" @editJob="updateEditing" />
        <EditJobForm v-else :job="job" @refreshJobs="getJobsAndStatus" @editJob="updateEditing" />
      </article>
    </section>
    <section v-else>
      <h3 v-if="loaded">no jobs found</h3>
      <h3 v-else>loading...</h3>
    </section>
  </div>
</template>

<style scoped>
.pure-button {
  border-radius: 8px;
  margin-bottom: 0.5em;
  background-color: var(--violet);
  font-size: 1em;
  margin-left: 0.5em;
  margin-right: 0.5em;
  color: white;
}

.jobsList {
  font-family: Cambria, Cochin, Georgia, Times, "Times New Roman", serif;
  padding-bottom: 2em;
}

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

.posts {
  padding: 1em;
}

.row {
  display: flex;
  justify-content: space-between;
  margin: 0 auto;
  max-width: 60em;
}
</style>
