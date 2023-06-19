import { create } from "zustand";

const createModalStore = (set) => ({
  isCreateModalShow: false,
  setIsCreateModalShow: (value) =>
    set(() => ({ isCreateModalShow: value })),
});

export const useCreateModalStore = create(createModalStore);
