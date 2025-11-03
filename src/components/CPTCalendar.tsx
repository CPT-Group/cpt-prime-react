import { Calendar, CalendarProps } from 'primereact/calendar';

export type CPTCalendarProps = CalendarProps;

export const CPTCalendar = (props: CPTCalendarProps) => {
  return <Calendar {...props} />;
};

