import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserUpdateSchema, UserLogEntryWithId, UserLogProperty, UserRole, UserRoleType } from "../../../../models/user/UserLog"; // adjust path

type FieldType = "email" | "text" | "file" | "password" | "checkboxes";

// import { UserLogEntryWithId } from "../../types/AppActionTypes";
const UserLogInputs: Record<
UserLogProperty,
    {
        label?: string;
        type: FieldType;
        className?: string;
        options?: UserRoleType[]
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
    label: "Password",
  },
  passExt: {
    type: "password",
    label: "PassExt"
  },
  image: {
    type: "text",
  },
  roles: {
    type: "checkboxes",
    label: "Roles",
    options: UserRole.options as UserRoleType[],
  }

}
interface Props {
  user: UserLogEntryWithId;
  token: string; 
}

export default function UpdateUserForm({ user, token}: Props) {
    const [formError, setFormError] = useState("");
    const [message, setMessage] = useState("");
    // const [isPending, startTransition] = useTransition();
    // const [isFetching, setIsFetching] = useState(false);
    // const isMutating = isFetching || isPending;
  
    // const [file, setFile] = useState<File | undefined>();
  // const [data, setData] = useState<User | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<UserLogEntryWithId>({
    resolver: zodResolver(UserUpdateSchema),
    defaultValues: {
      ...user,
      passExt: '',
      password: '',
    },
  });

  
    useEffect(() => {
  setTimeout(() => {
      if (message || formError) {
      setMessage('')
      setFormError('')
      }
  }, 5000)
    }, [message, formError])

  const onSubmit = async (data: UserLogEntryWithId) => {
    try {
     setMessage('')
     setFormError('')

      //  if (
      //   file?.type && 
      //   !["image/png", "image/jpeg", "image/svg+xml", "image/webp"].includes(file.type)
      // ) {
      //   throw new Error("Invalid file type. Please upload a PNG, SVG, JPG, or WebP file.");
      // }



      const res = await fetch(`/api/user/${user._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
         },
        body: JSON.stringify(data),
      });
      const result = await res.json();

      if (!res.ok) setFormError(result.message || "Failed to update user");
      setMessage("✅ User updated successfully!");
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to update user.");
    }
  };

  return (
    <form
    id="form-update-user"
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 p-4 border rounded"
    >
    {formError && <span className="errors">{formError}</span>}
          {message && <span>{message}</span>}

    {Object.entries(UserLogInputs).map(([key, field], index) => {
       const property = key as UserLogProperty;
            const id = `${key}-${index}`;

            return (
              
              <div key={key} className="form-control">
                <label
                  htmlFor={id}
                  className="form-label"
                  style={{ textTransform: "capitalize" }}
                >
                   {field.label === "Password" ? (
                 
                     <span>Password (leave blank to keep current)</span>
                  ): field.label === "Roles" ? (
                     <span>Roles (comma separated)</span>
                  ): field.label === "PassExt" ? (
                     <span>PassExt (add extra characters to your password)</span>
                  ): (
                    <span>{field.label || key}</span>
                  )}
                
                </label>
               
              {field.type === "email" ? (
                <input
                    id={id}
                    type={field.type}
                    autoComplete={field.type}
                    step="any"
                    className={`input input-bordered ${
                      errors[property] ? "input-error" : ""
                    }`}
                    {...register(property)}
                  />
              ): field.type === "password" ? (
                 <input
                    id={id}
                    type={field.type}
                    autoComplete={field.type}
                    step="any"
                    className={`input input-bordered ${
                      errors[property] ? "input-error" : ""
                    }`}
                    {...register(property)}
                  />
              ): field.type === "checkboxes"  && field.options ?  (
                 <div className="form-checkbox">
                    {field.options.map((opt, i) => {
                      const selected = watch("roles") || [];
                       const inputId = `${id}-${i}`;

                      return (
                        <div key={opt}>
                          <input
                            aria-label="role selection checkbox"
                            id={inputId}
                            type="checkbox"
                            className="checkbox"
                            checked={selected.includes(opt)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setValue("roles", [...selected, opt], { shouldValidate: true });
                              } else {
                                setValue(
                                  "roles",
                                  selected.filter((d) => d !== opt),
                                  { shouldValidate: true }
                                );
                              }
                            }}
                          />
                          {opt}
                        </div>
                      );
                    })}
                  </div>
              ): (
                <input
                    id={id}
                    type={field.type}
                    autoComplete={field.type}
                    step="any"
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



 {/* <div className="form-control">
  <label htmlFor="username" className="form-label">
    <span>Username</span>
  </label>
  <input
    {...register("username")}
    id="username"     // 👈 explicit
    name="username"   // 👈 optional, but keeps DOM happy
    type="text"
    autoComplete="off"
  />
      
        {errors.username && (
          <span className="text-red-500">{errors.username.message}</span>
        )}
      </div>
       <div className="form-control">
        <label htmlFor="email"><span>Email</span></label>
        <input
        {...register("email")}
          type="email"
          id="email"
          name="email"
           autoComplete="off"
        />
        {errors.email && (
          <span className="text-red-500">{errors.email.message}</span>
        )}
      </div>

       <div className="form-control">
        <label htmlFor="password" className="block"><span>Password (leave blank to keep current)</span></label>
        <input
        {...register("password")}
          type="password"
          id="password"
          name="password"
          autoComplete="off"
        />
        {errors.password && (
          <span className="text-red-500">{errors.password.message}</span>
        )}
      </div>

       <div className="form-control">
        <label htmlFor="roles" className="block"><span>Roles (comma separated)</span></label>
        <input
          type="text"
          {...register("roles", {
            setValueAs: (val) =>
              typeof val === "string" ? val.split(",").map((r) => r.trim()) : val,
          })}
          id="roles"
          name="roles"
        />
        {errors.roles && (
          <span className="text-red-500">{errors.roles.message as string}</span>
        )}
      </div>

       <div className="form-control">
        <label htmlFor="image" className="block"><span>Image URL</span></label>
        <input
          type="text"
          {...register("image")}
          id="image"
          name="image"
        />
        {errors.image && (
          <span className="text-red-500">{errors.image.message}</span>
        )}
      </div> */}

      <button
        type="submit"
        disabled={isSubmitting}
        className="btn-submit-login"
      >
        Update User
      </button>

      {message && <p>{message}</p>}
    </form>
  );
}
