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
  isMaximize: false,
  setIsMaximize: (value) => set(() => ({ isMaximize: value }))
});

const downloadStore = (set) => ({
  downloadStatistic: [],
  setDownloadStatistic: (value) => set(() => ({ downloadStatistic: value }))
});

export const useCreateModalStore = create(createModalStore);
export const useResourcesStore = create(resourcesStore);
export const useModalSizeStore = create(modalSizeStore);
export const useDownloadStore = create(downloadStore);