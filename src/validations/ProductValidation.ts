import { z } from 'zod';

export const ProductValidation = {
  create: z.object({
    name: z.string().min(3),
    price: z.number().positive(),
    image: z.string().url(),
    description: z.string().min(10),
    stock: z.number().positive(),
    category: z.string().min(3),
  }),
  update: z.object({
    name: z.string().min(3).optional(),
    price: z.number().positive().optional(),
    image: z.string().url().optional(),
    description: z.string().min(10).optional(),
    stock: z.number().positive().optional(),
    category: z.string().min(3).optional(),
  })
}