import { useState } from "react";
import { useSignup } from "../hooks/useSignup";
import '../styles/Auth.css';

const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const {signup, isLoading, error} = useSignup();
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        await signup(email, password);
        console.log("Attempting to sign up with:", email, password);
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