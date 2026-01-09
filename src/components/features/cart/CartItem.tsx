import { Box, IconButton, ListItem, ListItemAvatar, ListItemText, Typography, Avatar } from '@mui/material';
import { Add as AddIcon, Remove as RemoveIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { CartItem as CartItemType, useCartStore } from '@/store/cartStore';

interface CartItemProps {
    item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
    const { updateQuantity, removeItem } = useCartStore();

    return (
        <motion.li
            layout
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50, transition: { duration: 0.2 } }}
            style={{ listStyle: 'none' }}
        >
            <ListItem
                alignItems="flex-start"
                secondaryAction={
                    <IconButton edge="end" aria-label="delete" onClick={() => removeItem(item.id)} color="error">
                        <DeleteIcon />
                    </IconButton>
                }
                sx={{ borderBottom: '1px solid #f0f0f0', py: 2 }}
            >
                <ListItemAvatar>
                    <Avatar alt={item.title} src={item.thumbnail} variant="rounded" sx={{ width: 56, height: 56, mr: 2 }} />
                </ListItemAvatar>
                <ListItemText
                    primary={
                        <Typography variant="subtitle2" noWrap sx={{ maxWidth: 160, fontWeight: 600 }}>
                            {item.title}
                        </Typography>
                    }
                    secondary={
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, gap: 1 }}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    border: '1px solid #ddd',
                                    borderRadius: 8,
                                    bgcolor: 'background.paper',
                                }}
                            >
                                <IconButton size="small" onClick={() => updateQuantity(item.id, -1)} disabled={item.quantity <= 1}>
                                    <RemoveIcon fontSize="small" />
                                </IconButton>
                                <Typography variant="body2" sx={{ mx: 1, minWidth: 20, textAlign: 'center' }}>
                                    {item.quantity}
                                </Typography>
                                <IconButton size="small" onClick={() => updateQuantity(item.id, 1)}>
                                    <AddIcon fontSize="small" />
                                </IconButton>
                            </Box>
                            <Typography variant="body2" fontWeight="bold" color="primary.main" sx={{ ml: 'auto' }}>
                                ${(item.price * item.quantity).toFixed(2)}
                            </Typography>
                        </Box>
                    }
                />
            </ListItem>
        </motion.li>
    );
}
