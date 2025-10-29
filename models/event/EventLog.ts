// schemas/calendar.ts
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
// import slugify from '../utils/slugify';

const imagePairSchema = z.object({
  full: z.string(),
  thumb: z.string(),
});

// const now = new Date();
// const localISO = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
//   .toISOString()
//   .slice(0, 16);

export const CalendarEventSchema = z.object({
  id: z
    .string()
    .uuid({ message: "id must be a valid UUID" })
    .default(() => uuidv4()),
  title: z.string().min(2, { message: "Title must be at least 2 characters" }),
  description: z.string().optional(),
  image: imagePairSchema.optional(),
  date: z.string().optional(),
  start: z.coerce
    .date()
    .refine((d) => !Number.isNaN(d.getTime()), { message: "start must be a valid date/time" }),
  end: z.coerce
    .date()
    .refine((d) => !Number.isNaN(d.getTime()), { message: "end must be a valid date/time" }),
  location: z.string().optional(),
  createdBy: z.string().nonempty({ message: "createdBy is required" }).default("admin"),
  published: z.coerce.boolean().default(true),
  slug: z.string().optional(),
})

export const CalendarEventEntry = CalendarEventSchema.transform((data) => ({
  ...data,
}))
.refine((obj) => obj.end.getTime() > obj.start.getTime(), {
  message: "end must be after start",
  path: ["end"],
});
 
export type CalendarEventEntry = z.infer<typeof CalendarEventEntry>
// TypeScript types
export type CalendarEvent = z.infer<typeof CalendarEventSchema>;


export const CreateCalendarEventSchema = CalendarEventSchema.partial({
  id: true,
})
  .required({
    title: true,
    start: true,
    end: true,
  });

const PartialEvent = CalendarEventSchema.partial();
// Edit/update schema (all fields optional except you might require id)
export const UpdateCalendarEventSchema = PartialEvent.extend({
  id: CalendarEventSchema.shape.id, // reuse the original id schema
});

export type EventUpdateType = z.infer<typeof UpdateCalendarEventSchema>;

export const CalendarEventProperties = CalendarEventSchema.keyof().Enum

export type EventProperties = keyof typeof CalendarEventProperties
export type EventCreateProperties = Exclude<
EventProperties,
"id" | "slug"
>
export type EventUpdateProperties = Exclude< 
EventProperties,
"image"
>


