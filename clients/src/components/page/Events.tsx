
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

type CalendarEvent = {
  id: string;
  title: string;
  description?: string;
  date?: string;
  time?: string;
  start: Date,
  end: Date,
  location?: string;
  createdBy: string;
  published: boolean;
};

const myEventsList: CalendarEvent[] = [
  {
    id: '1',
    title: 'Gumball rally',
    start: new Date(2025, 4, 20, 10, 0), // Sept 20, 2025, 10:00 AM
    end: new Date(2025, 4, 23, 11, 0),
    description: "Beginning with our agenda's",
    location: "Ch-ch",
    createdBy: 'admin',
    published: true
  },
  {
    id: '2',
    title: 'Old Farts Rally 🎉',
    start: new Date(2025, 4, 25, 9, 0),
    end: new Date(2025, 4, 27, 13, 0),
    description: "and all dasy day",
     location: "Ch-ch",
    createdBy: 'admin',
    published: true
  },
];

function CustomEvent({ event }: { event: CalendarEvent }) {
  return (
    <div>
      <strong>{event.title}</strong>
      <div style={{ fontSize: '0.8rem', color: '#fff' }}>
        {event.description}
      </div>
      <div style={{ fontSize: '0.8rem', color: '#fff' }}>
       Location: {event.location}
      </div>
    </div>
  );
}


export default function EventComponent() {
  return (
    <div>
      <h1 style={{ marginTop: "7rem", padding: '1rem' }}>Calender Events</h1>
      <div style={{ height: '70dvh', padding: '1rem' }}>
      <Calendar
        localizer={localizer}
        events={myEventsList}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '100%' }}
         components={{
    event: CustomEvent
  }}
      />
    </div>
    </div>
  )
}
