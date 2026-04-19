import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import api from "../utils/api";
import { toast } from "react-toastify";

export const useSignup = () => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(null);
    const { dispatch } = useAuthContext();

    const signup = async (email, password) => {
        setIsLoading(true);
        setError(null);
        
        try {
            const res = await api.post('/api/users/signup', { email, password });
            
            localStorage.setItem('user', JSON.stringify(res.data));
            dispatch({ type: 'LOGIN', payload: res.data });
            toast.success("Welcome to Bookify!!!");
        } catch (error) {
            setError(error.response?.data?.error || "Failed to Sign Up");
        } finally {
            setIsLoading(false);
        }
    }

    return { signup, isLoading, error };
}