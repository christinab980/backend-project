require('dotenv').config();
const express = require("express");

const server = express();

const PORT = process.env.PORT || 8080;

server.get('/heartbeat', (req, res) => {
    console.log('heartbeat', req.heartbeat);
    res.json({message: 'You are at the /heartbeat'})
});

server.listen(PORT, () =>
    console.log(`This server is running at POST ${PORT}`)    
)