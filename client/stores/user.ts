import { defineStore } from "pinia";
import { computed, ref } from "vue";

import { BodyT, fetchy } from "@/utils/fetchy";

export const useUserStore = defineStore(
  "user",
  () => {
    const currentUsername = ref("");
    const currentRole = ref<"Artist" | "Spectator">("Artist");

    const isLoggedIn = computed(() => currentUsername.value !== "");

    const resetStore = () => {
      currentUsername.value = "";
      currentRole.value = "Artist";
    };

    const createUser = async (username: string, password: string, role: "Artist" | "Spectator" = "Artist") => {
      await fetchy("api/users", "POST", {
        body: { username, password, role },
      });
    };

    const loginUser = async (username: string, password: string) => {
      await fetchy("api/login", "POST", {
        body: { username, password },
      });
    };

    const updateSession = async () => {
      try {
        const { username, role } = await fetchy("api/session", "GET", { alert: false });
        currentUsername.value = username;
        currentRole.value = role;
      } catch {
        currentUsername.value = "";
        currentRole.value = "Artist";
      }
    };

    const logoutUser = async () => {
      await fetchy("api/logout", "POST");
      resetStore();
    };

    const updateUser = async (patch: BodyT) => {
      await fetchy("api/users", "PATCH", { body: { update: patch } });
    };

    const deleteUser = async () => {
      await fetchy("api/users", "DELETE");
      resetStore();
    };

    return {
      currentUsername,
      currentRole,
      isLoggedIn,
      createUser,
      loginUser,
      updateSession,
      logoutUser,
      updateUser,
      deleteUser,
    };
  },
  { persist: true },
);
