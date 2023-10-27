import { storeToRefs } from "pinia";
import { createRouter, createWebHistory } from "vue-router";

import { useUserStore } from "@/stores/user";
import AllMessagesView from "../views/AllMessagesView.vue";
import ConnectionsView from "../views/ConnectionsView.vue";
import CreatePortfolioView from "../views/CreatePortfolioView.vue";
import FavoritesView from "../views/FavoritesView.vue";
import HomeView from "../views/HomeView.vue";
import JobsView from "../views/JobsView.vue";
import LoginView from "../views/LoginView.vue";
import NotFoundView from "../views/NotFoundView.vue";
import PortfoliosView from "../views/PortfoliosView.vue";
import ProfileView from "../views/ProfileView.vue";
import SettingView from "../views/SettingView.vue";
import UsersView from "../views/UsersView.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "Home",
      component: HomeView,
    },
    {
      path: "/setting",
      name: "Settings",
      component: SettingView,
      meta: { requiresAuth: true },
    },
    {
      path: "/login",
      name: "Login",
      component: LoginView,
      meta: { requiresAuth: false },
      beforeEnter: (to, from) => {
        const { isLoggedIn } = storeToRefs(useUserStore());
        if (isLoggedIn.value) {
          return { name: "Settings" };
        }
      },
    },
    {
      path: "/profile",
      name: "Profile",
      component: ProfileView,
      meta: { requiresAuth: true },
    },
    {
      path: "/users",
      name: "Users",
      component: UsersView,
      meta: { requiresAuth: true },
    },
    {
      path: "/jobs",
      name: "Jobs",
      component: JobsView,
      meta: { requiresAuth: true },
    },
    {
      path: "/portfolios",
      name: "Portfolios",
      component: PortfoliosView,
      meta: { requiresAuth: true },
    },
    {
      path: "/create",
      name: "Create Portfolio",
      component: CreatePortfolioView,
      meta: { requiresAuth: true },
    },
    {
      path: "/messages",
      name: "Messages",
      component: AllMessagesView,
      meta: { requiresAuth: true },
    },
    {
      path: "/connections",
      name: "Connections",
      component: ConnectionsView,
      meta: { requiresAuth: true },
    },
    {
      path: "/favorites",
      name: "Favorites",
      component: FavoritesView,
      meta: { requiresAuth: true },
    },
    {
      path: "/:catchAll(.*)",
      name: "not-found",
      component: NotFoundView,
    },
  ],
});

/**
 * Navigation guards to prevent user from accessing wrong pages.
 */
router.beforeEach((to, from) => {
  const { isLoggedIn } = storeToRefs(useUserStore());

  if (to.meta.requiresAuth && !isLoggedIn.value) {
    return { name: "Login" };
  }
});

export default router;
