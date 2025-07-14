import { z } from "zod/v4";

export const UserValidator = z.object({
  userId: z.number().min(8).max(10),
  email: z.email().trim(),
  firstname: z.string().min(5).max(100).trim(),
  lastname: z.string().min(5).max(100).trim(),
  password: z.string().min(4).max(100).trim(),
  contact: z.string().min(10).max(15).trim(),
  address: z.string().min(5).max(200).trim(),
});

export const UserLoginValidator = z.object({
  email: z.email().trim(),
  password: z.string().min(4).max(100).trim(),
});
