import { useState, useEffect, useMemo } from "react";
import debounce from "lodash.debounce";

export function useDebouncedValue<T>(
  value: T,
  wait: number,
): [
  T,
  {
    cancel: () => void;
    flush: () => void;
  },
] {
  const [debouncedValue, setDebouncedValue] = useState(value);

  // Create a stable debounced function with useMemo
  const debouncedCallback = useMemo(() => {
    return debounce((newValue: T) => {
      setDebouncedValue(newValue);
    }, wait);
  }, [wait, setDebouncedValue]);

  // Update the debounced value when the input value changes
  useEffect(() => {
    debouncedCallback(value);

    // Cleanup function to cancel debounce when the component unmounts
    return () => debouncedCallback.cancel();
  }, [value, debouncedCallback]);

  const controls = useMemo(
    () => ({
      cancel: debouncedCallback.cancel,
      flush: debouncedCallback.flush,
    }),
    [debouncedCallback],
  );

  return [debouncedValue, controls];
}
