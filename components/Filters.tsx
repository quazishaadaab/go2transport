import {Calendar} from "@nextui-org/calendar";
import {parseDate} from '@internationalized/date';
import {DateRangePicker} from "@nextui-org/react";

import React from 'react'

function Filters() {
  return (
    <div>
        
        <DateRangePicker 
      label="Trip Duration" 
      className="max-w-xs" 
      onChange={(value) => console.log(value)}
    />

    </div>
  )
}

export default Filters