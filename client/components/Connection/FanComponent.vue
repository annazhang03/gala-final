<script setup lang="ts">
import UserComponent from "@/components/User/UserComponent.vue";
import { fetchy } from "../../utils/fetchy";

const props = defineProps(["fan"]);
const emit = defineEmits(["refreshFans"]);

const removeFan = async () => {
  try {
    await fetchy(`api/fans/${props.fan}`, "DELETE");
  } catch {
    return;
  }
  emit("refreshFans");
};
</script>

<template>
  <p class="author"><UserComponent :user="props.fan" /></p>
  <div class="base">
    <menu>
      <li><button class="button-error btn-small pure-button" @click="removeFan">remove fan</button></li>
    </menu>
  </div>
</template>

<style scoped>
p {
  margin: 0em;
}
.base .pure-button {
  background-color: var(--violet);
  border-radius: 8px;
  width: auto;
  font-size: 0.9em;
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
