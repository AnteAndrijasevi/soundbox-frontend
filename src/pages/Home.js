import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { users } from '../services/api';

function Home() {
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        users.me().then(res => setProfile(res.data)).catch(() => {});
    }, []);

    return (
        <div>
            <Navbar />
            <div style={{ maxWidth: '800px', margin: '0 auto', padding: '48px 32px' }}>

                {profile && (
                    <div style={{ marginBottom: '48px' }}>
                        <h2 style={{ fontSize: '2rem', marginBottom: '8px' }}>
                            Welcome back, {profile.username}.
                        </h2>
                        <p style={{ color: '#666' }}>
                            {profile.reviewCount} reviews · {profile.followerCount} followers · {profile.followingCount} following
                        </p>
                    </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <Link to="/search" style={{ textDecoration: 'none' }}>
                        <div style={{
                            border: '1px solid #eee',
                            borderRadius: '8px',
                            padding: '32px',
                            cursor: 'pointer',
                            transition: 'border-color 0.2s'
                        }}
                             onMouseEnter={e => e.currentTarget.style.borderColor = '#111'}
                             onMouseLeave={e => e.currentTarget.style.borderColor = '#eee'}
                        >
                            <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Search albums</h3>
                            <p style={{ color: '#666', fontSize: '0.9rem' }}>Find and log albums you've listened to.</p>
                        </div>
                    </Link>

                    <Link to="/profile" style={{ textDecoration: 'none' }}>
                        <div style={{
                            border: '1px solid #eee',
                            borderRadius: '8px',
                            padding: '32px',
                            cursor: 'pointer',
                            transition: 'border-color 0.2s'
                        }}
                             onMouseEnter={e => e.currentTarget.style.borderColor = '#111'}
                             onMouseLeave={e => e.currentTarget.style.borderColor = '#eee'}
                        >
                            <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Your profile</h3>
                            <p style={{ color: '#666', fontSize: '0.9rem' }}>Reviews, listen log and your music chart.</p>
                        </div>
                    </Link>
                </div>

            </div>
        </div>
    );
}

export default Home;