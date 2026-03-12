import { Link } from "react-router-dom";
import { useLogout } from '../hooks/useLogout'
import '../styles/Navbar.css';
import { useAuthContext } from "../hooks/useAuthContext";


const Navbar = () => {

    const { logout } = useLogout();
    const {user} = useAuthContext();

    const handleClick = () => {
        logout()
    }

    return (
        <header>
            <div>
                <Link to="/">
                    <h1>Home</h1>
                </Link>
                <nav>
                    {user && <div>
                        <button onClick={handleClick}>Log out</button>
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