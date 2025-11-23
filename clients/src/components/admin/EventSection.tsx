import { useState } from "react";
import ShowButton from "../buttons/ShowButton";
import UpdateEvent from "../buttons/UpdateEvent";
import FetchEvents from "../data/FetchEventjson";
import EventSave from "../forms/CreateEvent";
import useEventData from "../../hooks/useEventData";
import { EventUpdateType } from "@models/event/EventLog";
import DeleteForm from "../forms/DeleteForm";

export default function EventSection() {
  const [event, setEvent ] = useState<EventUpdateType | null>(null)
  const {events, loading, error} = useEventData()

if (loading) return <p>Loading...</p>;
//  if (error) return <p>Failed: {error.message}</p>;

  return (
    <div className="admin-container">
      <h2>Events</h2>
      {!loading && error ? (
        <p className="errors">Failed: {error.message}</p>
      ): (
        <>
          <ShowButton
            showWhat="Show events"
            content={
              <div className="button-wrapper">
         
                  <FetchEvents calendarData={events} onEventFetched={setEvent} />
       
              </div>
            }
          />
          <UpdateEvent earlyEventInjection={event}/>
         
          <ShowButton
          showWhat="Create event"
          content={
             <div className="button-wrapper">
                <EventSave />
              </div>
          }
          />
          <ShowButton
            showWhat="Delete event"
            content={
              <div className="button-wrapper">
                <DeleteForm dir="event"/>
              </div>
            }
          />
        </>
      )}
        
    </div>
  );
}
