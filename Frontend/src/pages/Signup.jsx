import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';
import api, { setAccessToken } from '../utils/api';
import '../styles/Auth.css';

const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    
    const { login } = useAuthContext(); 

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const response = await api.post('/api/users/signup', { email, password });

            setAccessToken(response.data.accessToken);

            login(response.data);

            navigate('/'); 
        } catch (err) {
            setError(err.response?.data?.error || 'An error occurred during signup');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form className="signup" onSubmit={handleSubmit}>
            <h3>Sign Up</h3>
            
            <label htmlFor="email">Email:</label>
            <input 
                type="email" 
                id="email" 
                onChange={(e) => setEmail(e.target.value)} 
                value={email} 
            />
            
            <label htmlFor="password">Password:</label>
            <input 
                type="password" 
                id="password" 
                onChange={(e) => setPassword(e.target.value)} 
                value={password} 
            />

            <button disabled={isLoading} type="submit">Sign Up</button>
            {error && <div className="error">{error}</div>}
        </form>
    );
}

export default Signup;