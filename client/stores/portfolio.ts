import { defineStore } from "pinia";
import { ref } from "vue";

export const usePortfolioStore = defineStore(
  "portfolio",
  () => {
    const currentOrder = ref<Array<Record<string, string>>>([]);

    const updateOrder = (order: any) => {
      currentOrder.value = order;
    };

    return {
      currentOrder,
      updateOrder,
    };
  },
  { persist: true },
);
