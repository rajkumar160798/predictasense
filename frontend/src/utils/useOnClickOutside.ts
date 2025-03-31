// src/utils/useOnClickOutside.ts
import { useEffect } from "react";

function useOnClickOutside<T extends HTMLDivElement>(ref: React.RefObject<T>, handler: () => void)   {
  useEffect(() => {
    const listener = (event: MouseEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) return;
      handler();
    };
    document.addEventListener("mousedown", listener);
    return () => document.removeEventListener("mousedown", listener);
  }, [ref, handler]);
}
export default useOnClickOutside;
// This custom hook allows you to detect clicks outside of a specified element.
// It takes a ref to the element and a handler function to call when a click outside is detected.