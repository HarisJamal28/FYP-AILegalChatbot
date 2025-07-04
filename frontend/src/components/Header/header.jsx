import { useState } from 'react';
import usePersistedUserState from '../UI/persistedHook';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
    const [user] = usePersistedUserState("userInfo", null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("userInfo");
        navigate('/login');
        window.location.reload();
    };

    return (
<div className="bg-gray-100">
    <nav className="container-fluid mx-auto flex flex-row justify-between items-center p-4 z-50 border border-gray-300 ">
    <ul className="flex w-full space-x-10 text-base font-medium border border-gray-300 justify-evenly">
      <li>
        <a href="/home" className="border border-gray-300 p-3 hover:text-blue-600 transition">Home</a>
      </li>
      <li>
        <a href="/about" className="border border-gray-300 p-3 hover:text-blue-600 transition">About</a>
      </li>
      <li>
        <a href="/contact" className="border border-gray-300 p-3 hover:text-blue-600 transition">Contact</a>
      </li>
      <li>
        <a href="/login" className="border border-gray-300 p-3 hover:text-blue-600 transition">Login</a>
      </li>
      <li>
        <a href="/register" className="border border-gray-300 p-3 hover:text-blue-600 transition">
          Register
        </a>
      </li>
    </ul>
  </nav>
</div>

    );
};

export default Header;
