// MORE CHANGES MAY BE IMPLEMENTED
const express = require("express");
const path = require("path");
const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "../client/build")));
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});

const mysql = require('mysql');

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

// result get method for each branch selected. Frontend should be able to choose between 4 branches
// needs to be displayed
app.get('/:branch', (req, res) => { //frontend should have a request including the branch number in order for this to work
    const branch = req.params.branch;
    const query = `SELECT DISTINCT movie.Title, movie.Price, dir.DirectorFirst, dir.DirectorLast 
    FROM Director as dir
    INNER JOIN Directed as direct
    ON movie.MovieCode = direct.MovieCode
    INNER JOIN Inventory as inv
    ON inv.MovieCode = movie.MovieCode
    INNER JOIN Branch AS branch
    ON branch.BranchNum = inv.BranchNum
    WHERE branch.BranchNum = ? 
    ORDER BY movie.Title ASC;
    `;
    // ? will make the branch number flexible to use in one method

    db.query(query, [branch], (error, results) => { // supposed to loop thru collected data and convert it to json
        if(error){
            console.error(error.message);
            res.status(500).send('Error retrieving data');
        }
        else{ 
            // have the query iterate thru the database results using the map method

            /**
             * for example:
             *  // Use map to transform data
            const transformedResults = results.map((movie) => {
                // Example transformation: Format the movie title and price
                return {
                    Title: movie.Title.toUpperCase(),  // Transform the title to uppercase
                    Price: `$${movie.Price.toFixed(2)}`,  // Format price as currency
                    Director: `${movie.DirectorFirst} ${movie.DirectorLast}`,  // Combine director names
                };
            });
             */

            res.json(results);}
    });
});

