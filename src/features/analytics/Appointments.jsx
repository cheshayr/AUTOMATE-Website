'use client';

import * as React from 'react';

import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar'; // Your custom Calendar component
import { useFetchAppointmentsEvent } from '@/hooks/useAnalytticsQuery';

export function Appointments() {
  const [date, setDate] = React.useState(new Date());
  const { data, isPending, isSuccess } = useFetchAppointmentsEvent();

  // 1. Calculate which days have bookings using useMemo for efficiency.
  const bookedDays = React.useMemo(() => {
    // Return an empty array if there's no data to process.
    if (!data?.data) {
      return [];
    }
    // Map each event in your data to a `Date` object.
    return data.data.map((event) => new Date(event.from));
  }, [data]); // This will only re-calculate when the `data` from your API changes.

  // 2. Define the modifiers to pass to the Calendar.
  // We're creating a custom modifier named 'booked'.
  const modifiers = {
    booked: bookedDays,
  };

  // 3. Define the CSS classes to apply for our custom modifier.
  // This will apply a semi-transparent primary background to any day with the 'booked' modifier.
  const modifiersClassNames = {
    booked: 'bg-primary/20',
  };

  // Filter events for the currently selected date.
  const selectedDateEvents = React.useMemo(() => {
    if (!date || !data?.data) return [];

    return data.data.filter((event) => new Date(event.from).toDateString() === date.toDateString());
  }, [date, data]);

  return (
    <Card className="p-4 w-[70%] flex-row shadow-none">
      <CardContent className="px-4 flex-1">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="bg-transparent p-0 h-full w-full"
          required
          // 4. Pass the modifiers and their styles to the Calendar component.
          modifiers={modifiers}
          modifiersClassNames={modifiersClassNames}
        />
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-4 px-4 flex-1">
        <div className="flex w-full items-center justify-between mt-2">
          <div className="text-sm font-medium">
            {date?.toLocaleDateString('en-US', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </div>
        </div>
        <div className="flex w-full flex-col gap-4">
          {isPending && (
            <div className="text-center text-sm text-muted-foreground pt-8 w-full">Loading appointments...</div>
          )}

          {isSuccess && (
            <>
              {selectedDateEvents && selectedDateEvents.length > 0 ? (
                selectedDateEvents.map((event) => (
                  <div
                    key={event.title + event.from}
                    className="bg-muted flex items-center justify-between after:bg-primary relative rounded-md p-2 pl-8 text-sm after:absolute after:inset-y-2 after:left-4 after:w-1 after:rounded-full"
                  >
                    <div>
                      <div className="font-medium">{event.title}</div>
                      <div className="text-muted-foreground">{event.user}</div>
                    </div>
                    <div className="pr-2 text-xs text-muted-foreground font-semibold">
                      {new Date(event.from).toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true,
                      })}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-sm text-muted-foreground pt-8 w-full">
                  No appointments for this day.
                </div>
              )}
            </>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
