import { useState, useTransition, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { baseUrl } from "../../lib/baseUrl";

// ✅ schema for validation
const deleteSchema = z.object({
  _id: z.string().min(1, "Project ID is required"),
});

type DeleteInput = z.infer<typeof deleteSchema>;

interface DirProp {
  dir: string;
  token?: string;
}

export default function DeleteForm({dir, token}: DirProp) {
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
  } = useForm<DeleteInput>({
    resolver: zodResolver(deleteSchema),
    defaultValues: { _id: "" },
  });

  const onSubmit = async (data: DeleteInput) => {
    try {
      setFormError("");
      setMessage("");
      setIsFetching(true);

      const res = await fetch(`${baseUrl}/api/${dir}/${data._id}`, {
        method: "DELETE",
         headers: { "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
         },
        body: JSON.stringify(data),
      });

      const response = await res.json();
      if (!res.ok) {
        setFormError(`🔥${response.message }`);
      } else {
        setMessage(`✅ ${response.message}`); 
        startTransition(() => reset());
      }
    } catch (err) {
      console.error(err);
      setFormError("Server error, something went wrong");
    } finally {
      setIsFetching(false);
    }
  };

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
      id={`form-delete-${dir}`}
      onSubmit={handleSubmit(onSubmit)}
      style={{ opacity: !isMutating ? 1 : 0.7 }}
    >
      <div className="form-control">
        <label htmlFor={`${dir}_id`} className="form-label">
          <span style={{textTransform: "capitalize"}}>{`${dir} ID`}</span>
        </label>
        <input
          id={`${dir}_id`}
          type="text"
          autoComplete="off"
          className={`input input-bordered ${
            errors._id ? "input-error" : ""
          }`}
          {...register("_id")}
        />
        {errors._id && (
          <span className="errors">{errors._id.message}</span>
        )}
      </div>
         {formError && <span className="errors">{formError}</span>}
       {message && <span className="response-message">{message}</span>}
      <button
        type="submit"
        className="btn-submit"
        disabled={isPending}
        style={{ opacity: !isMutating ? 1 : 0.7 }}
      >
        {`Delete ${dir}`}
      </button>
    </form>
  );
}
