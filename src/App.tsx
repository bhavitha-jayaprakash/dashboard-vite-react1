import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, CssBaseline as MuiCssBaseline } from '@mui/material';
import { theme } from '@/theme';

import LoginPage from '@/components/features/auth/LoginPage';
import ProtectedRoute from '@/components/features/auth/ProtectedRoute';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ProductList from '@/pages/ProductList';

const queryClient = new QueryClient();

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider theme={theme}>
                <MuiCssBaseline />
                <Router>
                    <Routes>
                        <Route path="/login" element={<LoginPage />} />
                        <Route element={<ProtectedRoute />}>
                            <Route element={<DashboardLayout />}>
                                <Route path="/" element={<ProductList />} />
                            </Route>
                        </Route>
                        <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                </Router>
            </ThemeProvider>
        </QueryClientProvider>
    );
}

export default App;
