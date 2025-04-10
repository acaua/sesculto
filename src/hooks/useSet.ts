import { useCallback, useMemo, useState } from "react";

export interface StatefulSet<T> {
  size: number;
  has: (value: T) => boolean;
  add: (values: T | T[]) => void;
  delete: (values: T | T[]) => void;
  clear: () => void;
  sync: (values: T[]) => void;
  toArray: () => T[];
  toggle: (value: T) => void;
}

export function useSet<T>(iterable?: Iterable<T>): StatefulSet<T> {
  const [set, setSet] = useState(() => new Set<T>(iterable));

  const add = useCallback(
    (values: T | T[]) => {
      setSet((prev) => {
        const copy = new Set(prev);
        // Handle both cases (array or single value)
        const valuesToAdd = Array.isArray(values) ? values : [values];
        for (const value of valuesToAdd) {
          copy.add(value);
        }
        return copy;
      });
    },
    [setSet],
  );

  const deleteValues = useCallback(
    (values: T | T[]) => {
      setSet((prev) => {
        const copy = new Set(prev);

        const valuesToDelete = Array.isArray(values) ? values : [values];
        for (const value of valuesToDelete) {
          copy.delete(value);
        }

        return copy;
      });
    },
    [setSet],
  );

  const toggle = useCallback((value: T) => {
    setSet((prev) => {
      const copy = new Set(prev);
      if (!copy.has(value)) {
        copy.add(value);
      } else {
        copy.delete(value);
      }

      return copy;
    });
  }, []);

  const clear = useCallback(() => {
    setSet(new Set());
  }, []);

  const sync = useCallback((values: T[]) => {
    setSet(new Set(values));
  }, []);

  return useMemo(() => {
    return {
      size: set.size,
      has: (value: T) => set.has(value),
      add,
      delete: deleteValues,
      clear,
      sync,
      toArray: () => Array.from(set),
      toggle,
    };
  }, [set, add, deleteValues, clear, sync, toggle]);
}
