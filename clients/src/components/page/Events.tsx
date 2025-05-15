
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

const myEventsList = [
  {
    id: 1,
    title: 'Team Meeting',
    start: new Date(2025, 8, 20, 10, 0), // Sept 20, 2025, 10:00 AM
    end: new Date(2025, 8, 20, 11, 0),
  },
  {
    id: 2,
    title: 'Launch Day 🎉',
    start: new Date(2025, 8, 25, 9, 0),
    end: new Date(2025, 8, 25, 13, 0),
  },
];
export default function EventComponent() {
  return (
    <div className="">
      <h1 style={{ marginTop: "7rem", padding: '1rem' }}>Calender Events</h1>
      <div style={{ height: '90dvh', padding: '1rem' }}>
      <Calendar
        localizer={localizer}
        events={myEventsList}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '100%' }}
      />
    </div>
    </div>
  )
}
