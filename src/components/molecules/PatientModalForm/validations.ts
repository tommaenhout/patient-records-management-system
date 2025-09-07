import { z } from 'zod';

export const patientSchema = z.object({
  name: z.string().min(1, 'Name is required').max(70, 'Name must be less than 70 characters'),
  description: z.string().min(1, 'Description is required').max(1000, 'Description must be less than 1000 characters'),
  website: z.string().optional().refine((val) => !val || z.string().url().safeParse(val).success, {
    message: 'Please enter a valid URL'
  }),
  avatar: z.string().optional(),
});