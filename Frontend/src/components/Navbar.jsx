import { Link } from "react-router-dom";
import '../styles/Navbar.css';
import { useAuthContext } from "../hooks/useAuthContext";


const Navbar = () => {

    const {user, logout} = useAuthContext();

    

    return (
        <header>
            <div>
                <Link to="/">
                    <h1>Bookify</h1>
                </Link>
                <nav>
                    {user && <button onClick={() => logout()}>Log out</button>}
                    {user && user.role === 'user' && <div>
                        <Link to="/cart">Cart</Link>
                        <Link to="/orders">My Orders</Link>
                    </div>}
                    {!user && <div>
                        <Link to="/login">Login</Link>
                        <Link to="/signup">Signup</Link>
                    </div>}
                </nav>
            </div>
        </header>
    );
}

export default Navbar;