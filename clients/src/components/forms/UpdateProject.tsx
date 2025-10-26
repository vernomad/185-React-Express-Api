import {
  ProjectEdit,
  ProjectDuration,
  ProjectDurationType,
  ProjectPropertiesEdit,
  ProjectEditType,
} from "@models/project/ProjectLog";
import { useState, useTransition, useId, useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import MyFilePond from "../../lib/filePond";
 import DeleteImage from "./DeleteImage";

type FieldType = "textarea" | "text" | "file" | "files" | "checkboxes";

const ProjectInputs: Record<
  ProjectPropertiesEdit,
  {
    label?: string;
    type: FieldType;
    options?: ProjectDurationType[];
    className?: string;
    readOnly?: boolean;
    hidden?: boolean;
  }
> = {
  id: {
    type: "text",
    readOnly: true,
    hidden: true,
  },
  description: {
    type: "text",
    label: "Description",
  },
  duration: {
    type: "checkboxes",
    label: "duration",
    options: ProjectDuration.options as ProjectDurationType[],
  },
  mainImage: {
    type: "file",
    label: "Main image",
  },
  images: {
    type: "files",
    label: "Gallery images",
  },
};

type ProjectFormValues = Omit<ProjectEditType, "mainImage" | "images"> & {
  mainImage?: File;
  images?: File[];
};

interface Props {
  //token: string;
  project: ProjectEditType;
}
export default function UpdateProjectForm({ project }: Props) {
  const [formError, setFormError] = useState("");
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();
  const [isFetching, setIsFetching] = useState(false);
  const isMutating = isFetching || isPending;

  const [file, setFile] = useState<File | undefined>();
  const [files, setFiles] = useState<File[]>([]);
  const [filePondKey, setFilePondKey] = useState(0);
   // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [existingImages, _setExistingImages] = useState(project.images || []);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [existingMainImage, _setExistingMainImage] = useState(
    project.mainImage || null
  );

  const [updateProject, setUpdateProject] = useState(project);

  const idPrefix = useId();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(ProjectEdit),
    defaultValues: {
      ...updateProject,
      mainImage: undefined, // 🔥 we don’t preload an object here
      images: [],
    },
  });

  const onSubmit: SubmitHandler<ProjectFormValues> = async (data) => {
    try {
      setFormError("");
      setMessage("");

      if (
        file?.type &&
        !["image/png", "image/jpeg", "image/svg+xml", "image/webp"].includes(
          file.type
        )
      ) {
        throw new Error(
          "Invalid file type. Please upload a PNG, SVG, JPG, or WebP file."
        );
      }

      if (
        files.some(
          (f) =>
            ![
              "image/png",
              "image/jpeg",
              "image/svg+xml",
              "image/webp",
            ].includes(f.type)
        )
      ) {
        throw new Error(
          "One or more images have an invalid type. Please upload PNG, JPG, SVG, or WebP only."
        );
      }

      // 🔥 Build FormData
      const formData = new FormData();
      formData.append("name", data.name || "");
      formData.append("description", data.description || "");
      data.duration.forEach((d) => formData.append("duration", d));

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
      const res = await fetch(`/api/project/${project.id}`, {
        method: "PATCH",
        credentials: "include",
        body: formData,
      });
      const response = await res.json();
      //console.log("REspnse:", response);
      if (!res.ok) {
        setFormError(`🔥 ${response.message}`);
      } else {
        setUpdateProject(response.project);
        setMessage(`✅ ${response.message}`);
        startTransition(() => {
          reset({
            ...response.project,
            mainImage: undefined,
            images: [],
          });
          setFilePondKey((prev) => prev + 1);
          //    window.location.href = '/admin';
        });

        setIsFetching(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      if (message) {
        setMessage("");
      }
      if (formError) {
        setFormError("");
      }
    }, 5000);
  }, [message, formError]);

  return (
    <>
      <form
        id="form-upload"
        onSubmit={handleSubmit(onSubmit)}
        style={{ opacity: !isMutating ? 1 : 0.7 }}
      >
        <h2>Name: {project.name}</h2>

        {Object.entries(ProjectInputs).map(([key, field], index) => {
          const property = key as ProjectPropertiesEdit;
          const fieldId = `${idPrefix}-${key}-${index}`;

          return (
            <div key={key} className="form-control">
              {!field.hidden && (
                <label htmlFor={fieldId} className="form-label">
                  {field.label === "duration" ? (
                    <span>
                      Duration (defaults to less than 1½ years){" "}
                      <span>select in order of appearance</span>
                    </span>
                  ) : (
                    <span>{field.label || key}</span>
                  )}
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
              ) : field.type === "checkboxes" && field.options ? (
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
                                setValue("duration", [...selected, opt], {
                                  shouldValidate: true,
                                });
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
                <>
                  {existingMainImage && (
                    <div
                      key={index}
                      style={{
                        position: "relative",
                        width: "fit-content",
                      }}
                    >
                      <img
                        src={existingMainImage.full}
                        alt=""
                        style={{
                          width: "80px",
                          marginBottom: ".5rem",
                          border: "2px solid #aeaeaeff",
                        }}
                      ></img>
                      {/* <button
              type="button"
              className="action-button"
            >
              ×
            </button> */}
                      <DeleteImage
                        slug={project.slug}
                        imgUrl={existingMainImage.full}
                      />
                    </div>
                  )}
                  <MyFilePond
                    aria-label="Upload main image"
                    key={filePondKey}
                    onFilesChange={(files) => setFile(files[0])}
                    maxFiles={1}
                  />
                </>
              ) : (
                field.type === "files" && (
                  <>
                    {project && project.images && (
                      <div
                        style={{
                          display: "flex",
                          gap: ".2rem",
                          flexWrap: "wrap",
                        }}
                      >
                        {/* {project.images.map((image, index) => (
                      <picture key={index} >
                        <img src={image.full} alt="" style={{width: "80px", marginBottom: ".5rem", border: "2px solid #aeaeaeff"}}/>
                      </picture>
                    ))} */}
                        {existingImages.length > 0 && (
                          <div
                            style={{
                              display: "flex",
                              gap: ".5rem",
                              flexWrap: "wrap",
                              marginBottom: ".5rem",
                            }}
                          >
                            {existingImages.map((image, index) => (
                              <div
                                key={index}
                                style={{
                                  position: "relative",
                                  display: "inline-block",
                                }}
                              >
                                <img
                                  src={image.full}
                                  alt=""
                                  style={{
                                    width: "80px",
                                    // marginBottom: ".5rem",
                                    border: "2px solid #aeaeaeff",
                                  }}
                                />
                                <button
                                  type="button"
                                  className="action-button"
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                    <div className="filepond-images-upload">
                      <MyFilePond
                        aria-label="Upload images"
                        key={filePondKey}
                        onFilesChange={(newFiles) => setFiles(newFiles)}
                        maxFiles={15}
                      />
                    </div>
                  </>
                )
              )}

              {errors[property] && (
                <span className="errors">{errors[property]?.message}</span>
              )}
            </div>
          );
        })}
        {message && <span className="response-message">{message}</span>}
        {formError && <span className="errors">{formError}</span>}
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
  );
}
