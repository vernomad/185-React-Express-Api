import { useState, useTransition, useId, useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import MyFilePond from "../../lib/filePond";

import {EventUpdateProperties, UpdateCalendarEventSchema, EventUpdateType} from '@models/event/EventLog'

 type FieldType = "textarea" | "text" | "file" | "date" | "datetime" | "checkbox" | "hidden";

function toLocalDateTimeString(value: string | Date | undefined): string {
  if (!value) return "";

  const date = typeof value === "string" ? new Date(value) : value;
  if (isNaN(date.getTime())) return "";

  const pad = (n: number) => n.toString().padStart(2, "0");

  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}




const eventInputs: Record<
  EventUpdateProperties,
  {
    label?: string;
    type: FieldType;
    readOnly?: boolean;
    hidden?: boolean;
  }
> = {
    id: {
        type: "hidden",
        label: "id",
        readOnly: true,
        //hidden: true,
    },
  title: {
    type: "text",
    label: "title (cannot be edited)",
    readOnly: true,
  },
  description: {
    type: "textarea",
    label: "description",
  },
  image: {
    type: "file",
    label: "Image (optional)",
  },
  date: {
    type: "date",
    label: "date",
    readOnly: true,
    hidden: true,
  },
  start: {
    type: "datetime",
    label: "Start Time",
  },
  end: {
    type: "datetime",
    label: "End Time",
  },
  location: {
    type: "text",
    label: "Location (town/city or full address)",
  },
  createdBy: {
    type: "text",
    label: "Created By",
    readOnly: true,
    hidden: true,
  },
  published: {
    type: "checkbox",
    label: "Published (default is true)",
  },
  slug: {
    type: "hidden",
    label: "slug",
    readOnly: true,
  }
};

type EventFormValues = Omit<EventUpdateType, "image" | "start" | "end"> & {
    image?: File;
    start?: string;
  end?: string;
}


export default function UpdateEventForm({event}: {event: EventUpdateType}) {
  const [formError, setFormError] = useState("");
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();
  const [isFetching, setIsFetching] = useState(false);
  const isMutating = isFetching || isPending;

  const [file, setFile] = useState<File | undefined>();
  const [filePondKey, setFilePondKey] = useState(0);

  const idPrefix = useId();
// eslint-disable-next-line @typescript-eslint/no-unused-vars
   const [existingImage, _setExistingImage] = useState(event.image || null);
    const [updateEvent, setUpdateEvent] = useState(event)

   const {
   register,
   handleSubmit,
   reset,
  //  watch,
  //  setValue,
   formState: { errors, isDirty },
 } = useForm<EventFormValues>({
   resolver: zodResolver(UpdateCalendarEventSchema),
   defaultValues: {
     ...updateEvent,
    start: updateEvent.start ? toLocalDateTimeString(updateEvent.start) : "",
    end: updateEvent.end ? toLocalDateTimeString(updateEvent.end) : "",
    image: undefined,
   },
 });

 const onSubmit: SubmitHandler<EventFormValues> = async (data) => {
    try {
        setFormError('')
        setMessage('')

         if (
        file?.type && 
        !["image/png", "image/jpeg", "image/svg+xml", "image/webp"].includes(file.type)
      ) {
        throw new Error("Invalid file type. Please upload a PNG, SVG, JPG, or WebP file.");
      }

      const formData = new FormData();
      formData.append("description", data.description || '')
    if (data.start) {
  const startDate =
    typeof data.start === "string" ? new Date(data.start) : data.start;
  if (!isNaN(startDate.getTime())) {
    formData.append("start", startDate.toISOString());
  }
}

if (data.end) {
  const endDate =
    typeof data.end === "string" ? new Date(data.end) : data.end;
  if (!isNaN(endDate.getTime())) {
    formData.append("end", endDate.toISOString());
  }
}
       
      formData.append("location", data.location || '');


      if (file) {
      formData.append("image", file);
      }
      //  formData.append("published", data.published ? "true" : "false" );

         for (const [key, value] of formData.entries()) {
  console.log(key, value);
}
 if (!isDirty) {
    setMessage("⚠️ No changes to save");
    return;
  }
      setIsFetching(true)
      const res = await fetch(`/api/event/${event.id}`, {
        method: "PATCH",
        credentials: "include",
        body: formData,
      })
      const response = await res.json();
      console.log("REspnse:", response);
      if (!res.ok) {
        setFormError(`🔥 ${response.message}`);
        setMessage(`❌ ${response.message}`);
      } else {
        setUpdateEvent(response.event)
        setTimeout(() => setMessage(`✅ ${response.message}`), 200)
        startTransition(() => {
           reset({
    ...response.event,
    start: response.event.start
      ? toLocalDateTimeString(response.event.start)
      : "",
    end: response.event.end
      ? toLocalDateTimeString(response.event.end)
      : "",
    image: undefined,
  });
          setFilePondKey(prev => prev + 1); 
          //    window.location.href = '/admin';
        });
       setTimeout(() => setIsFetching(false), 150);
      }

    } catch (error) {
        console.error(error)
    }
 };
 useEffect(() => {
    setTimeout(() => {
      if (message) {
          setMessage('')
      }
      if (formError) {
            setFormError('')
      }
    }, 5000)
  }, [message, formError])

  return (
    <>
    <form 
      id="form-event"
      onSubmit={handleSubmit(onSubmit)}>
           {formError && <span className="errors">{formError}</span>}
          {message && <span>{message}</span>}

       {Object.entries(eventInputs).map(([key, field], index) => {
        const property = key as EventUpdateProperties;
        const fieldId = `${idPrefix}-${key}-${index}`;

        return (
          <div key={key} className="form-control">
            {/* <label
                  htmlFor={fieldId}
                  className="form-label"
                  style={{ textTransform: "capitalize" }}
                  >
                    {field.label === "date" || field.label === "Created By" || field.label === "slug" || field.label === "id" ? (
                      <></>
                    ): (
                       <span>{field.label || key}</span>
                    )}                    
                </label> */}
                {!field.hidden && (
                  <label
                    htmlFor={fieldId}
                    className='form-label'
                    style={{ textTransform: "capitalize" }}
                  >
                    <span>{field.label || key}</span>
                  </label>
                )}

             {field.type === "text" ? (
                <input
                    id={fieldId}
                    type={field.type}
                    autoComplete={field.type}
                    step="any"
                    className={`input input-bordered ${
                      errors[property] ? "input-error" : ""
                    }`}
                    readOnly={field.readOnly} 
                    hidden={field.hidden}
                    {...register(property)}
                  />
             ): field.type === "textarea" ? (
                <textarea 
                id={fieldId}
                autoComplete={field.type}
                 className={`input input-bordered ${
                      errors[property] ? "input-error" : ""
                    }`}
                    {...register(property)}
                  />
             ): field.type === "datetime" ? (
                <input
                  id={fieldId}
                  type="datetime-local"
                  className={`input input-bordered ${errors[property] ? "input-error" : ""}`}
                  readOnly={field.readOnly} 
                  hidden={field.hidden}
                  {...register(property)}
                />
             ): field.type === "file" ? (
            <>
            {existingImage && (
                    <div
            key={index}
            style={{
              position: "relative",
              width: "fit-content"
            }}
          >
          <img src={existingImage.full} alt="" style={{width: "80px", marginBottom: ".5rem", border: "2px solid #aeaeaeff"}} ></img>
          <button
              type="button"
              //onClick={() => handleDeleteImage(index, image.full)}
              className="action-button"
            >
              ×
            </button>
                    </div>
                  )}
              <MyFilePond
                    aria-label="Upload image"
                    key={filePondKey}
                    onFilesChange={(files) => setFile(files[0])}
                    maxFiles={1}
                  />
                  </>
             ): field.type === "checkbox" && (
              <div className="form-checkbox">
                <input
                  id={fieldId}
                  type="checkbox"
                  className="checkbox"
                  {...register(property)}
                />
              </div>
            )} 
             {errors[property] && (
                  <span className="errors">{errors[property]?.message}</span>
                )}
          </div>
        )
       })}    
       {formError && <span className="errors">{formError}</span>}
       {message && <span className="response-message">{message}</span>}
       <button
            type="submit"
            className="btn-submit-login"
            disabled={isPending}
            style={{ opacity: !isMutating ? 1 : 0.7 }}
          >
            Submit
        </button>
    </form>

    </>
  )

}
