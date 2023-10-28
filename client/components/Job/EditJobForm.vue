<script setup lang="ts">
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";
import { formatDate } from "../../utils/formatDate";

const props = defineProps(["job"]);
const content = ref(props.job.content);
const emit = defineEmits(["editJob", "refreshJobs"]);

const editJob = async (content: string) => {
  try {
    await fetchy(`api/job/update/${props.job._id}`, "PATCH", { body: { update: { content: content } } });
  } catch (e) {
    return;
  }
  emit("editJob");
  emit("refreshJobs");
};
</script>

<template>
  <form @submit.prevent="editJob(content)">
    <p class="author">{{ props.job.employer }}</p>
    <textarea id="content" v-model="content" placeholder="Post a job!" required> </textarea>
    <div class="base">
      <menu>
        <li><button class="btn-small pure-button-primary pure-button" type="submit">Save</button></li>
        <li><button class="button-error btn-small pure-button" @click="emit('editJob')">Cancel</button></li>
      </menu>
      <p v-if="props.job.dateCreated !== props.job.dateUpdated" class="timestamp">Edited on: {{ formatDate(props.job.dateUpdated) }}</p>
      <p v-else class="timestamp">Created on: {{ formatDate(props.job.dateCreated) }}</p>
    </div>
  </form>
</template>

<style scoped>
form {
  background-color: var(--base-bg);
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding: 1em;
}
.base .pure-button {
  background-color: white;
  border-radius: 8px;
  margin-bottom: 0.5em;
  border-color: rgb(137, 136, 136);
  color: black;
}

.base .button-error {
  background-color: rgb(137, 136, 136);
  color: white;
}

textarea {
  font-family: inherit;
  font-size: inherit;
  height: 6em;
  border-radius: 10px;
  resize: none;
  border: none;
  padding: 0.5em;
}

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

.base {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.timestamp {
  display: flex;
  justify-content: flex-end;
  font-size: 0.9em;
  font-style: italic;
}
</style>
