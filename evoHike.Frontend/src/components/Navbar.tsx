import { Link, NavLink } from 'react-router-dom';
function Navbar() {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="navbar-brand">
                <Link to="/">EvoHike (logó) </Link>
            </div>
            <ul className="navbar-links" >
                <li>
                    <NavLink to="/">Kezdőlap</NavLink>
                </li>
            </ul>
        </nav>
    )
}
export default Navbar;