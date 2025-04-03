// src/components/DateRangePicker.tsx
import React, { useRef, useState } from "react";
import { DateRange, Range } from "react-date-range";
import { format } from "date-fns";
import useOnClickOutside from "../utils/useOnClickOutside";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

interface Props {
  range: Range[];
  setRange: (range: Range[]) => void;
}


const DateRangePicker: React.FC<Props> = ({ range, setRange }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useOnClickOutside(ref as React.RefObject<HTMLDivElement>, () => setOpen(false));
  

  return (
    <div className="relative" ref={ref as React.RefObject<HTMLDivElement>}>
      <div
        className="w-full cursor-pointer border border-gray-300 p-2 rounded text-center bg-white text-purple-700"
        onClick={() => setOpen(!open)}
      >
        <span className="font-semibold">
          {format(range[0].startDate || new Date(), "MMM dd, yyyy")} -{" "}
          {format(range[0].endDate || new Date(), "MMM dd, yyyy")}
        </span>
      </div>

      {open && (
        <div className="absolute z-50 mt-2 shadow-lg border border-gray-300 dark:border-gray-700 rounded">
          <DateRange
            editableDateInputs={true}
            onChange={(item) => setRange([item.selection])}
            moveRangeOnFirstSelection={false}
            ranges={range}
            months={2}
            direction="horizontal"
            className="rounded"
          />
        </div>
      )}
    </div>
  );
};

export default DateRangePicker;
