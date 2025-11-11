import {
  ProjectEntry,
  ProjectCreate,
  baseValidation,
  ProjectDuration,
  ProjectDurationType,
} from "@models/project/ProjectLog";
import { useState, useTransition, useId, useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import MyFilePond from "../../lib/filePond";

type FieldType = "textarea" | "text" | "file" | "files" | "checkboxes";



const ProjectInputs: Record<
  ProjectCreate,
  {
    label?: string;
    type: FieldType;
    options?: ProjectDurationType[];
    className?: string;
  }
> = {
  name: {
    type: "text",
    className: "projectName",
  },
  description: {
    type: "text",
    className: "description",
  },
  duration: {
    type: "checkboxes",
    label: "duration",
   options: ProjectDuration.options as ProjectDurationType[],
  },
  mainImage: {
    type: "file",
    label: "mainImage",
  },
  images: {
    type: "files",
    label: "images",
  },
};

type ProjectFormValues = Omit<ProjectEntry, "mainImage" | "images"> & {
  mainImage?: File;
  images?: File[];
};


export default function CreateProject() {
  const [formError, setFormError] = useState("");
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();
  const [isFetching, setIsFetching] = useState(false);
  const isMutating = isFetching || isPending;

  const [file, setFile] = useState<File | undefined>();
  const [files, setFiles] = useState<File[]>([]);
  const [filePondKey, setFilePondKey] = useState(0);

  const idPrefix = useId();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(baseValidation),
    defaultValues: {
      name: "",
      duration: [],
    },
  });

  const onSubmit: SubmitHandler<ProjectFormValues> = async (data) => {
    try {
      setFormError("");
      setMessage("");

       if (
        file?.type && 
        !["image/png", "image/jpeg", "image/svg+xml", "image/webp"].includes(file.type)
      ) {
        throw new Error("Invalid file type. Please upload a PNG, SVG, JPG, or WebP file.");
      }

      if (files.some(f => !["image/png", "image/jpeg", "image/svg+xml", "image/webp"].includes(f.type))) {
      throw new Error("One or more images have an invalid type. Please upload PNG, JPG, SVG, or WebP only.");
      }

          // 🔥 Build FormData
      const formData = new FormData();
      formData.append("name", data.name)
      formData.append("description", data.description || '')
      //formData.append("duration", JSON.stringify(data.duration));
      data.duration.forEach(d => formData.append("duration", d));

      if (file) {
      formData.append("mainImage", file);
      // formData.append("images", file[])
      }
       if (files.length > 0) {
         files.forEach((f) => {
           formData.append("images", f);
         });
       }

    
      setIsFetching(true);
      const res = await fetch("/api/project", {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      const response = await res.json();
      //console.log("REspnse:", response);
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
      console.log(error);
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
          id="form-upload"
          onSubmit={handleSubmit(onSubmit)}
          style={{ opacity: !isMutating ? 1 : 0.7 }}
        >
          

          {Object.entries(ProjectInputs).map(([key, field], index) => {
            const property = key as ProjectCreate;
            const fieldId = `${idPrefix}-${key}-${index}`;

            return (
              <div key={key} className="form-control">
              <label
                  htmlFor={fieldId}
                  className="form-label"
                  style={{ textTransform: "capitalize" }}
                >
                  {field.label === "duration" ? (
                    <span>Duration (defaults to less than 1½ years) <span>select in order of appearance</span></span>
                  ): (
                    <span>{field.label || key}</span>
                  )}
                 
                </label>
                
                {field.type === "text" ? (
                  <input
                    id={fieldId}
                    type={field.type}
                    autoComplete={field.type}
                    step="any"
                    className={`input input-bordered ${
                      errors[property] ? "input-error" : ""
                    }`}
                    {...register(property)}
                  />
                ) : field.type === "checkboxes"  && field.options ?  (
                  <>
                  
                   <div className="form-checkbox">
                    {field.options.map((opt, i) => {
                      const selected = watch("duration") || [];
                       const inputId = `${fieldId}-${i}`;

                      return (
                        <div key={opt}>
                          <input
                            aria-label="duration selection checkbox"
                            id={inputId}
                            type="checkbox"
                            className="checkbox"
                            checked={selected.includes(opt)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setValue("duration", [...selected, opt], { shouldValidate: true });
                              } else {
                                setValue(
                                  "duration",
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
                  </>
                ) : field.type === "file" ? (
                  <MyFilePond
                    aria-label="Upload main image"
                    key={filePondKey}
                    onFilesChange={(files) => setFile(files[0])}
                    maxFiles={1}
                  />

                 ) : field.type === "files" && (
                  <div className="filepond-images-upload">
                  <MyFilePond 
                    aria-label="Upload images"
                    key={filePondKey}
                    onFilesChange={(newFiles) => setFiles(newFiles)}
                    maxFiles={25}
                  />
                  </div>
                )}
             
                {errors[property] && (
                  <span className="errors">{errors[property]?.message}</span>
                )}
                
              </div>
            );
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
