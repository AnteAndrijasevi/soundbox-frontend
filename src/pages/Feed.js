import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import API from '../services/api';

const MOOD_EMOJI = {
    HAPPY: '😊', MELANCHOLIC: '🌧', NOSTALGIC: '🕰', CALM: '🌿',
    ANXIOUS: '⚡', EUPHORIC: '✨', SAD: '💙', ENERGETIC: '🔥'
};

const CONTEXT_LABEL = {
    DRIVING: 'driving', WALKING: 'walking', MORNING: 'morning', NIGHT: 'late night',
    WORKING: 'working', STUDYING: 'studying', HEARTBREAK: 'heartbreak', PARTYING: 'partying', RELAXING: 'relaxing'
};

function StarRating({ rating }) {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    return (
        <span style={{ color: '#111', fontSize: '0.85rem', letterSpacing: '1px' }}>
      {'★'.repeat(full)}{half ? '½' : ''}{'☆'.repeat(5 - full - (half ? 1 : 0))}
    </span>
    );
}

function Feed() {
    const [feed, setFeed] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [searching, setSearching] = useState(false);

    useEffect(() => {
        API.get('/api/feed')
            .then(res => setFeed(res.data.content || []))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;
        setSearching(true);
        try {
            const res = await API.get(`/api/users/search?query=${searchQuery}`);
            setSearchResults(res.data);
        } catch (err) {}
        setSearching(false);
    };

    const formatDate = (iso) => {
        const d = new Date(iso);
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    return (
        <div style={{ minHeight: '100vh', background: '#fff' }}>
            <Navbar />
            <div style={{ maxWidth: '720px', margin: '0 auto', padding: '64px 32px' }}>

                {/* Find curators */}
                <div style={{ marginBottom: '56px', paddingBottom: '48px', borderBottom: '1px solid #eee' }}>
                    <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.5rem', marginBottom: '8px' }}>
                        Find curators
                    </h3>
                    <p style={{ color: '#888', fontSize: '0.9rem', marginBottom: '20px' }}>
                        Follow people and see their listen log here.
                    </p>
                    <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px' }}>
                        <input
                            type="text"
                            placeholder="Search by username..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            style={{
                                flex: 1, padding: '10px 14px', border: '1px solid #ddd',
                                borderRadius: '4px', fontSize: '0.95rem', fontFamily: 'Inter, sans-serif', outline: 'none'
                            }}
                        />
                        <button type="submit" style={{
                            padding: '10px 20px', background: '#111', color: '#fff',
                            border: 'none', borderRadius: '4px', cursor: 'pointer',
                            fontFamily: 'Inter, sans-serif', fontSize: '0.9rem'
                        }}>
                            {searching ? '...' : 'Search'}
                        </button>
                    </form>

                    {searchResults.length > 0 && (
                        <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {searchResults.map(user => (
                                <Link key={user.id} to={`/users/${user.id}`} style={{ textDecoration: 'none', color: '#111' }}>
                                    <div style={{
                                        display: 'flex', alignItems: 'center', gap: '12px',
                                        padding: '12px', border: '1px solid #eee', borderRadius: '6px'
                                    }}
                                         onMouseEnter={e => e.currentTarget.style.borderColor = '#111'}
                                         onMouseLeave={e => e.currentTarget.style.borderColor = '#eee'}
                                    >
                                        <div style={{
                                            width: '36px', height: '36px', borderRadius: '50%',
                                            background: '#f0f0f0', display: 'flex', alignItems: 'center',
                                            justifyContent: 'center', fontSize: '1rem', flexShrink: 0
                                        }}>
                                            {user.username?.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p style={{ fontWeight: '500', fontSize: '0.9rem' }}>{user.username}</p>
                                            <p style={{ color: '#999', fontSize: '0.8rem' }}>
                                                {user.followerCount} followers · {user.reviewCount} albums logged
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

                {/* Feed */}
                <div>
                    <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.5rem', marginBottom: '32px' }}>
                        Following
                    </h3>

                    {loading ? (
                        <p style={{ color: '#999' }}>Loading...</p>
                    ) : feed.length === 0 ? (
                        <p style={{ color: '#999' }}>
                            Follow someone to see their listens here.
                        </p>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            {feed.map(entry => (
                                <div key={entry.id} style={{
                                    display: 'flex', gap: '20px',
                                    padding: '24px 0', borderBottom: '1px solid #f0f0f0'
                                }}>
                                    <div style={{ flexShrink: 0 }}>
                                        <div style={{ width: '64px', height: '64px', borderRadius: '4px', overflow: 'hidden', background: '#f5f5f5' }}>
                                            {entry.albumCoverArtUrl && (
                                                <img src={entry.albumCoverArtUrl} alt={entry.albumTitle}
                                                     style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            )}
                                        </div>
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                                            <div>
                                                <Link to={`/users/${entry.userId}`} style={{ textDecoration: 'none', color: '#111' }}>
                          <span style={{ fontWeight: '600', fontSize: '0.85rem', color: '#666' }}>
                            {entry.username}
                          </span>
                                                </Link>
                                                <span style={{ color: '#bbb', fontSize: '0.8rem' }}> listened to</span>
                                            </div>
                                            <span style={{ color: '#bbb', fontSize: '0.8rem', flexShrink: 0, marginLeft: '16px' }}>
                        {formatDate(entry.listenedAt)}
                      </span>
                                        </div>
                                        <div style={{ marginBottom: '6px' }}>
                                            <span style={{ fontWeight: '600', fontSize: '0.95rem' }}>{entry.albumTitle}</span>
                                            <span style={{ color: '#888', fontSize: '0.85rem', marginLeft: '8px' }}>{entry.artist}</span>
                                        </div>
                                        {entry.rating && <div style={{ marginBottom: '8px' }}><StarRating rating={entry.rating} /></div>}
                                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: entry.note ? '10px' : '0' }}>
                                            {entry.mood && (
                                                <span style={{ fontSize: '0.75rem', padding: '2px 10px', border: '1px solid #eee', borderRadius: '20px', color: '#666' }}>
                          {MOOD_EMOJI[entry.mood]} {entry.mood.toLowerCase()}
                        </span>
                                            )}
                                            {entry.context && (
                                                <span style={{ fontSize: '0.75rem', padding: '2px 10px', border: '1px solid #eee', borderRadius: '20px', color: '#666' }}>
                          {CONTEXT_LABEL[entry.context]}
                        </span>
                                            )}
                                            {entry.isFirstListen && (
                                                <span style={{ fontSize: '0.75rem', padding: '2px 10px', border: '1px solid #eee', borderRadius: '20px', color: '#666' }}>
                          first listen
                        </span>
                                            )}
                                            {entry.favoriteTrack && (
                                                <span style={{ fontSize: '0.75rem', padding: '2px 10px', border: '1px solid #eee', borderRadius: '20px', color: '#666' }}>
                          ♪ {entry.favoriteTrack}
                        </span>
                                            )}
                                        </div>
                                        {entry.note && (
                                            <p style={{ fontSize: '0.875rem', color: '#555', lineHeight: 1.6, fontStyle: 'italic', margin: '0', borderLeft: '2px solid #eee', paddingLeft: '12px' }}>
                                                {entry.note}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}

export default Feed;