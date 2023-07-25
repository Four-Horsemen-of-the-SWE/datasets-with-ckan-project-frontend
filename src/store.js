import { create } from "zustand";

const createModalStore = (set) => ({
  isCreateModalShow: false,
  setIsCreateModalShow: (value) =>
    set(() => ({ isCreateModalShow: value })),
});

const resourcesStore = (set) => ({
  resources: [],
  setResources: (value) => set(() => ({ resources: value })),
});

export const useCreateModalStore = create(createModalStore);
export const useResourcesStore = create(resourcesStore);