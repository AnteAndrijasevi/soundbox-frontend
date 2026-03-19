import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { users } from '../services/api';

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

function Profile() {
    const [profile, setProfile] = useState(null);
    const [log, setLog] = useState([]);
    const [topster, setTopster] = useState([]);

    useEffect(() => {
        users.me().then(res => setProfile(res.data)).catch(() => {});
        users.myLog().then(res => {
            const entries = res.data.content || [];
            setLog(entries);

            // Topster — top 9 unique albums by rating
            const seen = new Set();
            const top = [...entries]
                .filter(e => e.rating)
                .sort((a, b) => b.rating - a.rating)
                .filter(e => {
                    if (seen.has(e.albumMbid)) return false;
                    seen.add(e.albumMbid);
                    return true;
                })
                .slice(0, 9);
            setTopster(top);
        }).catch(() => {});
    }, []);

    const formatDate = (iso) => {
        const d = new Date(iso);
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    return (
        <div style={{ minHeight: '100vh', background: '#fff' }}>
            <Navbar />
            <div style={{ maxWidth: '960px', margin: '0 auto', padding: '64px 32px' }}>

                {/* Profile header */}
                {profile && (
                    <div style={{ marginBottom: '64px', paddingBottom: '48px', borderBottom: '1px solid #eee' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '32px' }}>
                            <div style={{
                                width: '80px', height: '80px', borderRadius: '50%',
                                background: '#f0f0f0', display: 'flex', alignItems: 'center',
                                justifyContent: 'center', fontSize: '2rem', flexShrink: 0
                            }}>
                                {profile.username?.charAt(0).toUpperCase()}
                            </div>
                            <div style={{ flex: 1 }}>
                                <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '2rem', marginBottom: '8px' }}>
                                    {profile.username}
                                </h2>
                                <p style={{ color: '#888', fontSize: '0.9rem', marginBottom: '16px' }}>
                                    {profile.bio || 'No bio yet.'}
                                </p>
                                <div style={{ display: 'flex', gap: '32px' }}>
                                    {[
                                        ['Albums', log.length],
                                        ['Followers', profile.followerCount],
                                        ['Following', profile.followingCount],
                                    ].map(([label, val]) => (
                                        <div key={label}>
                                            <span style={{ fontWeight: '600', fontSize: '1.1rem' }}>{val}</span>
                                            <span style={{ color: '#999', fontSize: '0.85rem', marginLeft: '6px' }}>{label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Topster */}
                {topster.length > 0 && (
                    <div style={{ marginBottom: '64px' }}>
                        <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.5rem', marginBottom: '24px' }}>
                            Top albums
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4px', maxWidth: '360px' }}>
                            {[...topster, ...Array(9 - topster.length).fill(null)].map((entry, i) => (
                                <div key={i} style={{
                                    aspectRatio: '1', background: '#f5f5f5', overflow: 'hidden'
                                }}>
                                    {entry?.albumCoverArtUrl && (
                                        <img src={entry.albumCoverArtUrl} alt={entry.albumTitle}
                                             style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Sonic memory log */}
                <div>
                    <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.5rem', marginBottom: '32px' }}>
                        Listen log
                    </h3>

                    {log.length === 0 ? (
                        <p style={{ color: '#999' }}>No listens yet. Start logging.</p>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                            {log.map((entry, i) => (
                                <div key={entry.id} style={{
                                    display: 'flex', gap: '20px',
                                    padding: '24px 0',
                                    borderBottom: '1px solid #f0f0f0',
                                }}>
                                    {/* Cover */}
                                    <div style={{ flexShrink: 0 }}>
                                        <div style={{
                                            width: '64px', height: '64px', borderRadius: '4px',
                                            overflow: 'hidden', background: '#f5f5f5'
                                        }}>
                                            {entry.albumCoverArtUrl && (
                                                <img src={entry.albumCoverArtUrl} alt={entry.albumTitle}
                                                     style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            )}
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                                            <div>
                                                <span style={{ fontWeight: '600', fontSize: '0.95rem' }}>{entry.albumTitle}</span>
                                                <span style={{ color: '#888', fontSize: '0.85rem', marginLeft: '8px' }}>{entry.artist}</span>
                                            </div>
                                            <span style={{ color: '#bbb', fontSize: '0.8rem', flexShrink: 0, marginLeft: '16px' }}>
                        {formatDate(entry.listenedAt)}
                      </span>
                                        </div>

                                        {entry.rating && (
                                            <div style={{ marginBottom: '8px' }}>
                                                <StarRating rating={entry.rating} />
                                            </div>
                                        )}

                                        {/* Tags */}
                                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: entry.note ? '10px' : '0' }}>
                                            {entry.mood && (
                                                <span style={{
                                                    fontSize: '0.75rem', padding: '2px 10px',
                                                    border: '1px solid #eee', borderRadius: '20px', color: '#666'
                                                }}>
                          {MOOD_EMOJI[entry.mood]} {entry.mood.toLowerCase()}
                        </span>
                                            )}
                                            {entry.context && (
                                                <span style={{
                                                    fontSize: '0.75rem', padding: '2px 10px',
                                                    border: '1px solid #eee', borderRadius: '20px', color: '#666'
                                                }}>
                          {CONTEXT_LABEL[entry.context]}
                        </span>
                                            )}
                                            {entry.isFirstListen && (
                                                <span style={{
                                                    fontSize: '0.75rem', padding: '2px 10px',
                                                    border: '1px solid #eee', borderRadius: '20px', color: '#666'
                                                }}>
                          first listen
                        </span>
                                            )}
                                            {entry.favoriteTrack && (
                                                <span style={{
                                                    fontSize: '0.75rem', padding: '2px 10px',
                                                    border: '1px solid #eee', borderRadius: '20px', color: '#666'
                                                }}>
                          ♪ {entry.favoriteTrack}
                        </span>
                                            )}
                                        </div>

                                        {/* Sonic memory note */}
                                        {entry.note && (
                                            <p style={{
                                                fontSize: '0.875rem', color: '#555', lineHeight: 1.6,
                                                fontStyle: 'italic', margin: '0',
                                                borderLeft: '2px solid #eee', paddingLeft: '12px'
                                            }}>
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

export default Profile;