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
            {error && (<div className="loading-error">Error: <p className="errors">{error.message}</p></div>)}
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

// import { Calendar, dateFnsLocalizer } from "react-big-calendar";
// import { format, parse, startOfWeek, getDay } from "date-fns";
// import { enNZ } from "date-fns/locale";
// import "react-big-calendar/lib/css/react-big-calendar.css";
// import { useState } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";

// const locales = { "en-NZ": enNZ };
// const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });

// export const CalendarEventSchema = z.object({
//   title: z.string().min(2),
//   description: z.string().optional(),
//   date: z.string(),
//   start: z.date(),
//   end: z.date(),
//   location: z.string().optional(),
// });

// type EventFormValues = z.infer<typeof CalendarEventSchema>;

// export default function CalendarWithForm() {
//   const [selectedSlot, setSelectedSlot] = useState<{ start: Date; end: Date } | null>(null);

//   const { register, handleSubmit, setValue, reset, watch } = useForm<EventFormValues>({
//     resolver: zodResolver(CalendarEventSchema),
//     defaultValues: {
//       title: "",
//       description: "",
//       date: new Date().toISOString().slice(0, 10),
//       start: new Date(),
//       end: new Date(),
//       location: "",
//     },
//   });

//   const onSubmit = (data: EventFormValues) => {
//     console.log("Submitting event:", data);
//     reset();
//     setSelectedSlot(null);
//   };

//   const handleSelectSlot = (slotInfo: { start: Date; end: Date }) => {
//     setSelectedSlot(slotInfo);

//     const startLocal = new Date(slotInfo.start.getTime() - slotInfo.start.getTimezoneOffset() * 60000);
//     const endLocal = new Date(slotInfo.end.getTime() - slotInfo.end.getTimezoneOffset() * 60000);

//     setValue("start", startLocal);
//     setValue("end", endLocal);
//     setValue("date", startLocal.toISOString().slice(0, 10));
//   };

//   return (
//     <div>
//       <h2>Event Calendar</h2>
//       <Calendar
//         localizer={localizer}
//         events={[]}
//         selectable
//         onSelectSlot={handleSelectSlot}
//         startAccessor="start"
//         endAccessor="end"
//         style={{ height: 500, marginBottom: "2rem" }}
//       />

//       {selectedSlot && (
//         <form onSubmit={handleSubmit(onSubmit)}>
//           <input {...register("title")} placeholder="Title" required />
//           <br />
//           <textarea {...register("description")} placeholder="Description" />
//           <br />
//           <input {...register("date")} type="date" />
//           <br />
//           <input
//             {...register("start")}
//             type="datetime-local"
//             value={watch("start").toISOString().slice(0, 16)}
//             readOnly
//           />
//           <br />
//           <input
//             {...register("end")}
//             type="datetime-local"
//             value={watch("end").toISOString().slice(0, 16)}
//             readOnly
//           />
//           <br />
//           <input {...register("location")} placeholder="Location" />
//           <br />
//           <button type="submit">Save Event</button>
//         </form>
//       )}
//     </div>
//   );
// }
