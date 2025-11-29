import { useState, useEffect } from "react";
import { EventUpdateType } from "@models/event/EventLog";
import FetchEventForm from "../forms/FetchEvent";
import UpdateEventForm from "../forms/UpdateEvent";

type Prop = {
  earlyEventInjection?: EventUpdateType | null;
};

export default function UpdateEvent({ earlyEventInjection }: Prop) {
  const [event, setEvent] = useState<EventUpdateType | null>(null)

   useEffect(() => {
      if (earlyEventInjection) {
        setEvent(earlyEventInjection);
      }
    }, [earlyEventInjection]);

  return (
    <>
              {!event ? (
                <FetchEventForm onEventFetched={setEvent} />
              ) : (
                <UpdateEventForm event={event} />
              )}
    </>
  );
}
