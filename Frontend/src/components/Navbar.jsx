import { Link } from "react-router-dom";
import { useLogout } from '../hooks/useLogout'
import '../styles/Navbar.css';


const Navbar = () => {

    const { logout } = useLogout();

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
                    <div>
                        <button onClick={handleClick}>Log out</button>
                    </div>
                    <div>
                        <Link to="/login">Login</Link>
                        <Link to="/signup">Signup</Link>
                        <Link to="/cart">Cart</Link>
                    </div>
                </nav>
            </div>
        </header>
    );
}

export default Navbar;