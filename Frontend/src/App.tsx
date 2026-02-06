import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import { useAuthStore } from './stores/store';
import './styles/App.css';

interface PrivateRouteProps {
    children: React.ReactNode;
}

function App() {
    const { isAuthenticated } = useAuthStore();
    const [authChecked, setAuthChecked] = useState(false);

    useEffect(() => {
        // Check authentication status on mount
        setAuthChecked(true);
    }, []);

    const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
        if (!authChecked) {
            return <div className="loading-screen">Loading...</div>;
        }
        return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
    };

    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login setIsAuthenticated={() => {}} />} />
                <Route path="/register" element={<Register />} />
                <Route
                    path="/dashboard"
                    element={
                        <PrivateRoute>
                            <Dashboard setIsAuthenticated={() => {}} />
                        </PrivateRoute>
                    }
                />
                <Route path="/" element={<Navigate to="/dashboard" />} />
                <Route path="*" element={<Navigate to="/dashboard" />} />
            </Routes>
        </Router>
    );
}

export default App;
