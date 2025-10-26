import { z } from 'zod';
import { v4 as uuidv4 } from "uuid";
import slugify from '../utils/slugify';
// import DOMPurify from 'isomorphic-dompurify';

const err = {
    name: "Project name must be between 4 and 21 characters"
}

const imagePairSchema = z.object({
  full: z.string(),
  thumb: z.string(),
});

export const ProjectDuration = z.enum([ "Less than", "Aprox", "1 year", "1½ years", "2 years", "3 years"])
export type ProjectDurationType = z.infer<typeof ProjectDuration>

export const ProjectDurationArray = z.array(ProjectDuration);


export const baseValidation = z.object({
    id: z.string().uuid().default(() => uuidv4()),
    name: z.string().min(4, err.name).max(21, err.name),
    description:  z.string().optional(),
    duration: ProjectDurationArray.default(["Less than", "1½ years"]),
    mainImage: imagePairSchema.optional(),
    images: z.array(imagePairSchema).optional(),
    slug: z.string().optional()
});

export const ProjectEdit = baseValidation
.partial()
.extend({
    id: z.string(),
    name: z.string().min(4, err.name).max(21, err.name).optional(),
    description: z.string().optional(),
    duration: ProjectDurationArray,
     mainImage: imagePairSchema.optional(),
  images: z.array(imagePairSchema).optional(),
  slug: z.string()
}).refine(
  (data) =>
    (data.mainImage && data.images && data.images.length > 0) ||
    (!data.mainImage && (!data.images || data.images.length === 0)),
  {
    message: "If updating images, you must provide both mainImage and images.",
    path: ["mainImage"], 
  }
)

export type ProjectEditType = z.infer<typeof ProjectEdit>

export const ProjectEntry = baseValidation.transform((data) => ({
    ...data,
    slug: slugify(data.name),
}))

export type ProjectEntry = z.infer<typeof ProjectEntry>

export const ProjectLogProperties = baseValidation.keyof().Enum

export type ProjectProperties = keyof typeof ProjectLogProperties;
export type ProjectCreate = Exclude<
ProjectProperties,
    "id" | "slug" 
>
export type ProjectPropertiesEdit = Exclude<
ProjectProperties,
   "slug" | "name" 
>