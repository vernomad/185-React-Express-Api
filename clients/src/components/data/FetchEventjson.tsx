import { useState, useEffect } from "react";
import { CalendarEventEntry } from "@models/event/EventLog";
import { EventUpdateType } from "@models/event/EventLog";

type EventProps = {
    calendarData: CalendarEventEntry[];
    onEventFetched: (event: EventUpdateType | null) => void;
}

export default function FetchEvents({ calendarData, onEventFetched }: EventProps) {
     const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
     const [expanded, setExpanded] = useState(false);
     const [isOpen, setIsOpen] = useState(false);

     const selectedEvent = calendarData.find((p) => p.slug === selectedSlug);

      const handleSelectedEvent = (slug: string) => {
    if (slug === selectedSlug) {
      setIsOpen(!isOpen);
    } else {
      setSelectedSlug(slug);
      setIsOpen(true);
    }
  };

    const toggleExpansion = () => setExpanded(!expanded);

     // ✅ Call the parent's callback *after* render, not inside it
  useEffect(() => {
    if (isOpen && selectedEvent) {
      onEventFetched(selectedEvent);
    } else {
      onEventFetched(null);
    }
  }, [isOpen, selectedEvent, onEventFetched]);

  return (
    <div>
         <ul className="toggle-buttons">
        <li>
          <button onClick={toggleExpansion}>
            {expanded ? "Show Less" : "All"}
          </button>
        </li>
        {calendarData.map((p) => (
          <li key={p.id}>
                <button onClick={() => handleSelectedEvent(p.slug!)}>
              {p.title}
            </button>
          </li>
        ))}        
      </ul>

 {selectedEvent && isOpen && (
        <div className="project-details-admin">
          <h2>{selectedEvent.title}</h2>
          <p>{selectedEvent.description}</p>
          <picture style={{ display: "block", width: "75px", margin: ".5rem", border: "2px solid gray" }}>
            <img
              src={selectedEvent.image?.full}
              alt={selectedEvent.title}
            />
          </picture>
          <pre>{JSON.stringify(selectedEvent, null, 2)}</pre>
        </div>
      )}

      {expanded && (
        <div className="all-projects">
          <pre>{JSON.stringify(calendarData, null, 2)}</pre>
        </div>
      )}

    </div>
  )
}