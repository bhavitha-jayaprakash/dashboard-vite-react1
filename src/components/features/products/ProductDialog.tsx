import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import ProductForm from './ProductForm';
import { ProductFormData } from '@/schemas/product';
import { Product } from '@/types/product';

interface ProductDialogProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: ProductFormData) => void;
    isLoading?: boolean;
    product?: Product | null;
}

export default function ProductDialog({
    open,
    onClose,
    onSubmit,
    isLoading,
    product,
}: ProductDialogProps) {
    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>{product ? 'Edit Product' : 'Add New Product'}</DialogTitle>
            <DialogContent>
                <ProductForm
                    defaultValues={
                        product
                            ? {
                                title: product.title,
                                description: product.description,
                                price: product.price,
                                category: product.category,
                            }
                            : undefined
                    }
                    onSubmit={onSubmit}
                    isLoading={isLoading}
                    onCancel={onClose}
                />
            </DialogContent>
        </Dialog>
    );
}
