import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { Product, ProductResponse } from '@/types/product';
import { ProductFormData } from '@/schemas/product';

export const useAddProduct = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (newProduct: ProductFormData) => {
            const response = await api.post<Product>('/products/add', newProduct);
            return response.data;
        },
        onSuccess: (data) => {
            // Optimistic Update: Manually add the new product to the cache
            // Note: DummyJSON adds it but ID might not be sequential or real persistence isn't there, 
            // but for UI simulation we append it.

            // We look for 'products' query. Since useProducts has search/category params which are complex keys,
            // we might just invalidate or try to inject into a generic list if possible.
            // For now, let's invalidate to force refresh which is safer, or try to update specific queries.
            // A better approach for this demo:

            queryClient.setQueriesData({ queryKey: ['products'] }, (oldData: any) => {
                if (!oldData) return oldData;
                // Invalidate isn't enough for DummyJSON as it doesn't actually persist additions for other requests.
                // We MUST manually modify the cache to "fake" persistence for the session.

                return {
                    ...oldData,
                    products: [data, ...oldData.products],
                    total: oldData.total + 1,
                };
            });
        },
    });
};

export const useEditProduct = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, ...updatedData }: ProductFormData & { id: number }) => {
            const response = await api.put<Product>(`/products/${id}`, updatedData);
            return response.data;
        },
        onSuccess: (data) => {
            // Optimistic update for the edited product in the list
            queryClient.setQueriesData({ queryKey: ['products'] }, (oldData: any) => {
                if (!oldData) return oldData;
                return {
                    ...oldData,
                    products: oldData.products.map((product: Product) =>
                        product.id === data.id ? data : product
                    ),
                };
            });
        },
    });
};
