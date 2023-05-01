import { useState, useEffect, RefObject } from 'react';

export const useFocus = (ref: RefObject<HTMLDivElement>) => {
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [ref]);

  return { isFocused, setIsFocused };
};
