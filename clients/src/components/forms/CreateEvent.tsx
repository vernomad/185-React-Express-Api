import { useState, useTransition, useId, useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import MyFilePond from "../../lib/filePond";
import { useUser } from "../../useUser";


 import {EventCreateProperties, CalendarEventEntry, CalendarEventSchema } from '@models/event/EventLog'


 type FieldType = "textarea" | "text" | "file" | "date" | "datetime" | "checkbox";


const eventInputs: Record<
  EventCreateProperties,
  {
    label?: string;
    type: FieldType;
    readOnly?: boolean;
    hidden?: boolean;
  }
> = {
  title: {
    type: "text",
    label: "title (cannot be changed)",
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
};

type EventFormValues = Omit<CalendarEventEntry, "image"> & {
    image?: File;
}

const now = new Date();
const localISO = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
  .toISOString()
  .slice(0, 16);

export default function EventSave() {
  const [formError, setFormError] = useState("");
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();
  const [isFetching, setIsFetching] = useState(false);
  const isMutating = isFetching || isPending;

  const [file, setFile] = useState<File | undefined>();
  const [filePondKey, setFilePondKey] = useState(0);

  const idPrefix = useId();
  const {user} = useUser()

   const {
   register,
   handleSubmit,
   reset,
  //  watch,
  //  setValue,
   formState: { errors },
 } = useForm<EventFormValues>({
   resolver: zodResolver(CalendarEventSchema),
   defaultValues: {
     title: "",
     description: "",
     date: localISO, 
     start: new Date(), // defaults to now
     end: new Date(), // same as start until changed
     location: "",
     createdBy: user?.username || '',
     published: true,
     image: undefined, // handled by file input
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
      formData.append("title", data.title)
      formData.append("description", data.description || '')
      formData.append("date", data.date || '')
      formData.append("start", data.start.toISOString());
      formData.append("end", data.end.toISOString());     
      formData.append("location", data.location || '');
      formData.append("createdBy", data.createdBy || '');
      if (file) {
      formData.append("image", file);
      }
      //  formData.append("published", data.published ? "true" : "false" );

      setIsFetching(true)
      const res = await fetch("/api/event", {
        method: "POST",
        credentials: "include",
        body: formData,
      })
      const response = await res.json();
      console.log("REspnse:", response);
      if (!res.ok) {
        setFormError(`🔥 ${response.message}`);
      } else {
        setMessage(`✅ ${response.message}`); 
        startTransition(() => {
          reset();
          setFilePondKey(prev => prev + 1); 
          //    window.location.href = '/admin';
        });
        setIsFetching(false);
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
      onSubmit={handleSubmit(onSubmit)}
       style={{ opacity: !isMutating ? 1 : 0.7 }}
        >
           {formError && <span className="errors">{formError}</span>}
          {message && <span>{message}</span>}

       {Object.entries(eventInputs).map(([key, field], index) => {
        const property = key as EventCreateProperties;
        const fieldId = `${idPrefix}-${key}-${index}`;

        return (
          <div key={key} className="form-control">
            {/* <label
                  htmlFor={fieldId}
                  className="form-label"
                  style={{ textTransform: "capitalize" }}
                  >
                    {field.label === "date" ? (
                      <></>
                    ): field.label === "Created By" ? (
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
              <MyFilePond
                    aria-label="Upload image"
                    key={filePondKey}
                    onFilesChange={(files) => setFile(files[0])}
                    maxFiles={1}
                  />
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
       {message && <span>{message}</span>}
       <button
            type="submit"
            className="btn-submit"
            disabled={isPending}
            style={{ opacity: !isMutating ? 1 : 0.7 }}
          >
            Submit
          </button>
    </form>

    </>
  )

}
