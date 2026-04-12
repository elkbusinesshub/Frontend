import { Bounce, toast } from "react-toastify";

export const successMessageToast = (message, options = {}) => {
  toast.success(message, {
    ...options,
  });
};

export const errorMessageToast = (message, options = {}) => {
  toast.error(message, {
    ...options,
  });
};