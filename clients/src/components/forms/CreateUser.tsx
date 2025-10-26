import { UserPropertiesCreate, UserLogEntry, baseValidation } from "@models/user/UserLog";
import { useState, useTransition } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

type FieldType = "text" | "email" | "password";

const FormInputs: Record<
UserPropertiesCreate,
{
    label?: string;
    type: FieldType;
    options?: boolean[];
    className?: string;
}
> = {
    username: {
        type: "text",
    },
    email: {
        type: "email",
    },
    password: {
        type: "password",
    },
    passExt: {
        type: "password",
    }
};
//const nowTimestamp = new Date().getTime();

export default function CreateUser() {
  const [formError, setFormError] = useState("");
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();
  const [isFetching, setIsFetching] = useState(false);
  const isMutating = isFetching || isPending;

    const {
      register,
      handleSubmit,
      reset,
      formState: { errors },
    } = useForm<UserLogEntry>({
      resolver: zodResolver(baseValidation),
      defaultValues: {
        username: "",
        email: "",
        password: "",
        passExt: "",
      },
    });

    const onSubmit: SubmitHandler<UserLogEntry> = async (data) => {
        try {
            setFormError("");
            setMessage("");
            setIsFetching(true);
              const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: {
               "Content-Type": "application/json",
                 },
                 credentials: "include",
                 body: JSON.stringify(data),
        
              })
                const response = await res.json();
              if (!res.ok) {
                  setFormError(`🔥${response.message}`);
              } else {
                 setMessage(`✅ ${response.message}`); 
                 startTransition(() => {
                   reset();
              });
              }
        } catch (error) {
             console.log(error);
             setFormError("Server error something has gone wrong");
        }
    };

    return (
        <>
        <form id="form-new-user" onSubmit={handleSubmit(onSubmit)} style={{ opacity: !isMutating ? 1 : 0.7 }}>
             {formError && <span className="errors">{formError}</span>}
            {message && <span>{message}</span>}

            {Object.entries(FormInputs).map(([key, field], index) => {
                 const property = key as UserPropertiesCreate;
                 const id = `${key}-${index}`;

                 return (
                    <div key={key} className="form-control">
                         <label
                          htmlFor={id}
                          className="form-label"
                          style={{ textTransform: "capitalize" }}>
                         <span>{field.label || key}</span>
                       </label>
                       <input
                    id={id}
                    type={field.type}
                    autoComplete={
                      field.type === "email"
                        ? "email"
                        : field.type === "password"
                        ? "new-password"
                        : "username"
                    }
                    step="any"
                    className={`input input-bordered ${
                      errors[property] ? "input-error" : ""
                    }`}
                    {...register(property)}
                  />
                     {errors[property] && (
                  <span className="errors">{errors[property]?.message}</span>
                )}
                    </div>
                 )
            })}
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
