import React from 'react';
import { Link, useNavigate } from'react-router-dom';
import Logo from './Logo';

function Navbar() {
    const navigate = useNavigate();
    const username = localStorage.getItem('username');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        navigate('/login');
    };

    return (
        <nav style={{
            borderBottom: '1px solid #eee',
            padding: '16px 32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'sticky',
            top: 0,
            background: '#fff',
            zIndex: 100
        }}>
            <Link to="/" style={{ textDecoration: 'none', color: '#111', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Logo size={36} />
                <h1 style={{ fontSize: '1.4rem', letterSpacing: '-0.5px', fontFamily: 'Playfair Display, serif' }}>
                    Soundbox
                </h1>
            </Link>

            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                <Link to="/search" style={{ textDecoration: 'none', color: '#444', fontSize: '0.95rem' }}>
                    Search
                </Link>
                <Link to="/profile" style={{ textDecoration: 'none', color: '#444', fontSize: '0.95rem' }}>
                    {username}
                </Link>
                <button onClick={handleLogout} style={{
                    background: 'none',
                    border: '1px solid #ddd',
                    padding: '6px 14px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    fontFamily: 'Inter, sans-serif'
                }}>
                    Sign out
                </button>
            </div>
        </nav>
    );
}

export default Navbar;