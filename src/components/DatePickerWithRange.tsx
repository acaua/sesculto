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
              {selected?.from ? (
                selected.to ? (
                  <>
                    {formatDate(selected.from)} - {formatDate(selected.to)}
                  </>
                ) : (
                  formatDate(selected.from)
                )
              ) : (
                <span>Escolha as datas</span>
              )}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
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
