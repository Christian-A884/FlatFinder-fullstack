import { ReactNode, createContext, useContext } from "react";
import toast, { Toaster } from "react-hot-toast";



//  interface ToastContextType {
//   toastSuccess: (message: string, options?: ToastOptions) => void;
//   toastError: (message: string, options?: ToastOptions) => void;
//   toastWarning: (message: string, options?: ToastOptions) => void;
//   toastInfo: (message: string, options?: ToastOptions) => void;
// }



const ToastContext = createContext()

export const useToast = () => useContext(ToastContext);

export const ToastProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const showToast = (message:string, options) => toast(message, options);
  
  

  const toastSuccess = (message:string, options) =>
    showToast(message, { ...options, type: "success" });
  const toastError = (message:string, options) =>
    showToast(message, { ...options, type: "error" });
  const toastWarning = (message:string, options) =>
    showToast(message, { ...options, type: "warning" });
  const toastInfo = (message:string, options) =>
    showToast(message, { ...options, type: "info" });

  return (
    <ToastContext.Provider
      value={{ toastSuccess, toastError, toastWarning, toastInfo }}
    >
      {children}
     <Toaster/>
    </ToastContext.Provider>
  );
};
