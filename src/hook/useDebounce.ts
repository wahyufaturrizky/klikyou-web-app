import { useEffect, useState } from "react";

const useDebounce = (value: any, delay: any) => {
  const [debounceValue, setDebounceValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebounceValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, delay]);

  return debounceValue;
};

export default useDebounce;
