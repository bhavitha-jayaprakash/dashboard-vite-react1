import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import { ProductResponse } from '@/types/product';

interface UseProductsParams {
    limit?: number;
    skip?: number;
    search?: string;
    category?: string;
}

export const useProducts = ({ limit = 10, skip = 0, search = '', category = '' }: UseProductsParams) => {
    return useQuery({
        queryKey: ['products', { limit, skip, search, category }],
        queryFn: async () => {
            let endpoint = '/products';
            const params = new URLSearchParams();

            if (search) {
                endpoint = '/products/search';
                params.append('q', search);
            } else if (category) {
                endpoint = `/products/category/${category}`;
            }

            // Pagination params
            params.append('limit', limit.toString());
            params.append('skip', skip.toString());

            const response = await api.get<ProductResponse>(`${endpoint}?${params.toString()}`);
            return response.data;
        },
        placeholderData: (previousData) => previousData, // Keep previous data while fetching new data
    });
};

export const useCategories = () => {
    return useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            const response = await api.get<string[]>('/products/categories');
            // DummyJSON returns an array of objects for categories now, or strings. 
            // Let's handle string array which is typical for this endpoint documentation, 
            // but verify if it's objects (recent change). 
            // Update: /products/categories returns generic objects. 
            // Let's create a safer fetch or just assume strings for now based on older docs, 
            // but if it breaks we fix. Actually standard dummyJSON returns plain list of slugs or objects.
            // Let's just return response.data and cast as any[] for the moment to be safe or string[] if we trust docs.
            // Checking docs: https://dummyjson.com/products/categories -> returns objects {slug: string, name: string, url: string}
            return response.data as any;
        }
    });
};
