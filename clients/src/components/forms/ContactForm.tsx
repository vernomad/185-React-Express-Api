import { useState, useTransition, useId, useEffect} from 'react';
import {SubmitHandler, useForm } from 'react-hook-form';
// import DOMPurify from "dompurify";
import { zodResolver } from "@hookform/resolvers/zod";
import { ValidationSchema, validationShema, EmailProperties } from '../../../../models/email/Emailog';

type FieldType = "textarea" | "text" | "email" | "hidden";

const emailInputs: Record<
EmailProperties,
{
  label?: string;
  type: FieldType;
  readOnly?: boolean;
  hidden?: boolean;
}
> = {
  name: {
    type: "text",
    label: "name",
  },
  lastname: {
    type: "hidden",
    hidden: true,
    label: "lastname",
  },
  email: {
    type: "email",
    label: "email",
  },
  email2: {
    type: "hidden",
    hidden: true,
    readOnly: true,
    label: "email2",
  },
  site: {
    type: "hidden",
    hidden: true,
    readOnly: true,
    label: "site",
  },
  subject: {
    type: "text",
    label: "subject",
  },
  message: {
    type: "textarea",
    label: "message"
  }
}



export default function ContactForm() {
  const [formError, setFormError] = useState<string>("");
  const [updateMessage, setUpdateMessage] = useState<string>('');
  const [isPending, startTransition] = useTransition();
  const [isFetching, setIsFetching] = useState(false);
  const isMutating = isFetching|| isPending;

  const idPrefix = useId();

    const { 
        register, 
        handleSubmit, 
        reset, 
        formState: { errors },
     } = useForm<ValidationSchema>({
        resolver: zodResolver(validationShema),
        defaultValues: {
            name: "",
            lastname: "",
            email: "",
            email2: "veron988@gmail.com",
            site: "185RESTORATION.CO.NZ",
            subject: "",
            message: "",
        },
     });

     const onSubmit: SubmitHandler<ValidationSchema> = async (data) => {

        if (data.lastname?.trim() !== "") {
            setUpdateMessage("Thank you for your email!");
          return;
        }

          setFormError("");
          setUpdateMessage("")

        // const sanitizedSubject = DOMPurify.sanitize(data.subject)
        // const sanitizedMessage = DOMPurify.sanitize(data.message)

        const FormData = {
            ...data
        }

          try {
            setIsFetching(true)
            const res = await fetch("/api/email", {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify(FormData)
            });
            const response = await res.json()
            if (!res.ok) {
                setFormError(response.message)
                setTimeout(() => {
                  setFormError("")
                  reset()
                }, 5000)
            } else {
                setUpdateMessage(response.message)
               
                startTransition(() => {
                    reset()
                    setTimeout(() => {
                  setUpdateMessage("")
                }, 5000)
                })
            }
          } catch (e) {
            const error = e as Error;
              console.warn("Error sending contact email:", error);
              setFormError("Something went wrong. Please try again in a moment.");
          } finally {
            setIsFetching(false)
          }
     }

 useEffect(() => {
    setTimeout(() => {
      if (updateMessage) {
          setUpdateMessage('')
      }
      if (formError) {
            setFormError('')
      }
    }, 5000)
  }, [updateMessage, formError])

     return (

      <>
      {formError && <span className="errors">{formError}</span>}
          {updateMessage && <span>{updateMessage}</span>}
      
        <form onSubmit={handleSubmit(onSubmit)} id='form-contact' className='form-contact'>
          

          {Object.entries(emailInputs).map(([key, field], index) => {
            const property = key as EmailProperties
            const fieldId = `${idPrefix}-${key}-${index}`;

            return (
              <div id={field.label} key={key} className='form-control'>
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
                  ): field.type === "email" ? (
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
                  ): field.type === "textarea" && (
                    <textarea 
                id={fieldId}
                autoComplete={field.type}
                 className={`input input-bordered ${
                      errors[property] ? "input-error" : ""
                    }`}
                    {...register(property)}
                  />
                  
                  )}   
                   {errors[property] && (
                  <span className="errors">{errors[property]?.message}</span>
                )}
              </div>
            )
          })}

        <button
        type='submit' 
        className='btn-contact'
        disabled={isPending}
        >{isMutating ? "Sending message…" : "Send"}</button>
        </form>
        </>
     )

}