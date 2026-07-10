import { create } from "zustand";

export interface NotificationToast {
  key: number;
  type: "DM" | "FRIEND_REQUEST";
  title: string;
  message: string;
  imageUrl: string;
  href?: string;
}

interface NotificationToastState {
  toasts: NotificationToast[];
  addToast: (toast: Omit<NotificationToast, "key">) => void;
  removeToast: (key: number) => void;
}

export const useNotificationToastStore = create<NotificationToastState>((set) => ({
  toasts: [],
  addToast: (toast) =>
    set((state) => ({
      toasts: [...state.toasts, { ...toast, key: Date.now() }],
    })),
  removeToast: (key) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.key !== key),
    })),
}));
