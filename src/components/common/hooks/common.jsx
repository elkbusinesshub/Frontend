import { Bounce, toast } from "react-toastify";
import { useState, useEffect } from "react";

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

export const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
};