import { useMemo, useCallback } from "react";

import { useSet } from "@/hooks/useSet";

export const GroupSelectionState = {
  NotSelected: "not-selected",
  PartiallySelected: "partially-selected",
  FullySelected: "fully-selected",
} as const;

export type GroupSelectionState =
  (typeof GroupSelectionState)[keyof typeof GroupSelectionState];

export interface GroupedFilter<GroupType extends string> {
  hasFilter: boolean;
  size: number;
  clear: () => void;
  has: (item: string) => boolean;
  toggleItem: (item: string) => void;
  groupStates: Record<GroupType, GroupSelectionState>;
  toggleGroup: (group: GroupType) => void;
  getSelectedItems: () => string[];
}

export function useGroupedFilter<GroupType extends string>(
  itemsByGroup: Record<GroupType, string[]> | undefined,
) {
  const selectedItems = useSet<string>();

  const groupStates = useMemo(() => {
    const result = {} as Record<GroupType, GroupSelectionState>;

    if (!itemsByGroup) return result;

    for (const group in itemsByGroup) {
      const items = itemsByGroup[group];

      let selectedCount = 0;
      if (selectedItems.size > 0) {
        for (const item of items) {
          if (selectedItems.has(item)) {
            selectedCount++;
          }
        }
      }

      if (selectedCount === 0) {
        result[group] = "not-selected";
      } else if (selectedCount === items.length) {
        result[group] = "fully-selected";
      } else {
        result[group] = "partially-selected";
      }
    }

    return result;
  }, [itemsByGroup, selectedItems]);

  const toggleGroup = useCallback(
    (group: GroupType) => {
      if (!itemsByGroup || !itemsByGroup[group]) return;

      const groupItems = itemsByGroup[group];
      const selectedCount = groupItems.filter((item) =>
        selectedItems.has(item),
      ).length;

      const isFullySelected = selectedCount === groupItems.length;

      if (isFullySelected) {
        selectedItems.delete(groupItems);
      } else {
        selectedItems.add(groupItems);
      }
    },
    [itemsByGroup, selectedItems],
  );

  return useMemo(
    () => ({
      hasFilter: selectedItems.size > 0,
      size: selectedItems.size,
      clear: selectedItems.clear,
      has: selectedItems.has,
      toggleItem: selectedItems.toggle,
      groupStates,
      toggleGroup,
      getSelectedItems: selectedItems.toArray,
    }),
    [selectedItems, groupStates, toggleGroup],
  );
}
