import { useCallback, useMemo, useState } from "react";

import Fuse, { type IFuseOptions } from "fuse.js";

const defaultOptions = {
  threshold: 0.4, // Lower threshold = stricter matching
  ignoreLocation: true,
};

export default function useFuse<T>(
  list: ReadonlyArray<T> | undefined,
  fuseOptions?: IFuseOptions<T>,
): {
  filteredList: ReadonlyArray<T> | undefined;
  searchString: string;
  setSearchString: (query: string) => void;
} {
  const [searchString, setSearchStringRaw] = useState("");

  const fuseSearch = useMemo(() => {
    if (!list) return undefined;

    return new Fuse(list || [], { ...defaultOptions, ...fuseOptions });
  }, [list, fuseOptions]);

  const filteredList = useMemo(() => {
    if (!fuseSearch || !list) return undefined;

    if (searchString === "") {
      return list;
    }

    return fuseSearch.search(searchString).map((result) => result.item);
  }, [fuseSearch, list, searchString]);

  const setSearchString = useCallback(
    (searchString: string) => setSearchStringRaw(searchString.trim()),
    [setSearchStringRaw],
  );

  return { filteredList, searchString, setSearchString };
}
