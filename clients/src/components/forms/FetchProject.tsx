import { useState, useTransition, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ProjectEditType,
} from "@models/project/ProjectLog";
// import useProjectById from "../../hooks/useProjectById";
import { baseUrl } from "../../lib/baseUrl";


const fetchSchema = z.object({
  id: z.string().min(1, "Project ID is required"),
});

type FetchProjectInput = z.infer<typeof fetchSchema>;

interface Props {
//token: string; 
onProjectFetched: (project: ProjectEditType) => void;
}

export default function FetchProjectForm({ onProjectFetched }: Props) {
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
  } = useForm<FetchProjectInput>({
    resolver: zodResolver(fetchSchema),
    defaultValues: { id: ""},
  })

  const onSubmit = async (data: FetchProjectInput) => {
    const id = data.id?.trim()
    if (!id || id.length !== 36) {
  setFormError("Project ID must be a valid UUID string");
  return;
}
    try {
      setFormError("");
      setMessage("");
      setIsFetching(true);

      const res =  await fetch(`${baseUrl}/api/project/${id}`)

      const response = await res.json()
      if (!res.ok) {
        setFormError(response.message || "Error fetching project");
      } else {
        console.log("Response",response)
        setMessage(response.message);
        startTransition(() => reset());
        onProjectFetched(response);
      }

    } catch (err) {
        console.error(err);
      setFormError("Server error, something went wrong");
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
        <label htmlFor="project_id" className="form-label">
          <span>Project ID</span>
        </label>
        <input
          id="project_id"
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
        Fetch Project
      </button>
    </form>
  );
}