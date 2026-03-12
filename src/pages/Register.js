import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth } from '../services/api';

function Register() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const res = await auth.register(username, email, password);
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('username', res.data.username);
            navigate('/');
        } catch (err) {
            setError('Registration failed. Try a different email or username.');
        }
    };

    const inputStyle = {
        width: '100%',
        padding: '12px 16px',
        border: '1px solid #ddd',
        borderRadius: '4px',
        fontSize: '1rem',
        outline: 'none',
        fontFamily: 'Inter, sans-serif'
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '100%', maxWidth: '400px', padding: '48px 32px' }}>

                <h1 style={{ fontSize: '2.5rem', marginBottom: '8px', letterSpacing: '-1px' }}>
                    Soundbox
                </h1>
                <p style={{ color: '#666', marginBottom: '40px', fontSize: '0.95rem' }}>
                    Start your music journal.
                </p>

                <form onSubmit={handleRegister}>
                    <div style={{ marginBottom: '16px' }}>
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            required
                            style={inputStyle}
                        />
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                            style={inputStyle}
                        />
                    </div>

                    <div style={{ marginBottom: '24px' }}>
                        <input
                            type="password"
                            placeholder="Password (min. 8 characters)"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                            style={inputStyle}
                        />
                    </div>

                    {error && (
                        <p style={{ color: '#e00', fontSize: '0.85rem', marginBottom: '16px' }}>{error}</p>
                    )}

                    <button
                        type="submit"
                        style={{
                            width: '100%',
                            padding: '12px',
                            background: '#111',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '4px',
                            fontSize: '1rem',
                            cursor: 'pointer',
                            fontFamily: 'Inter, sans-serif',
                            letterSpacing: '0.5px'
                        }}
                    >
                        Create account
                    </button>
                </form>

                <p style={{ marginTop: '24px', color: '#666', fontSize: '0.9rem' }}>
                    Already have an account?{' '}
                    <Link to="/login" style={{ color: '#111', fontWeight: '500' }}>
                        Sign in
                    </Link>
                </p>

            </div>
        </div>
    );
}

export default Register;