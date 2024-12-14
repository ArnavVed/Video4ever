const express = require("express");
const path = require("path");
const app = express();
app.use(express.static(path.join(__dirname, "../client/build")));
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});

const mysql = require('mysql2');

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


