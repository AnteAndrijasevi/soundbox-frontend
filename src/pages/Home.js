import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { users, albums } from '../services/api';
import Logo from '../components/Logo';

function Home() {
    const [profile, setProfile] = useState(null);
    const [newReleases, setNewReleases] = useState([]);
    const [logModal, setLogModal] = useState(null);
    const [logData, setLogData] = useState({ rating: '', mood: '', context: '', isFirstListen: false, note: '', favoriteTrack: '' });
    const navigate = useNavigate();

    const MOODS = ['HAPPY', 'MELANCHOLIC', 'NOSTALGIC', 'CALM', 'ANXIOUS', 'EUPHORIC', 'SAD', 'ENERGETIC'];
    const CONTEXTS = ['DRIVING', 'WALKING', 'MORNING', 'NIGHT', 'WORKING', 'STUDYING', 'HEARTBREAK', 'PARTYING', 'RELAXING'];

    useEffect(() => {
        users.me().then(res => setProfile(res.data)).catch(() => {});
        albums.newReleases(6).then(res => setNewReleases(res.data)).catch(() => {});
    }, []);

    const handleLog = async () => {
        try {
            await albums.log(logModal.mbid, {
                rating: logData.rating ? parseFloat(logData.rating) : null,
                mood: logData.mood || null,
                context: logData.context || null,
                isFirstListen: logData.isFirstListen || null,
                note: logData.note || null,
                favoriteTrack: logData.favoriteTrack || null,
            });
            setLogModal(null);
            setLogData({ rating: '', mood: '', context: '', isFirstListen: false, note: '', favoriteTrack: '' });
        } catch (err) {
            alert('Error logging listen.');
        }
    };

    const inputStyle = {
        width: '100%', padding: '10px 14px', border: '1px solid #ddd',
        borderRadius: '4px', fontSize: '0.95rem', fontFamily: 'Inter, sans-serif', outline: 'none',
        boxSizing: 'border-box'
    };

    const today = new Date();
    const monthName = today.toLocaleString('en-US', { month: 'long' });

    return (
        <div style={{ minHeight: '100vh', background: '#fff' }}>
            <Navbar />

            <div style={{ maxWidth: '960px', margin: '0 auto', padding: '64px 32px' }}>

                {/* Hero */}
                <div style={{
                    marginBottom: '80px',
                    borderBottom: '1px solid #eee',
                    paddingBottom: '64px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '48px'
                }}>
                    {/* Left — text */}
                    <div style={{ flex: 1 }}>
                        <p style={{
                            fontSize: '0.75rem', letterSpacing: '3px',
                            textTransform: 'uppercase', color: '#bbb', marginBottom: '20px',
                            fontFamily: 'Inter, sans-serif'
                        }}>
                            Your music journal
                        </p>
                        <h2 style={{
                            fontFamily: 'Playfair Display, serif',
                            fontSize: '4rem', lineHeight: 1.05,
                            marginBottom: '28px', letterSpacing: '-1.5px',
                            color: '#111'
                        }}>
                            Every listen<br />tells a story.
                        </h2>
                        <p style={{ color: '#888', fontSize: '1rem', lineHeight: 1.6, marginBottom: '32px' }}>
                            {profile && profile.reviewCount > 0
                                ? `You've logged ${profile.reviewCount} album${profile.reviewCount !== 1 ? 's' : ''}. Keep going.`
                                : "Log albums. Capture the moment. See your taste evolve."}
                        </p>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button
                                onClick={() => navigate('/search')}
                                style={{
                                    padding: '12px 28px',
                                    background: '#111', color: '#fff', border: 'none',
                                    borderRadius: '4px', cursor: 'pointer',
                                    fontFamily: 'Inter, sans-serif', fontSize: '0.95rem',
                                    letterSpacing: '0.3px'
                                }}>
                                Log an album
                            </button>
                            <button
                                onClick={() => navigate('/profile')}
                                style={{
                                    padding: '12px 28px',
                                    background: 'none', color: '#111',
                                    border: '1px solid #ddd',
                                    borderRadius: '4px', cursor: 'pointer',
                                    fontFamily: 'Inter, sans-serif', fontSize: '0.95rem',
                                }}>
                                Your profile
                            </button>
                        </div>
                    </div>

                    {/* Right — logo */}
                    <div style={{ flex: '0 0 auto' }}>
                        <Logo size={260} />
                    </div>
                </div>

                {/* New Releases */}
                <div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '32px' }}>
                        <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.8rem' }}>
                            New in {monthName}
                        </h3>
                        <span style={{ color: '#bbb', fontSize: '0.85rem', fontFamily: 'Inter, sans-serif' }}>
                            {today.getFullYear()}
                        </span>
                    </div>

                    {newReleases.length === 0 ? (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '16px' }}>
                            {[...Array(6)].map((_, i) => (
                                <div key={i} style={{
                                    aspectRatio: '1', background: '#f5f5f5', borderRadius: '4px'
                                }} />
                            ))}
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '16px' }}>
                            {newReleases.map(album => (
                                <div key={album.mbid}
                                     onClick={() => navigate(`/albums/${album.mbid}`)}
                                     style={{ cursor: 'pointer' }}>
                                    <div style={{
                                        width: '100%', aspectRatio: '1', borderRadius: '4px',
                                        overflow: 'hidden', marginBottom: '8px',
                                        transition: 'transform 0.2s, box-shadow 0.2s'
                                    }}
                                         onMouseEnter={e => {
                                             e.currentTarget.style.transform = 'translateY(-3px)';
                                             e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)';
                                         }}
                                         onMouseLeave={e => {
                                             e.currentTarget.style.transform = 'translateY(0)';
                                             e.currentTarget.style.boxShadow = 'none';
                                         }}>
                                        <img src={album.coverArtUrl} alt={album.title}
                                             style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                    <p style={{ fontWeight: '500', fontSize: '0.8rem', marginBottom: '2px', lineHeight: 1.3, color: '#111' }}>
                                        {album.title}
                                    </p>
                                    <p style={{ color: '#999', fontSize: '0.75rem' }}>{album.artist}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>

            {/* Log Modal */}
            {logModal && (
                <div style={{
                    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200
                }}>
                    <div style={{
                        background: '#fff', borderRadius: '8px', padding: '32px',
                        width: '100%', maxWidth: '480px', maxHeight: '90vh', overflowY: 'auto'
                    }}>
                        <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
                            {logModal.coverArtUrl && (
                                <img src={logModal.coverArtUrl} alt={logModal.title}
                                     style={{ width: '72px', height: '72px', objectFit: 'cover', borderRadius: '4px' }} />
                            )}
                            <div>
                                <h3 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>{logModal.title}</h3>
                                <p style={{ color: '#666', fontSize: '0.9rem' }}>{logModal.artist}</p>
                                <p style={{ color: '#999', fontSize: '0.8rem' }}>{logModal.releaseDate?.substring(0, 4)}</p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <input type="number" placeholder="Rating (0.5 - 5.0)" min="0.5" max="5" step="0.5"
                                   value={logData.rating} onChange={e => setLogData({ ...logData, rating: e.target.value })}
                                   style={inputStyle} />
                            <select value={logData.mood} onChange={e => setLogData({ ...logData, mood: e.target.value })}
                                    style={{ ...inputStyle, background: '#fff', cursor: 'pointer' }}>
                                <option value="">Mood (optional)</option>
                                {MOODS.map(m => <option key={m} value={m}>{m.charAt(0) + m.slice(1).toLowerCase()}</option>)}
                            </select>
                            <select value={logData.context} onChange={e => setLogData({ ...logData, context: e.target.value })}
                                    style={{ ...inputStyle, background: '#fff', cursor: 'pointer' }}>
                                <option value="">Context (optional)</option>
                                {CONTEXTS.map(c => <option key={c} value={c}>{c.charAt(0) + c.slice(1).toLowerCase()}</option>)}
                            </select>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', cursor: 'pointer' }}>
                                <input type="checkbox" checked={logData.isFirstListen}
                                       onChange={e => setLogData({ ...logData, isFirstListen: e.target.checked })} />
                                First listen
                            </label>
                            <input type="text" placeholder="Favorite track (optional)"
                                   value={logData.favoriteTrack} onChange={e => setLogData({ ...logData, favoriteTrack: e.target.value })}
                                   style={inputStyle} />
                            <textarea placeholder="Note — where were you, how did it feel..."
                                      value={logData.note} onChange={e => setLogData({ ...logData, note: e.target.value })}
                                      rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
                        </div>

                        <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                            <button onClick={handleLog} style={{
                                flex: 1, padding: '12px', background: '#111', color: '#fff',
                                border: 'none', borderRadius: '4px', cursor: 'pointer',
                                fontFamily: 'Inter, sans-serif', fontSize: '0.95rem'
                            }}>
                                Log listen
                            </button>
                            <button onClick={() => setLogModal(null)} style={{
                                padding: '12px 20px', background: 'none', border: '1px solid #ddd',
                                borderRadius: '4px', cursor: 'pointer', fontFamily: 'Inter, sans-serif'
                            }}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Home;