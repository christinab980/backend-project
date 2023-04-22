const express = require("express");

const server = express();

server.use(express.json());

server.get('/', (req, res) => {
    res.json({message: 'You are at the root'})
});

server.get('/heartbeat', (req, res) => {
    console.log('heartbeat', req.heartbeat);
    res.json({message: 'You are at the /heartbeat'})
});

server.listen(8080, () =>
    console.log('This server is running at POST 8080')    
)