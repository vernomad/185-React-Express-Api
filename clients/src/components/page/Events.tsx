// import { Calendar, momentLocalizer } from 'react-big-calendar';
// import moment from 'moment';
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useState, useEffect } from "react";
import { usePageView } from "../../hooks/usePageView";

// const localizer = momentLocalizer(moment);
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enNZ } from "date-fns/locale/en-NZ"; // or en-US if you prefer
import useEventData from "../../hooks/useEventData";
import { CalendarEventEntry } from "@models/event/EventLog";
import RefreshButton from "../buttons/RefreshButton";

const locales = {
  "en-NZ": enNZ,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

function CustomEvent({ event }: { event: CalendarEventEntry }) {
  return (
    <div>
      <strong>{event.title}</strong>
      {event.description && (
        <div style={{ fontSize: "0.8rem", color: "#e0e0e0" }}>
          {event.description}
        </div>
      )}
      {event.location && (
        <div style={{ fontSize: "0.8rem", color: "#e0e0e0" }}>
          Location: {event.location}
        </div>
      )}
    </div>
  );
}

export default function EventComponent() {
  const { events, loading, error } = useEventData();
  const [wallEvent, setWallEvent] = useState<CalendarEventEntry | null>(null);
  const [eventList, setEvents] = useState<CalendarEventEntry[]>(events);
  usePageView("/events");

  const handleSelectSlot = ({ start, end }: { start: Date; end: Date }) => {
    // For demo purposes, just prompt for a title
    const title = window.prompt("New Event title:");
    if (title) {
      const newEvent: CalendarEventEntry = {
        id: String(eventList.length + 1),
        title,
        start,
        end,
        createdBy: "admin",
        published: false,
      };
      setEvents([...eventList, newEvent]); // add to state
    }
  };

  useEffect(() => {
    if (events.length > 0) {
      setEvents(events);
    }
  }, [events]);

  // if (loading) return <p>Loading events...</p>;
  // if (error) return <p>Error loading events: {error.message}</p>;
  return (
    <>
      <div id="3d-events" className="container-3d">
        
        <div id="grid-lines-events-ceiling" className="grid-lines ceiling">
          <h1 className="event-title">Calendar Events</h1>
        </div>
        <div id="grid-lines-events-floor" className="grid-lines floor"></div>
      {loading ? (<p>Loading events...</p>
      ): (
         <div className="event-grid">
          <div className="calender-wrapper">
            <Calendar
              localizer={localizer}
              events={eventList}
              startAccessor="start"
              endAccessor="end"
              style={{ height: "100%" }}
              components={{
                event: CustomEvent,
              }}
              onSelectEvent={(event) =>
                setWallEvent(event as CalendarEventEntry)
              }
              selectable // 👈 enables slot selection
              onSelectSlot={handleSelectSlot} // 👈 callback for creating new events
            />
            <div className="plate-container">
              <img
                src="assets/plate.png"
                style={{
                  width: "100px",
                  minWidth: "90px",
                  paddingRight: "1rem",
                }}
                alt=""
              />
            </div>
          </div>

          <div className="event-wall-upper">
            <span>Select for view on wall</span>
            {error && (<div className="loading-error errors">Error: 
              <p className="errors">{error.message}
                <RefreshButton />
                </p></div>)}
          </div>
          {wallEvent && (
            <div className="event-wall" key={wallEvent.id}>
              <div>
                
                <div>
                  <img
                    src={wallEvent.image?.full}
                    className="wall-img"
                    alt=""
                  />
                </div>
                <div>
                  {" "}
                  <h3>
                    <strong>{wallEvent.title}</strong>
                  </h3>
                </div>
                <div>
                  <p>Desc: {wallEvent.description}</p>
                </div>
                <div>
                  <p>Location: {wallEvent.location}</p>
                </div>
                <div>
                  <p>
                    Starts:{" "}
                    {new Intl.DateTimeFormat("en-US", {
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true,
                    }).format(wallEvent.start)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
       
      </div>
    </>
  );
}