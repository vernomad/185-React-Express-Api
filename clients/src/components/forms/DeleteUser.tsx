import { useState, useTransition, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { baseUrl } from "../../lib/baseUrl";

// ✅ schema for validation
const deleteSchema = z.object({
  _id: z.string().min(1, "User ID is required"),
});

type DeleteUserInput = z.infer<typeof deleteSchema>;

export default function DeleteUserForm() {
  const [formError, setFormError] = useState("");
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();
  const [isFetching, setIsFetching] = useState(false);
  const isMutating = isFetching || isPending;

//   let baseUrl = "";
//   if (import.meta.env.MODE === "development") {
//     baseUrl = import.meta.env.VITE_DEV_URL;
//   } else {
//     baseUrl = import.meta.env.VITE_BASE_URL;
//   }

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DeleteUserInput>({
    resolver: zodResolver(deleteSchema),
    defaultValues: { _id: "" },
  });

  const onSubmit = async (data: DeleteUserInput) => {
    try {
      setFormError("");
      setMessage("");
      setIsFetching(true);

      const res = await fetch(`${baseUrl}/api/auth/delete`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const response = await res.json();
      if (!res.ok) {
        setFormError(response.message || "Error deleting user");
      } else {
        setMessage(response.message);
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
      id="form-delete-user"
      onSubmit={handleSubmit(onSubmit)}
      style={{ opacity: !isMutating ? 1 : 0.7 }}
    >
      {formError && <span className="errors">{formError}</span>}
      {message && <span>{message}</span>}

      <div className="form-control">
        <label htmlFor="_id" className="form-label">
          <span>User ID</span>
        </label>
        <input
          id="_id"
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

      <button
        type="submit"
        className="btn-submit-login"
        disabled={isPending}
        style={{ opacity: !isMutating ? 1 : 0.7 }}
      >
        Delete User
      </button>
    </form>
  );
}
