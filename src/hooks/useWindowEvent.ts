import { useEffect, useState } from "react";
import { removeCookie } from "@/lib/cookie";

const useBeforeUnload = () => {
  if(typeof window === 'undefined') return;
  const listener = (event : BeforeUnloadEvent) => {
    event.preventDefault();
    event.returnValue = "";
    removeCookie('visual');
  };
  window.addEventListener("unload", listener);
};

const useWindowResize = () => {
  const getSize = () => ({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const [windowSize, setWindowSize] = useState(() =>
    typeof window !== 'undefined' ? getSize() : { width: 0, height: 0 }
  );

  useEffect(() => {
    const handleResize = () => setWindowSize(getSize());

    window.addEventListener('resize', handleResize);
    // 초기 사이즈 설정
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return windowSize;

};
 
export {
  useBeforeUnload,
  useWindowResize
};
