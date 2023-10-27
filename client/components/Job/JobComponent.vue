<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { formatDate } from "@/utils/formatDate";
import { storeToRefs } from "pinia";
import { fetchy } from "../../utils/fetchy";
import JobApplicantsComponent from "./JobApplicantsComponent.vue";
const props = defineProps(["job", "appliedJobs"]);
const emit = defineEmits(["editJob", "refreshJobs"]);
const { currentUsername } = storeToRefs(useUserStore());

const deleteJob = async () => {
  try {
    await fetchy(`api/job/${props.job._id}`, "DELETE");
  } catch {
    return;
  }
  emit("refreshJobs");
};

const applyJob = async () => {
  try {
    await fetchy(`api/job/apply/${props.job._id}`, "PATCH");
  } catch {
    return;
  }
  emit("refreshJobs");
};

const withdrawJob = async () => {
  try {
    await fetchy(`api/job/withdraw/${props.job._id}`, "PATCH");
  } catch {
    return;
  }
  emit("refreshJobs");
};

const markInactive = async () => {
  try {
    await fetchy(`api/job/inactive/${props.job._id}`, "PATCH");
  } catch {
    return;
  }
  emit("refreshJobs");
};
</script>

<template>
  <p class="employer">{{ props.job.employer }}</p>
  <p>{{ props.job.content }}</p>
  <p>status: {{ props.job.status.toLowerCase() }}</p>
  <div v-if="props.job.employer !== currentUsername">
    <p>applicants: {{ job.numApplicants }}</p>
  </div>
  <div v-else>
    <JobApplicantsComponent :job="job" />
  </div>
  <div class="base">
    <menu v-if="props.job.employer == currentUsername">
      <li><button class="btn-small pure-button" @click="emit('editJob', props.job._id)">edit</button></li>
      <li><button class="button-error btn-small pure-button" @click="deleteJob">delete</button></li>
      <li v-if="job.status === 'Active'"><button class="button-error btn-small pure-button" @click="markInactive">mark inactive</button></li>
    </menu>
    <menu v-else>
      <li v-if="props.appliedJobs.includes(props.job._id)"><button class="btn-small pure-button" @click="withdrawJob">withdraw</button></li>
      <li v-else><button class="button-error btn-small pure-button" @click="applyJob">apply</button></li>
    </menu>
    <article class="timestamp">
      <p v-if="props.job.dateCreated !== props.job.dateUpdated">Edited on: {{ formatDate(props.job.dateUpdated) }}</p>
      <p v-else>Created on: {{ formatDate(props.job.dateCreated) }}</p>
    </article>
  </div>
</template>

<style scoped>
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
