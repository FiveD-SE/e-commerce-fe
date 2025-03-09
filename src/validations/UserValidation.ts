import { z } from 'zod';

export const UserValidation = {
  create: z.object({
    email: z.string().email(),
    password: z.string().min(6),
    name: z.string().min(3),
  }),
  update: z.object({
    email: z.string().email().optional(),
    password: z.string().min(6).optional(),
    name: z.string().min(3).optional(),
  }),
  login: z.object({
    email: z.string().email(),
    password: z.string().min(6),
  })
}