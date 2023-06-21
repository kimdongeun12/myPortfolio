import { useEffect } from "react";
import { removeCookie } from "./useCookie";

const useBeforeUnload = () => {
  if(typeof window === 'undefined') return;
  const listener = (event : BeforeUnloadEvent) => {
    event.preventDefault();
    event.returnValue = "";
    removeCookie('visual');
  };
  window.addEventListener("unload", listener);
};
 
export default useBeforeUnload;
