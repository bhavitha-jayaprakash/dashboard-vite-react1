import { useState } from 'react';
import {
    Drawer,
    Box,
    Typography,
    IconButton,
    Button,
    Stack,
    List,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Snackbar,
    Alert
} from '@mui/material';
import { Close as CloseIcon, ShoppingCartCheckout as CheckoutIcon } from '@mui/icons-material';
import { AnimatePresence } from 'framer-motion';
import { useCartStore } from '@/store/cartStore';
import CartItem from './CartItem';

export default function CartDrawer() {
    const { isOpen, toggleCart, items, totalPrice, clearCart } = useCartStore();
    const [isCheckoutDialogOpen, setIsCheckoutDialogOpen] = useState(false);
    const [showSuccessSnackbar, setShowSuccessSnackbar] = useState(false);

    const handleCheckoutClick = () => {
        setIsCheckoutDialogOpen(true);
    };

    const handleConfirmCheckout = () => {
        clearCart();
        setIsCheckoutDialogOpen(false);
        toggleCart(); // Close drawer
        setShowSuccessSnackbar(true);
    };

    const handleCloseCheckoutDialog = () => {
        setIsCheckoutDialogOpen(false);
    };

    return (
        <>
            <Drawer
                anchor="right"
                open={isOpen}
                onClose={toggleCart}
                PaperProps={{
                    sx: { width: { xs: '100%', sm: 400 }, display: 'flex', flexDirection: 'column' },
                }}
            >
                {/* Header */}
                <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e0e0e0' }}>
                    <Typography variant="h6" fontWeight="bold">
                        Shopping Cart ({items.length})
                    </Typography>
                    <IconButton onClick={toggleCart}>
                        <CloseIcon />
                    </IconButton>
                </Box>

                {/* Cart Items List */}
                <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
                    {items.length === 0 ? (
                        <Box sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>
                            <Typography variant="body1">Your cart is empty.</Typography>
                        </Box>
                    ) : (
                        <List sx={{ p: 0 }}>
                            <AnimatePresence initial={false} mode="popLayout">
                                {items.map((item) => (
                                    <CartItem key={item.id} item={item} />
                                ))}
                            </AnimatePresence>
                        </List>
                    )}
                </Box>

                {/* Footer */}
                {items.length > 0 && (
                    <Box sx={{ p: 3, borderTop: '1px solid #e0e0e0', bgcolor: 'background.default' }}>
                        <Stack direction="row" justifyContent="space-between" mb={2}>
                            <Typography variant="subtitle1" color="text.secondary">
                                Total
                            </Typography>
                            <Typography variant="h6" fontWeight="bold" color="primary">
                                ${totalPrice().toFixed(2)}
                            </Typography>
                        </Stack>
                        <Button
                            variant="contained"
                            fullWidth
                            size="large"
                            startIcon={<CheckoutIcon />}
                            onClick={handleCheckoutClick}
                        >
                            Checkout
                        </Button>
                    </Box>
                )}
            </Drawer>

            {/* Checkout Confirmation Dialog */}
            <Dialog
                open={isCheckoutDialogOpen}
                onClose={handleCloseCheckoutDialog}
            >
                <DialogTitle>Confirm Checkout</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to proceed with the checkout? Your total is ${totalPrice().toFixed(2)}.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseCheckoutDialog}>Cancel</Button>
                    <Button onClick={handleConfirmCheckout} variant="contained" autoFocus>
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Success Snackbar */}
            <Snackbar
                open={showSuccessSnackbar}
                autoHideDuration={6000}
                onClose={() => setShowSuccessSnackbar(false)}
            >
                <Alert onClose={() => setShowSuccessSnackbar(false)} severity="success" sx={{ width: '100%' }}>
                    Checkout successful! Thank you for your purchase.
                </Alert>
            </Snackbar>
        </>
    );
}
