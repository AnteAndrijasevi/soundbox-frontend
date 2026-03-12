import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth } from '../services/api';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await auth.login(email, password);
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('username', res.data.username);
            navigate('/');
        } catch (err) {
            setError('Invalid email or password');
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '100%', maxWidth: '400px', padding: '48px 32px' }}>

                <h1 style={{ fontSize: '2.5rem', marginBottom: '8px', letterSpacing: '-1px' }}>
                    Soundbox
                </h1>
                <p style={{ color: '#666', marginBottom: '40px', fontSize: '0.95rem' }}>
                    Your music, your story.
                </p>

                <form onSubmit={handleLogin}>
                    <div style={{ marginBottom: '16px' }}>
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                border: '1px solid #ddd',
                                borderRadius: '4px',
                                fontSize: '1rem',
                                outline: 'none',
                                fontFamily: 'Inter, sans-serif'
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: '24px' }}>
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                border: '1px solid #ddd',
                                borderRadius: '4px',
                                fontSize: '1rem',
                                outline: 'none',
                                fontFamily: 'Inter, sans-serif'
                            }}
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
                        Sign in
                    </button>
                </form>

                <p style={{ marginTop: '24px', color: '#666', fontSize: '0.9rem' }}>
                    Don't have an account?{' '}
                    <Link to="/register" style={{ color: '#111', fontWeight: '500' }}>
                        Create one
                    </Link>
                </p>

            </div>
        </div>
    );
}

export default Login;