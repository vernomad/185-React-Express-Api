import { z } from 'zod';
import { isValid as isValidDate } from "date-fns";

const errors = {
  joinDateString: "Join Date must be a valid date.",
  joinDateTimestamp: "Join Date must be a valid timestamp.",
  password: "Must contain at least 3 and withing 21 characters",
  passext: "Must contain at least 1 and withing5 characters",
  username: "Must contain at least 3 and withing 21 characters",
};


export const UserRole = z.enum([ "admin", "editor", "user"]);
export type UserRoleType = z.infer<typeof UserRole>;

export const UserRolesArray = z
  .array(UserRole) // Ensure each role in the array is valid
  .default(["admin"]) // Provide a default array with a single "user" role
  .optional(); // Make it optional if necessary

// export const UserRegistrationSchema = z.object({
//   username: z.string(),
//   email: z.string().email(),
//   password: z.string().min(3, errors.password),
//   roles:  UserRolesArray,
// });

export const UserLoginSchema = z.object({
  username: z.string().min(3, errors.username).max(21, errors.username),
  password: z.string().min(3, errors.password).max(21, errors.password),
});

export const baseValidation = z.object({
  username: z.string().min(3, errors.username).max(21, errors.username),
  email: z.string().email(),
  image: z.string().url().default('/assets/img/user.svg').optional(),
  password: z.string().min(3, errors.password).max(21, errors.password),
  passExt: z.string().min(1, errors.passext).max(5, errors.passext),
  roles:  UserRolesArray,
});
export const UpdateSchema = z.object({
  username: z.string().min(3, errors.username).max(21, errors.username).optional(),
  email: z.string().email().optional(),
  image: z.string().optional(),
  password: z.string().optional(),
  passExt: z.string().optional(),
  roles:  UserRolesArray,
});

export const UserLogEntry = baseValidation.extend({
  joinDate: z
    .number()
    .or(z.string())
    .optional()
    .transform((date, ctx) => {
      if (typeof date === "string") {
        const validDate = isValidDate(new Date(date));
        if (!validDate) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Invalid date string.",
          });
          return z.NEVER;
        }
        return new Date(date).getTime();
      }
      return date;
    })
    .refine(isValidDate, {
      message: errors.joinDateTimestamp,
    })
    
});

export const UserUpdateSchema = UpdateSchema.partial().extend({
  _id: z.string(),
}).refine(
  (data) => Object.keys(data).some((key) => key !== "_id"),
  { message: "At least one field must be updated." }
);

export const UserLogEntryWithId = UserLogEntry.extend({ _id: z.string() });


export const UserLogProperties =  baseValidation.keyof().Enum;
export type UserLogProperty = keyof typeof UserLogProperties;
export type UserPropertiesCreate = Exclude<
UserLogProperty,
"image" | "roles"
>
// export type UserPropertyUpdate = Exclude<
// UserLogProperty,
// "image" | "roles"
// >

export type UserLogEntryWithId = z.infer<typeof UserLogEntryWithId>;
export type UserLogEntry = z.infer<typeof UserLogEntry>;