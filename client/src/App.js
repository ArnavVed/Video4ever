// App.js
import React, { useState } from 'react';
import './App.css';

function App() {
  const [branch, setBranch] = useState('');
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState('');

  const handleFetch = () => {
    if (!branch) {
      setError('Please select a branch first.');
      return;
    }
    setError('');
    fetch(`http://localhost:8080/${branch}`) // Adjust if your server runs elsewhere
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok.');
        }
        return response.json();
      })
      .then(data => {
        setMovies(data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setError('Error fetching data. Please try again later.');
      });
  };

  return (
    <div className="App">
      <h1>Video4Ever Inventory By Branch</h1>

      <div className="branch-selection">
        <label htmlFor="branch">Select Branch: </label>
        <select id="branch" value={branch} onChange={e => setBranch(e.target.value)}>
          <option value="">--Select a Branch--</option>
          <option value="1">Branch 1</option>
          <option value="2">Branch 2</option>
          <option value="3">Branch 3</option>
          <option value="4">Branch 4</option>
        </select>
        <button onClick={handleFetch}>Get Inventory</button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {movies.length > 0 && (
        <table className="movie-table">
          <thead>
            <tr>
              <th>Movie Title</th>
              <th>Price</th>
              <th>Director</th>
              <th>On Hand</th>
            </tr>
          </thead>
          <tbody>
            {movies.map((movie, index) => (
              <tr key={index} className={index % 2 === 0 ? 'even-row' : 'odd-row'}>
                <td>{movie.Title}</td>
                <td>{movie.Price}</td>
                <td>{movie.Director}</td>
                <td>{movie.OnHand}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;
