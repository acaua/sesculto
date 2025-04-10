import { useMemo } from "react";

import Fuse, { type IFuseOptions } from "fuse.js";

const defaultOptions = {
  threshold: 0.4, // Lower threshold = stricter matching
  ignoreLocation: true,
};

export function useFuse<T>(
  list: ReadonlyArray<T> | undefined,
  searchString: string,
  fuseOptions?: IFuseOptions<T>,
): {
  filteredList: ReadonlyArray<T> | undefined;
} {
  const fuseSearch = useMemo(() => {
    if (!list) return undefined;

    return new Fuse(list || [], { ...defaultOptions, ...fuseOptions });
  }, [list, fuseOptions]);

  const filteredList = useMemo(() => {
    if (!fuseSearch || !list) return undefined;

    const searchStringTrimmed = searchString.trim();

    if (searchStringTrimmed === "") {
      return list;
    }

    return fuseSearch.search(searchStringTrimmed).map((result) => result.item);
  }, [fuseSearch, list, searchString]);

  return { filteredList };
}
