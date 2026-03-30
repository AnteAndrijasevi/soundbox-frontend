import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { albums } from '../services/api';

const MOODS = ['HAPPY', 'MELANCHOLIC', 'NOSTALGIC', 'CALM', 'ANXIOUS', 'EUPHORIC', 'SAD', 'ENERGETIC'];
const CONTEXTS = ['DRIVING', 'WALKING', 'MORNING', 'NIGHT', 'WORKING', 'STUDYING', 'HEARTBREAK', 'PARTYING', 'RELAXING'];

function Search() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

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

    const inputStyle = {
        width: '100%', padding: '10px 14px', border: '1px solid #ddd',
        borderRadius: '4px', fontSize: '0.95rem', fontFamily: 'Inter, sans-serif', outline: 'none'
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
                             onClick={() => navigate(`/albums/${album.mbid}`)}>
                            <div style={{
                                width: '100%', aspectRatio: '1', background: '#f5f5f5',
                                borderRadius: '4px', overflow: 'hidden', marginBottom: '8px',
                                transition: 'transform 0.2s, box-shadow 0.2s'
                            }}
                                 onMouseEnter={e => {
                                     e.currentTarget.style.transform = 'translateY(-2px)';
                                     e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)';
                                 }}
                                 onMouseLeave={e => {
                                     e.currentTarget.style.transform = 'translateY(0)';
                                     e.currentTarget.style.boxShadow = 'none';
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
        </div>
    );
}

export default Search;