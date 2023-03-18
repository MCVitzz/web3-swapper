import { useCallback, useState } from "react";

export default function useArray<T>(defaultValue?: T[]) {
  const [array, setArray] = useState(defaultValue || []);

  const push = useCallback(
    (element: T) => {
      setArray((a) => [...a, element]);
    },
    [setArray]
  );

  const filter = useCallback(
    (callback: (element: T) => boolean) => {
      setArray((a) => a.filter(callback));
    },
    [setArray]
  );

  const find = useCallback(
    (callback: (element: T) => boolean) => {
      return array.find(callback);
    },
    [array]
  );

  const update = useCallback(
    (index: number, newElement: T) => {
      setArray((a) => [
        ...a.slice(0, index),
        newElement,
        ...a.slice(index + 1, a.length),
      ]);
    },
    [setArray]
  );

  const remove = useCallback(
    (item: T) => {
      const index = array.indexOf(item);
      setArray((a) => [...a.slice(0, index), ...a.slice(index + 1, a.length)]);
    },
    [setArray, array]
  );

  const clear = useCallback(() => {
    setArray([]);
  }, [setArray]);

  return { array, set: setArray, push, filter, update, remove, clear, find };
}
