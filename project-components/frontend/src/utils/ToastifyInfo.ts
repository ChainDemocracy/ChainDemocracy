import { ToastPosition, toast } from 'react-toastify';

export function notifyInfo(text: string, icon: any, position: ToastPosition) {
   return toast.info(text, {
      position: position,
      icon: icon,
      autoClose: 10000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'light',
      className: 'mt-[55px] px-10'
   });
}
