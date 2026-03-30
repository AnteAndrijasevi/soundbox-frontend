import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { albums } from '../services/api';

const MOODS = ['HAPPY', 'MELANCHOLIC', 'NOSTALGIC', 'CALM', 'ANXIOUS', 'EUPHORIC', 'SAD', 'ENERGETIC'];
const CONTEXTS = ['DRIVING', 'WALKING', 'MORNING', 'NIGHT', 'WORKING', 'STUDYING', 'HEARTBREAK', 'PARTYING', 'RELAXING'];

function formatDuration(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function AlbumDetail() {
    const { mbid } = useParams();
    const navigate = useNavigate();
    const [album, setAlbum] = useState(null);
    const [tracks, setTracks] = useState([]);
    const [logModal, setLogModal] = useState(false);
    const [logData, setLogData] = useState({ rating: '', mood: '', context: '', isFirstListen: false, note: '', favoriteTrack: '' });
    const [logged, setLogged] = useState(false);
    const [playing, setPlaying] = useState(false);
    const audioRef = useRef(null);

    useEffect(() => {
        albums.get(mbid).then(res => {
            setAlbum(res.data);
            try {
                const parsed = JSON.parse(res.data.tracklist);
                if (parsed && parsed[0] && parsed[0].tracks) {
                    setTracks(parsed[0].tracks);
                }
            } catch (e) {}
        }).catch(() => navigate('/'));
    }, [mbid]);

    useEffect(() => {
        return () => {
            if (audioRef.current) audioRef.current.pause();
        };
    }, []);

    const handleLog = async () => {
        try {
            await albums.log(mbid, {
                rating: logData.rating ? parseFloat(logData.rating) : null,
                mood: logData.mood || null,
                context: logData.context || null,
                isFirstListen: logData.isFirstListen || null,
                note: logData.note || null,
                favoriteTrack: logData.favoriteTrack || null,
            });
            setLogModal(false);
            setLogged(true);
        } catch (err) {
            alert('Error logging listen.');
        }
    };

    const inputStyle = {
        width: '100%', padding: '10px 14px', border: '1px solid #ddd',
        borderRadius: '4px', fontSize: '0.95rem', fontFamily: 'Inter, sans-serif',
        outline: 'none', boxSizing: 'border-box'
    };

    if (!album) return <div><Navbar /></div>;

    return (
        <div style={{ minHeight: '100vh', background: '#fff' }}>
            <Navbar />

            <div style={{ maxWidth: '960px', margin: '0 auto', padding: '64px 32px' }}>

                {/* Album header */}
                <div style={{ display: 'flex', gap: '48px', marginBottom: '64px', paddingBottom: '48px', borderBottom: '1px solid #eee' }}>

                    {/* Cover */}
                    <div style={{ flexShrink: 0 }}>
                        <div style={{ width: '220px', height: '220px', borderRadius: '4px', overflow: 'hidden', background: '#f5f5f5' }}>
                            {album.coverArtUrl ? (
                                <img src={album.coverArtUrl} alt={album.title}
                                     style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccc', fontSize: '0.85rem' }}>
                                    No cover
                                </div>
                            )}
                        </div>
                        {album.previewUrl && <audio ref={audioRef} src={album.previewUrl} />}
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <p style={{ fontSize: '0.75rem', letterSpacing: '2px', textTransform: 'uppercase', color: '#bbb', marginBottom: '12px' }}>
                            {album.releaseDate?.substring(0, 4)}
                        </p>
                        <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '2.8rem', lineHeight: 1.05, marginBottom: '8px', letterSpacing: '-1px' }}>
                            {album.title}
                        </h1>
                        <p style={{ fontSize: '1.1rem', color: '#555', marginBottom: '24px' }}>
                            {album.artist}
                        </p>

                        {album.genres && album.genres.length > 0 && (
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' }}>
                                {album.genres.map(g => (
                                    <span key={g} style={{
                                        fontSize: '0.75rem', padding: '3px 12px',
                                        border: '1px solid #ddd', borderRadius: '20px', color: '#666'
                                    }}>
                    {g}
                  </span>
                                ))}
                            </div>
                        )}

                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button
                                onClick={() => setLogModal(true)}
                                style={{
                                    padding: '10px 24px', background: logged ? '#555' : '#111',
                                    color: '#fff', border: 'none', borderRadius: '4px',
                                    cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontSize: '0.9rem'
                                }}>
                                {logged ? '✓ Logged' : 'Log listen'}
                            </button>
                            {album.previewUrl && (
                                <button
                                    onClick={() => {
                                        if (playing) {
                                            audioRef.current.pause();
                                            audioRef.current.currentTime = 0;
                                            setPlaying(false);
                                        } else {
                                            audioRef.current.play();
                                            setPlaying(true);
                                        }
                                    }}
                                    style={{
                                        padding: '10px 24px', background: 'transparent',
                                        color: '#111', border: '1px solid #ddd', borderRadius: '4px',
                                        cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontSize: '0.9rem'
                                    }}>
                                    {playing ? '■ Stop' : '▶ Preview'}
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Tracklist */}
                {tracks.length > 0 && (
                    <div>
                        <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.5rem', marginBottom: '24px' }}>
                            Tracklist
                        </h3>
                        <div>
                            {tracks.map((track, i) => (
                                <div key={i} style={{
                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                    padding: '12px 0', borderBottom: '1px solid #f5f5f5',
                                    cursor: 'pointer'
                                }}
                                     onMouseEnter={e => e.currentTarget.style.background = '#fafafa'}
                                     onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                     onClick={() => setLogData(prev => ({ ...prev, favoriteTrack: track.title }))}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <span style={{ color: '#ccc', fontSize: '0.8rem', width: '20px', textAlign: 'right' }}>
                      {track.number}
                    </span>
                                        <span style={{ fontSize: '0.95rem' }}>{track.title}</span>
                                    </div>
                                    {track.length && (
                                        <span style={{ color: '#bbb', fontSize: '0.85rem' }}>
                      {formatDuration(track.length)}
                    </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

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
                            {album.coverArtUrl && (
                                <img src={album.coverArtUrl} alt={album.title}
                                     style={{ width: '72px', height: '72px', objectFit: 'cover', borderRadius: '4px' }} />
                            )}
                            <div>
                                <h3 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>{album.title}</h3>
                                <p style={{ color: '#666', fontSize: '0.9rem' }}>{album.artist}</p>
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
                            <button onClick={() => setLogModal(false)} style={{
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

export default AlbumDetail;