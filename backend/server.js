require('dotenv').confiq();
const express = require("express");

const server = express();

server.get('/heartbeat', (req, res) => {
    console.log('heartbeat', req.heartbeat);
    res.json({message: 'You are at the /heartbeat'})
});

server.listen(8080, () =>
    console.log('This server is running at POST 8080')    
)