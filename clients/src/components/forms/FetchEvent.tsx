import { useState, useTransition, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { EventUpdateType } from "@models/event/EventLog";
import { baseUrl } from "../../lib/baseUrl";

const fetchSchema = z.object({
  id: z.string().min(1, "Event ID is required"),
});

type FetchEventInput = z.infer<typeof fetchSchema>

interface Props {
    onEventFetched: (event: EventUpdateType) => void;
}

export default function FetchEventForm({ onEventFetched }: Props) {
  const [formError, setFormError] = useState("");
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();
  const [isFetching, setIsFetching] = useState(false);
  const isMutating = isFetching || isPending;

  const {
    register,
    handleSubmit,
    reset,
    formState: {errors},
  } = useForm<FetchEventInput>({
    resolver: zodResolver(fetchSchema),
    defaultValues: { id: ""},
  });

  const onSubmit = async (data: FetchEventInput) => {
    const id = data.id?.trim()
    if (!id || id.length !== 36) {
  setFormError("Project ID must be a valid UUID string");
  return;
   }
  
  try {
      setFormError("");
      setMessage("");
      setIsFetching(true);

      const res = await fetch(`${baseUrl}/api/event/${id}`)

      const response = await res.json()

      if (!res.ok) {
         setFormError(`🔥 ${response.message}`);
      } else {
        console.log("Response",response)
        setMessage(`✅ ${response.message}`); 
        startTransition(() => reset());
        onEventFetched(response);
      }

  } catch (err) {
        console.error(err);
      setFormError(`🔥Server error, something went wrong `);
    } finally {
        setIsFetching(false);
    }
  }

  useEffect(() => {
setTimeout(() => {
    if (message || formError) {
    setMessage('')
    setFormError('')
    }
}, 5000)
  }, [message, formError])

  return (
    <form
    id="form-get-project"
      onSubmit={handleSubmit(onSubmit)}
      style={{ opacity: !isMutating ? 1 : 0.7 }}
    >
      {formError && <span className="errors">{formError}</span>}
      {message && <span>{message}</span>}

      <div className="form-control">
        <label htmlFor="event_id" className="form-label">
          <span>Event ID</span>
        </label>
        <input
          id="event_id"
          type="text"
          autoComplete="off"
          className={`input input-bordered ${
            errors.id ? "input-error" : ""
          }`}
          {...register("id")}
        />
        {errors.id && (
          <span className="errors">{errors.id.message}</span>
        )}
      </div>
        <button
        type="submit"
        className="btn-submit-login"
        disabled={isPending}
        style={{ opacity: !isMutating ? 1 : 0.7 }}
      >
        Fetch Event
      </button>
    </form>
  )
}