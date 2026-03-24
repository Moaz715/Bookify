import { Navigate } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";

const ProtectedRoute = ({ children, requireAdmin = false }) => {
    const { user } = useAuthContext();

    if (!user) {
        return <Navigate to="/login" />;
    }

    if (requireAdmin && user.role !== 'admin') {
        
        //return <Navigate to="/" />; 
        
        return <div>You do not have permission to view this page.</div>;
    }

    return children;
};

export default ProtectedRoute;