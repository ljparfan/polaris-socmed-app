import { toast, ToastOptions } from "react-toastify";
import { Alert } from "../models/alert.model";

const defaultToastOptions: ToastOptions = {
  position: "top-right",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
};

export const openToast = (alert: Alert, options = defaultToastOptions) => {
  switch (alert.type) {
    case "error":
      toast.error(alert.message, { ...options, autoClose: alert.durationInMs });
      break;

    case "info":
      toast.error(alert.message, { ...options, autoClose: alert.durationInMs });
      break;

    case "success":
      toast.success(alert.message, {
        ...options,
        autoClose: alert.durationInMs,
      });
      break;

    case "warning":
      toast.warning(alert.message, {
        ...options,
        autoClose: alert.durationInMs,
      });
      break;
  }
};
