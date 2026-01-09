import { z } from 'zod';

export const productSchema = z.object({
    title: z.string().min(3, 'Title must be at least 3 characters'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    price: z.coerce.number().min(0.01, 'Price must be greater than 0'),
    category: z.string().min(1, 'Category is required'),
});

export type ProductFormData = z.infer<typeof productSchema>;
