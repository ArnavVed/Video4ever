// Server.js
const express = require("express");
const path = require("path");
const cors = require("cors");
const app = express();
const mysql = require('mysql');

// Middleware setup
app.use(cors());
app.use(express.json());

// Static file serving for the React build (if you do a production build)
app.use(express.static(path.join(__dirname, "../client/build")));

// Create a connection to the database
const db = mysql.createConnection({
    host: 'ec2-3-219-93-177.compute-1.amazonaws.com',
    user: 'video',
    password: 'video4Ever',
    database: 'Video4Ever'
});

// Connect to the database
db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the MySQL database.');
});

// API endpoint to retrieve inventory for a selected branch
app.get('/:branch', (req, res) => {
    const branch = req.params.branch;
    const query = `
        SELECT DISTINCT movie.Title, movie.Price, dir.DirectorFirst, dir.DirectorLast, inv.OnHand 
        FROM Movie as movie
        INNER JOIN Directed as direct ON movie.MovieCode = direct.MovieCode
        INNER JOIN Director as dir ON direct.DirectorID = dir.DirectorID
        INNER JOIN Inventory as inv ON inv.MovieCode = movie.MovieCode
        INNER JOIN Branch AS br ON br.BranchNum = inv.BranchNum
        WHERE br.BranchNum = ? 
        ORDER BY movie.Title ASC;
    `;

    db.query(query, [branch], (error, results) => {
        if(error){
            console.error(error.message);
            res.status(500).send('Error retrieving data');
        }
        else{ 
            const transformedResults = results.map((movie) => {
                return {
                    Title: movie.Title,
                    Price: `$${movie.Price.toFixed(2)}`,
                    Director: `${movie.DirectorFirst} ${movie.DirectorLast}`,
                    OnHand: movie.OnHand
                };
            });
            res.json(transformedResults);
        } 
    });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});
