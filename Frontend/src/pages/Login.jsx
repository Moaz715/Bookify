import { useState } from "react";
import { useLogin } from "../hooks/useLogin";
import '../styles/Auth.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const {login, isLoading, error} = useLogin();
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        await login(email, password);
        console.log("Attempting to login up with:", email, password);
        
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