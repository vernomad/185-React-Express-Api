import { useState, useEffect } from "react";
import { EventUpdateType } from "@models/event/EventLog";
import FetchEventForm from "../forms/FetchEvent";
import UpdateEventForm from "../forms/UpdateEvent";

type Prop = {
  earlyEventInjection?: EventUpdateType | null;
};

export default function UpdateEvent({ earlyEventInjection }: Prop) {
  const [expanded, setExpanded] = useState(false);
  const [event, setEvent] = useState<EventUpdateType | null>(null)

   useEffect(() => {
      if (earlyEventInjection) {
        setEvent(earlyEventInjection);
      }
    }, [earlyEventInjection]);

  return (
    <>
      {expanded && (
              <div className="button-wrapper">
              {!event ? (
                <FetchEventForm onEventFetched={setEvent} />
              ) : (
                <UpdateEventForm event={event} />
              )}
              </div>
            )}
       <button className={`readmore ${expanded ? "expanded" : ""}`} type="button" onClick={() => setExpanded((prev) => !prev)}>
        {expanded ? "Show less" : "Update event"}
      </button>
    </>
  );
}
