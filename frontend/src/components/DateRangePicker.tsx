// src/components/DateRangePicker.tsx
import React from 'react';
import { DateRange, Range } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

interface Props {
  range: Range[];
  setRange: (range: Range[]) => void;
}

const DateRangePicker: React.FC<Props> = ({ range, setRange }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded p-4">
      <DateRange
        editableDateInputs={true}
        onChange={(item) => setRange([item.selection])}
        moveRangeOnFirstSelection={false}
        ranges={range}
      />
    </div>
  );
};

export default DateRangePicker;
