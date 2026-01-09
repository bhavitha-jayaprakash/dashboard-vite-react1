import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Paper, Stack, TextField, Typography, Alert } from '@mui/material';
import { LoginFormValues, loginSchema } from '@/schemas/auth';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/axios';

export default function LoginPage() {
    const navigate = useNavigate();
    const login = useAuthStore((state) => state.login);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            username: '',
            password: '',
        },
    });

    const mutation = useMutation({
        mutationFn: async (data: LoginFormValues) => {
            const response = await api.post('/auth/login', data);
            return response.data;
        },
        onSuccess: (data) => {
            login(data);
            navigate('/');
        },
    });

    const onSubmit = (data: LoginFormValues) => {
        mutation.mutate(data);
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'background.default',
                p: 2,
            }}
        >
            <Paper
                elevation={3}
                sx={{
                    p: 4,
                    width: '100%',
                    maxWidth: 400,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 3,
                }}
            >
                <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" component="h1" gutterBottom fontWeight="bold" color="primary">
                        Welcome Back
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Sign in to continue to your dashboard
                    </Typography>
                </Box>

                <Alert severity="info" sx={{ fontSize: '0.875rem' }}>
                    Use <strong>emilys</strong> / <strong>emilyspass</strong>
                </Alert>

                {mutation.isError && (
                    <Alert severity="error">
                        Login failed. Please check your credentials.
                    </Alert>
                )}

                <form onSubmit={handleSubmit(onSubmit)}>
                    <Stack spacing={2.5}>
                        <TextField
                            label="Username"
                            fullWidth
                            disabled={mutation.isPending}
                            error={!!errors.username}
                            helperText={errors.username?.message}
                            {...register('username')}
                        />

                        <TextField
                            label="Password"
                            type="password"
                            fullWidth
                            disabled={mutation.isPending}
                            error={!!errors.password}
                            helperText={errors.password?.message}
                            {...register('password')}
                        />

                        <Button
                            type="submit"
                            variant="contained"
                            size="large"
                            fullWidth
                            disabled={mutation.isPending}
                            sx={{ mt: 1, py: 1.2 }}
                        >
                            {mutation.isPending ? 'Signing In...' : 'Sign In'}
                        </Button>
                    </Stack>
                </form>
            </Paper>
        </Box>
    );
}
