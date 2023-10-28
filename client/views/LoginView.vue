<script setup lang="ts">
import LoginForm from "@/components/Login/LoginForm.vue";
import RegisterForm from "@/components/Login/RegisterForm.vue";
</script>

<template>
  <main class="column">
    <h1>welcome to GALA!</h1>
    <div class="forms">
      <LoginForm />
      <RegisterForm />
    </div>
  </main>
</template>

<style scoped>
h1 {
  font-family: Cambria, Cochin, Georgia, Times, "Times New Roman", serif;
  font-size: 3em;
  display: flex;
  justify-content: center;
  align-items: center;
  font-style: italic;
}

.forms {
  font-family: Cambria, Cochin, Georgia, Times, "Times New Roman", serif;
}
</style>
