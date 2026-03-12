import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { albums } from '../services/api';

const MOODS = ['HAPPY', 'MELANCHOLIC', 'NOSTALGIC', 'CALM', 'ANXIOUS', 'EUPHORIC', 'SAD', 'ENERGETIC'];
const CONTEXTS = ['DRIVING', 'WALKING', 'MORNING', 'NIGHT', 'WORKING', 'STUDYING', 'HEARTBREAK', 'PARTYING', 'RELAXING'];

function Search() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [logModal, setLogModal] = useState(null);
    const [logData, setLogData] = useState({ rating: '', mood: '', context: '', isFirstListen: false, note: '', favoriteTrack: '' });

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;
        setLoading(true);
        setResults([]);
        try {
            const res = await albums.search(query);

            const detailPromises = res.data.map(album =>
                albums.get(album.mbid)
                    .then(detail => detail.data)
                    .catch(() => null)
            );

            const details = await Promise.all(detailPromises);
            const withCovers = details.filter(a => a && a.coverArtUrl);
            setResults(withCovers.slice(0, 5));
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };
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
            alert('Logged!');
        } catch (err) {
            alert('Error logging listen.');
        }
    };

    const inputStyle = {
        width: '100%', padding: '10px 14px', border: '1px solid #ddd',
        borderRadius: '4px', fontSize: '0.95rem', fontFamily: 'Inter, sans-serif', outline: 'none'
    };

    const selectStyle = {
        ...inputStyle, background: '#fff', cursor: 'pointer'
    };

    return (
        <div>
            <Navbar />
            <div style={{ maxWidth: '900px', margin: '0 auto', padding: '48px 32px' }}>

                <h2 style={{ fontSize: '2rem', marginBottom: '32px' }}>Search albums</h2>

                <form onSubmit={handleSearch} style={{ display: 'flex', gap: '12px', marginBottom: '40px' }}>
                    <input
                        type="text"
                        placeholder="Artist, album, song..."
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        style={{ ...inputStyle, flex: 1 }}
                    />
                    <button type="submit" style={{
                        padding: '10px 24px', background: '#111', color: '#fff',
                        border: 'none', borderRadius: '4px', cursor: 'pointer',
                        fontFamily: 'Inter, sans-serif', fontSize: '0.95rem'
                    }}>
                        {loading ? '...' : 'Search'}
                    </button>
                </form>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '24px' }}>
                    {results.map(album => (
                        <div key={album.mbid} style={{ cursor: 'pointer' }}
                             onClick={() => setLogModal(album)}>
                            <div style={{
                                width: '100%', aspectRatio: '1', background: '#f5f5f5',
                                borderRadius: '4px', overflow: 'hidden', marginBottom: '8px'
                            }}>
                                {album.coverArtUrl ? (
                                    <img src={album.coverArtUrl} alt={album.title}
                                         style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999', fontSize: '0.8rem' }}>
                                        No cover
                                    </div>
                                )}
                            </div>
                            <p style={{ fontWeight: '500', fontSize: '0.9rem', marginBottom: '2px' }}>{album.title}</p>
                            <p style={{ color: '#666', fontSize: '0.8rem' }}>{album.artist}</p>
                            <p style={{ color: '#999', fontSize: '0.75rem' }}>{album.releaseDate?.substring(0, 4)}</p>
                        </div>
                    ))}
                </div>

            </div>

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
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <input type="number" placeholder="Rating (0.5 - 5.0)" min="0.5" max="5" step="0.5"
                                   value={logData.rating} onChange={e => setLogData({ ...logData, rating: e.target.value })}
                                   style={inputStyle} />

                            <select value={logData.mood} onChange={e => setLogData({ ...logData, mood: e.target.value })} style={selectStyle}>
                                <option value="">Mood (optional)</option>
                                {MOODS.map(m => <option key={m} value={m}>{m.charAt(0) + m.slice(1).toLowerCase()}</option>)}
                            </select>

                            <select value={logData.context} onChange={e => setLogData({ ...logData, context: e.target.value })} style={selectStyle}>
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

                            <textarea placeholder="Note (optional) — where were you, how did it feel..."
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

export default Search;