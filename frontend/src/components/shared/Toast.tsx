import { toast, ToastOptions } from 'react-toastify';

const centerToast: ToastOptions = {
  position: 'top-right',
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: false,
  pauseOnHover: false,
  draggable: false,
  progress: undefined,
};



export const ToastSuccess = (message: string) => {
  if (message) {
    toast.success(message, centerToast);
  }
};

export const ToastError = (message: string) => {
  if (message) {
    toast.error(message, centerToast);
  }
};

export const ToastInfo = (message: string) => {
  if (message) {
    toast.info(message, centerToast);
  }
};
