import { z } from "zod";

export const errors = {
    name: "Your name must be between 3 and 21 characters",
    subject: "Subject has min of 3 and max 50 characters required",
    message: "Message has min of 5 and max 500 characters required"
}

export const emailSchema = z.string()
  .min(5, "Email must be at least 5 characters")
  .max(50, "Email cannot exceed 50 characters")
  .email("Invalid email format")
  .refine(
    email => {
      // Additional professional checks
      const [_, domain] = email.split('@');
      return (
        !email.startsWith('.') &&
        !email.endsWith('.') &&
        !email.includes('..') &&
        domain?.includes('.') &&
        domain.split('.').every(part => part.length > 0)
      );
    },
    {
      message: "Invalid email structure"
    }
  ).transform(email => email.toLowerCase().trim());

export const validationShema = z.object({
    name: z.string().min(3, errors.name).max(21, errors.name).optional(),
    lastname: z.string().trim().optional(),
    email: emailSchema,
    email2: emailSchema,
    site: z.string().optional(),
    subject: z.string().min(5, errors.subject).max(50, errors.subject),
    message: z.string().min(5, errors.message).max(500, errors.message)
})

export const EmailEntry = validationShema.transform((data) => ({
  ...data
}))
export type EmailEntry = z.infer<typeof EmailEntry>

export type ValidationSchema = z.infer<typeof validationShema>

export const EmailValidationProperties = validationShema.keyof().Enum

export type EmailProperties = keyof typeof EmailValidationProperties