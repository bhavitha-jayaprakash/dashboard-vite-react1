import { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Typography,
  TextField,
  MenuItem,
  Stack,
  Rating,
  LinearProgress,
  Skeleton,
  InputAdornment,
  Button,
  Fab,
  IconButton,
  Snackbar,
  Alert,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import { motion } from 'framer-motion';
import { useProducts, useCategories } from '@/hooks/useProducts';
import { useDebounce } from '@/hooks/useDebounce';
import { useCartStore } from '@/store/cartStore';
import { useAddProduct, useEditProduct } from '@/hooks/useProductMutations';
import ProductDialog from '@/components/features/products/ProductDialog';
import { Product } from '@/types/product';
import { ProductFormData } from '@/schemas/product';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function ProductList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const debouncedSearch = useDebounce(searchTerm, 500);
  const addItem = useCartStore((state) => state.addItem);
  const addProductMutation = useAddProduct();
  const editProductMutation = useEditProduct();

  const { data, isLoading, isFetching } = useProducts({
    search: debouncedSearch,
    category: category,
    limit: 12,
  });

  const { data: categories } = useCategories();

  const handleOpenDialog = (product?: Product) => {
    if (product) {
      setSelectedProduct(product);
    } else {
      setSelectedProduct(null);
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedProduct(null);
  };

  const handleSubmitProduct = (data: ProductFormData) => {
    if (selectedProduct) {
      editProductMutation.mutate(
        { id: selectedProduct.id, ...data },
        {
          onSuccess: () => {
            setSnackbar({ open: true, message: 'Product updated successfully!', severity: 'success' });
            handleCloseDialog();
          },
          onError: () => {
            setSnackbar({ open: true, message: 'Failed to update product', severity: 'error' });
          }
        }
      );
    } else {
      addProductMutation.mutate(data, {
        onSuccess: () => {
          setSnackbar({ open: true, message: 'Product added successfully!', severity: 'success' });
          handleCloseDialog();
        },
        onError: () => {
          setSnackbar({ open: true, message: 'Failed to add product', severity: 'error' });
        }
      });
    }
  };

  return (
    <Box sx={{ position: 'relative', minHeight: '80vh' }}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        sx={{ mb: 4 }}
      >
        <TextField
          label="Search Products"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ flexGrow: 1 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          select
          label="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          sx={{ minWidth: 200 }}
        >
          <MenuItem value="">All Categories</MenuItem>
          {Array.isArray(categories) && categories.map((cat: any) => (
            <MenuItem key={cat.slug || cat} value={cat.slug || cat}>
              {cat.name || cat}
            </MenuItem>
          ))}
        </TextField>
      </Stack>

      {isFetching && !isLoading && <LinearProgress sx={{ mb: 2 }} />}

      {isLoading ? (
        <Grid container spacing={3}>
          {[...Array(8)].map((_, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <Card sx={{ height: '100%' }}>
                <Skeleton variant="rectangular" height={140} />
                <CardContent>
                  <Skeleton variant="text" height={32} />
                  <Skeleton variant="text" width="60%" />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Grid
          container
          spacing={3}
          component={motion.div}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {data?.products.map((product) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              lg={3}
              key={product.id}
              component={motion.div}
              variants={itemVariants}
            >
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s',
                  position: 'relative',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4,
                  },
                }}
              >
                <Box sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1 }}>
                  <IconButton
                    size="small"
                    sx={{ bgcolor: 'rgba(255,255,255,0.8)', '&:hover': { bgcolor: 'white' } }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenDialog(product);
                    }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Box>

                <CardMedia
                  component="img"
                  height="140"
                  image={product.thumbnail}
                  alt={product.title}
                  sx={{ objectFit: 'contain', bgcolor: '#f5f5f5' }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h6" component="div" noWrap title={product.title}>
                    {product.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    height: 40,
                    mb: 1
                  }}>
                    {product.description}
                  </Typography>
                  <Stack direction="row" alignItems="center" justifyContent="space-between" mt={1}>
                    <Typography variant="h6" color="primary">
                      ${product.price}
                    </Typography>
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                      <Rating value={product.rating} precision={0.1} size="small" readOnly />
                      <Typography variant="caption">({product.rating})</Typography>
                    </Stack>
                  </Stack>
                </CardContent>
                <CardActions sx={{ p: 2, pt: 0 }}>
                  <Button
                    variant="contained"
                    fullWidth
                    startIcon={<AddShoppingCartIcon />}
                    onClick={() => addItem(product)}
                  >
                    Add to Cart
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Fab
        color="primary"
        aria-label="add"
        sx={{ position: 'fixed', bottom: 32, right: 32 }}
        onClick={() => handleOpenDialog()}
      >
        <AddIcon />
      </Fab>

      <ProductDialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        onSubmit={handleSubmitProduct}
        isLoading={addProductMutation.isPending || editProductMutation.isPending}
        product={selectedProduct}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
