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

const modalSizeStore = (set) => ({
  isMaximize: true,
  setIsMaximize: (value) => set(() => ({ isMaximize: value }))
});

export const useCreateModalStore = create(createModalStore);
export const useResourcesStore = create(resourcesStore);
export const useModalSizeStore = create(modalSizeStore);