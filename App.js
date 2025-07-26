import React, { useEffect, useState } from 'react';

const CLIENT_ID = 'YOUR_SPOTIFY_CLIENT_ID';
const REDIRECT_URI = 'http://localhost:3000';
const AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize';
const RESPONSE_TYPE = 'token';

const moodPlaylists = {
  Happy: '37i9dQZF1DXdPec7aLTmlC',
  Sad: '37i9dQZF1DWVrtsSlLKzro',
  Chill: '37i9dQZF1DX4WYpdgoIcn6',
  Energetic: '37i9dQZF1DX1g0iEXLFycr'
};

function App() {
  const [token, setToken] = useState('');
  const [mood, setMood] = useState('Happy');
  const [tracks, setTracks] = useState([]);

  useEffect(() => {
    const hash = window.location.hash;
    let token = window.localStorage.getItem('token');

    if (!token && hash) {
      token = hash.substring(1).split('&').find(elem => elem.startsWith('access_token')).split('=')[1];

      window.location.hash = '';
      window.localStorage.setItem('token', token);
    }

    setToken(token);
  }, []);

  const logout = () => {
    setToken('');
    window.localStorage.removeItem('token');
  };

  const getPlaylist = async () => {
    const playlistId = moodPlaylists[mood];
    const res = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const data = await res.json();
    setTracks(data.items);
  };

  return (
    <div className="App">
      <h1>🎧 Chillify – Mood Music Player</h1>
      {!token ? (
        <a
          href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`}
        >
          Login to Spotify
        </a>
      ) : (
        <>
          <button onClick={logout}>Logout</button>
          <div>
            <label>Select Mood: </label>
            <select value={mood} onChange={(e) => setMood(e.target.value)}>
              {Object.keys(moodPlaylists).map(m => (
                <option key={m}>{m}</option>
              ))}
            </select>
            <button onClick={getPlaylist}>Get Playlist</button>
          </div>

          <div className="playlist">
            {tracks.map((track, idx) => (
              <div key={idx} className="track">
                <img src={track.track.album.images[0]?.url} alt="album" width="100" />
                <p>{track.track.name}</p>
                <p className="artist">{track.track.artists[0].name}</p>
                <audio controls src={track.track.preview_url}></audio>
              </div>
            ))}
          </div>

        </>
      )}
    </div>
  );
}

export default App;
