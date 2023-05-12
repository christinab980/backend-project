//  Method - db.many
// pg promise
// sat 4.30 & sat 05.07
// set up connection to database (assuming its connected to db)
// In database: INSERT INTO <table> (<column names>) VALUES (<values>)
// server is where all files should be
// only for routes (registration, this should be POST and login, ) and saves the database

// stuff with post. 

// 05.09
// Connect Database (db) to server
// Create a registration route (POST route)
// Go to handlesubmit function in draft and change it to a FETCH call

const express = require('express');
const pgp = require('pg-promise')();

const bodyParser = require('body-parser')

const server = express();
const bcrypt = require('bcrypt')
server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());

const cn = {
  host: 'localhost',
  port: 5432,
  database: 'login',
  user: 'postgres',
  password: 'password',
  allowExitOnIdle: true
};

const db = pgp(cn);

server.get("/allusers", async(req, res) => {
    const data = await db.any(`SELECT * FROM userPassword`)
    res.send(data)
})

server.post('/login', async(req, res) => {
    const {username, password} = req.body
    const foundUser = await db.any(`SELECT * FROM userPassword WHERE username = $1`, [username])
    console.log(foundUser[0].password)
    
    bcrypt.compare(password, foundUser[0].password, (err, result) => {
        if (err) {
          console.log('Error comparing passwords:', err);
        } else if (result) {
          console.log('Passwords Match!');
        } else {
          console.log('Passwords do not Match! *sadface*');
        }
      });
    if (foundUser.length > 0) {
    res.send(foundUser)
    } else {
        res.send('incorrect username/password')
    }
})

server.post('/register', async(req,res) => {
    const {username, password, gender} = req.body
    console.log(password)
    const saltRounds = 10
    const hash = await bcrypt.hash(password, saltRounds)
    console.log('hashedPassword', hash)
    const newUser = await db.any(`INSERT INTO userPassword (username, password, gender) VALUES ($1, $2, $3)`, [username, hash, gender])
    res.send (newUser)
})

const port = 8080

server.listen(port, () => {
    console.log(`Running on ${port}`)
});