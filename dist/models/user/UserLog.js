"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserLogProperties = exports.UserLogEntryWithId = exports.UserLogEntry = exports.UserLoginSchema = exports.UserRegistrationSchema = exports.UserRole = void 0;
const zod_1 = require("zod");
const date_fns_1 = require("date-fns");
const errors = {
    joinDateString: "Join Date must be a valid date.",
    joinDateTimestamp: "Join Date must be a valid timestamp.",
    password: "contain at least 3ch or withing 21ch"
};
exports.UserRole = zod_1.z.enum(["Admin", "Editor"]);
exports.UserRegistrationSchema = zod_1.z.object({
    username: zod_1.z.string(),
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(3, errors.password),
    roles: exports.UserRole.default("Editor").optional(),
});
exports.UserLoginSchema = zod_1.z.object({
    username: zod_1.z.string(),
    password: zod_1.z.string().min(3, errors.password),
});
const baseValidation = zod_1.z.object({
    username: zod_1.z.string(),
    email: zod_1.z.string().email(),
    image: zod_1.z.string().url().optional(),
    password: zod_1.z.string().min(3, errors.password),
    roles: exports.UserRole.default("Editor").optional()
});
exports.UserLogEntry = baseValidation.extend({
    joinDate: zod_1.z
        .number()
        .or(zod_1.z.string())
        .transform((date, ctx) => {
        if (typeof date === "string") {
            const validDate = (0, date_fns_1.isValid)(new Date(date));
            if (!validDate) {
                ctx.addIssue({
                    code: zod_1.z.ZodIssueCode.custom,
                    message: "Invalid date string.",
                });
                return zod_1.z.NEVER;
            }
            return new Date(date).getTime();
        }
        return date;
    })
        .refine(date_fns_1.isValid, {
        message: errors.joinDateTimestamp,
    }),
});
exports.UserLogEntryWithId = exports.UserLogEntry.extend({ _id: zod_1.z.string() });
exports.UserLogProperties = baseValidation.keyof().Enum;
