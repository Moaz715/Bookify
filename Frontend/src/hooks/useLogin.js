import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import api from "../utils/api";
import { toast } from "react-toastify"; // Added import

export const useLogin = () => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(null);
    const { dispatch } = useAuthContext();

    const login = async (email, password) => {
        setIsLoading(true);
        setError(null);
        
        try {
            const res = await api.post('/api/users/login', { email, password });
            
            localStorage.setItem('user', JSON.stringify(res.data));
            dispatch({ type: 'LOGIN', payload: res.data });
            toast.success("Welcome Back!");
        } catch (error) {
            setError(error.response?.data?.error || "Failed to log in");
        } finally {
            setIsLoading(false); 
        }
    }

    return { login, isLoading, error };
}