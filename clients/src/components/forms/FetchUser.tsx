import { useState, useTransition, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserLogEntryWithId } from "@models/user/UserLog";


const fetchSchema = z.object({
  _id: z.string().min(1, "User ID is required"),
});

type FetchUserInput = z.infer<typeof fetchSchema>;

interface Props {
token: string; 
onUserFetched: (user: UserLogEntryWithId) => void;
}

export default function FetchUserForm({ token, onUserFetched }: Props) {
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
  } = useForm<FetchUserInput>({
    resolver: zodResolver(fetchSchema),
    defaultValues: { _id: "" },
  });

  const onSubmit = async (data: FetchUserInput) => {
     const id = data._id?.trim();
     console.log("Data.id", id)
  if (!id || id.length !== 24) {
    setFormError("User ID must be a 24-character hex string");
    return;
  }
    try {
      setFormError("");
      setMessage("");
      setIsFetching(true);

      const res = await fetch(`/api/user/${id}`, {
      method: "GET",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      credentials: "include",
    });


      const response = await res.json();
      if (!res.ok) {
        setFormError(response.message || "Error fetching user");
      } else {
         console.log("User data fetched:", response);
        setMessage(response.message);
        startTransition(() => reset());
        onUserFetched(response);
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
        <label htmlFor="user_id" className="form-label">
          <span>User ID</span>
        </label>
        <input
          id="user_id"
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
        Fetch User
      </button>
    </form>
  );

}



