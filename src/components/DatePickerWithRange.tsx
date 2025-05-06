import { CalendarIcon } from "lucide-react";
import type { DateRange as DateRangeFromLib } from "react-day-picker";

import { cn, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export type DateRange = DateRangeFromLib;

interface DatePickerWithRangeProps {
  selected: DateRange | undefined;
  onSelect: (range: DateRange | undefined) => void;
  className?: string;
}

function dateDisplay(selected: DateRange | undefined) {
  if (!selected?.from) return "Escolha as datas";

  if (selected.to)
    return `${formatDate(selected.from)} - ${formatDate(selected.to)}`;

  return `${formatDate(selected.from)} - `;
}

export function DatePickerWithRange({
  selected,
  onSelect,
  className,
}: DatePickerWithRangeProps) {
  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-auto justify-start text-left font-normal sm:w-48",
              !selected && "text-muted-foreground",
            )}
          >
            <CalendarIcon />
            <span className="sr-only sm:not-sr-only">
              {dateDisplay(selected)}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="px-4 pt-4 pb-2 font-normal text-gray-500 sm:hidden">
            {dateDisplay(selected)}
          </div>
          <Calendar
            initialFocus
            mode="range"
            selected={selected}
            onSelect={onSelect}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
