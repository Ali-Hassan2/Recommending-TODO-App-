import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../Context/UserContext';
import {Link} from 'react-router-dom'

export function Navbar() {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const handleLogin = () => navigate('/login');

  return (
    <header className="w-full h-[70px] bg-gradient-to-r from-gray-800 via-gray-900 to-black text-white flex items-center px-8 shadow-md">
      <div className="flex-1">
        <h1 className="text-2xl font-bold tracking-wide">alistodo</h1>
      </div>
      <nav className="flex-1 flex justify-center gap-8 text-sm md:text-base">
        <Link to="/" className="hover:text-gray-300 transition">Home</Link>
        <Link to="/aboutus" className="hover:text-gray-300 transition">About Us</Link>
      </nav>
      <div className="flex-1 flex justify-end items-center gap-4">
        <span className="text-sm md:text-base font-medium">
          {(!user || user.length === 0) ? 'Welcome User' : `Welcome ${user}`}
        </span>
        {user ? (
          <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded">Logout</button>
        ) : (
          <button onClick={handleLogin} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded">Login</button>
        )}
      </div>
    </header>
  );
}

export default Navbar
