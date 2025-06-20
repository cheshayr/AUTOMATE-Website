'use client';

import * as React from 'react';
import { formatDateRange } from 'little-date';
import { PlusIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardFooter } from '@/components/ui/card';

const events = [
  {
    title: 'Tune Up',
    user: 'Fernando Montallana',
    from: '2025-06-12T09:00:00',
    to: '2025-06-12T10:00:00',
  },
  {
    title: 'Change Oil',
    from: '2025-06-12T11:30:00',
    user: 'John Doe',
    to: '2025-06-12T12:30:00',
  },
  {
    title: 'Battery Change',
    user: 'Pirena Amihan',
    from: '2025-06-12T14:00:00',
    to: '2025-06-12T15:00:00',
  },
];

export function Appointments() {
  // Removed the `<Date | undefined>` type definition from useState
  const [date, setDate] = React.useState(new Date(2025, 5, 12));

  return (
    <Card className=" p-4 w-[70%]  flex-row shadow-none">
      <CardContent className="px-4 flex-1 ">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="bg-transparent p-0  h-full w-full"
          required
        />
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-4 px-4  flex-1 ">
        <div className="flex w-full items-center justify-between  mt-2">
          <div className="text-sm font-medium">
            {date?.toLocaleDateString('en-US', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </div>
        </div>
        <div className="flex w-full flex-col gap-4">
          {events.map((event) => (
            <div
              key={event.title}
              className="bg-muted flex items-center  justify-between after:bg-primary relative rounded-md p-2 pl-8 text-sm after:absolute after:inset-y-2 after:left-4 after:w-1 after:rounded-full"
            >
              <div>
                <div className="font-medium">{event.title}</div>
                <div className="">{event.user}</div>
              </div>
              <div className="pr-2 text-xs text-muted-foreground font-semibold">{event.from}</div>
            </div>
          ))}
        </div>
      </CardFooter>
    </Card>
  );
}
