import { z } from "zod";

export const signupSchema = z
  .object({
    username: z
      .string()
      .min(1, "Username is required")
      .max(50, "Username too long"),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Invalid email address"),
    number: z
      .string()
      .min(10, "Number must be at least 10 digits")
      .max(15, "Number too long")
      .regex(/^\d+$/, "Number must contain only digits"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters"),
    retype: z.string(),
  })
  .refine((data) => data.password === data.retype, {
    message: "Passwords do not match",
    path: ["retype"], 
  });