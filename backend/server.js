require('dotenv').config();
const cookieParser = require('cookie-parser');
const sessions = require('express-session');
const es6Renderer = require("express-es6-template-engine");
const express = require("express");
const navs = require('./data/navs.json');
const home = require('./data/home.json');
const search = require('./data/search.json');


const { checkAuth } = require('./middleware');
const { setMainView, setNavs } = require('./utils');
const server = express();

server.use("/", express.static(__dirname + "/public"));
server.use(express.static('files'))
server.use(express.json());
server.use(cookieParser());
server.use(sessions({
   secret: process.env.SECRET,
   saveUninitialized: true,
   cookie: {maxAge: 30000}, 
   resave: false
}));

const pgp = require('pg-promise')();

const bodyParser = require('body-parser')

// const server = express();
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

// Marcus insert

const db = pgp(cn);

// Marcus end

server.engine('html', es6Renderer);
server.set('views', 'views');
server.set('view engine', 'html')

const PORT = process.env.PORT || 8080;

server.get('/', (req, res) => {
   res.render('index', {
    locals: { home, navs, search },
    partials: setMainView('landing')
   });
});

server.get('/heartbeat', (req, res) => {
    res.json ({
    "is": "working",
    });
 });

server.get('/login', (req, res) => {
    res.render('index', {
     locals: { home, navs, search },
     partials: setMainView('login')
    });
 });

 server.post('/login', (req, res) => {
   const afterlogin = {
      isAuthenticated: false,
      redirectTo: '/login'
   }
   const { password, username } = req.body;
   if(password === validCreds.password && username === validCreds.username) {
      req.session.userID = username;
      afterlogin.isAuthenticated = true;
      afterlogin.redirectTo = '/profile';
   } 
   res.json(afterlogin);
 });

 server.get('/character', (req, res) => {
    res.render('index', {
     locals: { home, navs, search },
     partials: setMainView('character')
    });
 });

 server.get('/comic', (req, res) => {
    res.render('index', {
    locals: { home, navs, search },
     partials: setMainView('comic')
    });
 });

 server.get('/search', (req, res) => {
    res.render('index', {
    locals: { home, navs, search },
     partials: setMainView('search')
    });
 });

 server.get('/logout', (req, res) => {
   req.session.destroy();
   res.redirect('/');
 });

 server.get('/profile', checkAuth, (req, res) => {
    res.render('index', {
     locals: { home, navs, search },
     partials: setMainView('profile')
    });
 });

// ***Marcus insert pt 2

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
   const saltRounds = 10
   const hash = await bcrypt.hash(password, saltRounds)
   console.log('hashedPassword', hash)
   const newUser = await db.any(`INSERT INTO userPassword (username, password, gender) VALUES ($1, $2, $3)`, [username, hash, gender])
   res.send (newUser)
})

// ***Marcus insert pt 2 end

server.listen(PORT, () =>
    console.log(`This server is running at POST ${PORT}`)    
)

