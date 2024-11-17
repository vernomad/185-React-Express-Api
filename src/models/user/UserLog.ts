import { z } from 'zod';
import { isValid as isValidDate } from "date-fns";

const errors = {
  joinDateString: "Join Date must be a valid date.",
  joinDateTimestamp: "Join Date must be a valid timestamp.",
  password: "contain at least 3ch or withing 21ch"
};


export const UserRole = z.enum([ "Admin", "Editor"]);
export type UserRoleType = z.infer<typeof UserRole>;

export const UserRegistrationSchema = z.object({
  username: z.string(),
  email: z.string().email(),
  password: z.string().min(3, errors.password),
  roles: UserRole.default("Editor").optional(),
});

export const UserLoginSchema = z.object({
  username: z.string(),
  password: z.string().min(3, errors.password),
});

const baseValidation = z.object({
  username: z.string(),
  email: z.string().email(),
  image: z.string().url().optional(),
  password: z.string().min(3, errors.password),
  roles: UserRole.default("Editor").optional()
});

export const UserLogEntry = baseValidation.extend({
  joinDate: z
    .number()
    .or(z.string())
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
    }),
});

export const UserLogEntryWithId = UserLogEntry.extend({ _id: z.string() });

export const UserLogProperties =  baseValidation.keyof().Enum;
export type UserLogProperty = keyof typeof UserLogProperties;



export type UserLogEntryWithId = z.infer<typeof UserLogEntryWithId>;
export type UserLogEntry = z.infer<typeof UserLogEntry>;