import { useState } from 'react';
import { useAuthContext } from '../hooks/useAuthContext';
import { useNavigate } from 'react-router-dom';
import api, {setAccessToken} from '../utils/api';
import '../styles/Auth.css'


const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const { login } = useAuthContext();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const response = await api.post('/api/users/login', { email, password });

            setAccessToken(response.data.accessToken);

            login(response.data);

            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.error || 'An error occurred during login');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form className="login" onSubmit={handleSubmit}>
            <h3>Log In</h3>


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

            <button disabled={isLoading} type="submit">Log In</button>
            {error && <div className="error">{error}</div>}
        </form>
    );
}


export default Login;