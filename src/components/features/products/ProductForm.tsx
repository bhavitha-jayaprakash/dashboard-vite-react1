import { useState, ChangeEvent } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    TextField,
    Button,
    Stack,
    MenuItem,
    Box,
    CircularProgress,
    Typography,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { productSchema, ProductFormData } from '@/schemas/product';
import { useCategories } from '@/hooks/useProducts';

interface ProductFormProps {
    defaultValues?: ProductFormData;
    onSubmit: (data: ProductFormData) => void;
    isLoading?: boolean;
    onCancel: () => void;
}

export default function ProductForm({
    defaultValues = {
        title: '',
        description: '',
        price: 0,
        category: '',
    },
    onSubmit,
    isLoading,
    onCancel,
}: ProductFormProps) {
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<ProductFormData>({
        resolver: zodResolver(productSchema),
        defaultValues,
    });

    const { data: categories } = useCategories();
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 1 }}>
            <Stack spacing={3}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                    {previewUrl ? (
                        <Box
                            component="img"
                            src={previewUrl}
                            alt="Product Preview"
                            sx={{ width: '100%', maxHeight: 200, objectFit: 'contain', borderRadius: 1, border: '1px solid #ddd' }}
                        />
                    ) : (
                        <Box
                            sx={{ width: '100%', height: 150, bgcolor: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 1, border: '1px dashed #ccc' }}
                        >
                            <Typography variant="body2" color="text.secondary">No Image Selected</Typography>
                        </Box>
                    )}
                    <Button
                        component="label"
                        variant="outlined"
                        startIcon={<CloudUploadIcon />}
                        fullWidth
                    >
                        Upload Image
                        <input
                            type="file"
                            hidden
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                    </Button>
                </Box>

                <Controller
                    name="title"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="Product Title"
                            fullWidth
                            error={!!errors.title}
                            helperText={errors.title?.message}
                        />
                    )}
                />

                <Controller
                    name="description"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="Description"
                            fullWidth
                            multiline
                            rows={3}
                            error={!!errors.description}
                            helperText={errors.description?.message}
                        />
                    )}
                />

                <Controller
                    name="price"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="Price"
                            type="number"
                            fullWidth
                            error={!!errors.price}
                            helperText={errors.price?.message}
                        />
                    )}
                />

                <Controller
                    name="category"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            select
                            label="Category"
                            fullWidth
                            error={!!errors.category}
                            helperText={errors.category?.message}
                        >
                            {Array.isArray(categories) &&
                                categories.map((cat: any) => (
                                    <MenuItem key={cat.slug || cat} value={cat.slug || cat}>
                                        {cat.name || cat}
                                    </MenuItem>
                                ))}
                        </TextField>
                    )}
                />

                <Stack direction="row" spacing={2} justifyContent="flex-end">
                    <Button onClick={onCancel} disabled={isLoading}>
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={isLoading}
                        startIcon={isLoading ? <CircularProgress size={20} /> : null}
                    >
                        Save Product
                    </Button>
                </Stack>
            </Stack>
        </Box>
    );
}
