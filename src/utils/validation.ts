// Shared validation primitives.
// Every form should build its schema from these helpers so validation
// messages and rules stay consistent across the app.

import { z } from "zod";

export const required = (label = "This field") =>
  z.string().trim().min(1, { message: `${label} is required` });

export const emailField = z
  .string()
  .trim()
  .min(1, { message: "Email is required" })
  .email({ message: "Enter a valid email address" })
  .max(255);

export const optionalEmail = z
  .string()
  .trim()
  .max(255)
  .refine((v) => v === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), {
    message: "Enter a valid email address",
  });

export const phoneField = z
  .string()
  .trim()
  .max(32)
  .refine((v) => v === "" || /^[+\d][\d\s\-().]{5,}$/.test(v), {
    message: "Enter a valid phone number",
  });

export const dateField = z
  .string()
  .trim()
  .refine((v) => v === "" || !Number.isNaN(Date.parse(v)), {
    message: "Enter a valid date",
  });

export const positiveNumber = z
  .number({ message: "Enter a number" })
  .nonnegative({ message: "Must be zero or greater" });

/** Convert a ZodError into a { field: message } map for form UIs. */
export function toFieldErrors(err: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of err.issues) {
    const path = issue.path.join(".") || "_";
    if (!out[path]) out[path] = issue.message;
  }
  return out;
}

/** Run a schema and return a discriminated result. */
export function validate<T>(
  schema: z.ZodType<T>,
  input: unknown,
): { ok: true; data: T } | { ok: false; errors: Record<string, string> } {
  const parsed = schema.safeParse(input);
  if (parsed.success) return { ok: true, data: parsed.data };
  return { ok: false, errors: toFieldErrors(parsed.error) };
}
