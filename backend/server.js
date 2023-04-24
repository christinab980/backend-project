require('dotenv').config();
const cookieParser = require('cookie-parser');
const sessions = require('express-session');
const es6Renderer = require("express-es6-template-engine");
const express = require("express");
const navs = require('./data/navs.json');

const { checkAuth } = require('./middleware');
const { setMainView, setNavs } = require('./utils');
const server = express();

server.use(express.static('public'))
server.use(express.json());
server.use(cookieParser());
server.use(sessions({
   secret: process.env.SECRET,
   saveUninitialized: true,
   cookie: {maxAge: 30000}, 
   resave: false
}));

const validCreds = {
   password: '1234',
   username: 'anna'
};

server.engine('html', es6Renderer);
server.set('views', 'views');
server.set('view engine', 'html')

const PORT = process.env.PORT || 8080;

server.get('/', (req, res) => {
   res.render('index', {
    locals: { navs },
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
     locals: setNavs(req.url, navs, !!req.session.userId),
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
      req.session.userID = username
      afterlogin.isAuthenticated = true;
      afterlogin.redirectTo = '/profile';
   } 
   res.json(afterlogin);
 });

 server.get('/gallery', (req, res) => {
    res.render('index', {
     locals: setNavs(req.url, navs , !!req.session.userId),
     partials: setMainView('gallery')
    });
 });

 server.get('/about', (req, res) => {
    res.render('index', {
    locals: setNavs(req.url, navs, !!req.session.userId),
     partials: setMainView('about')
    });
 });

 server.get('/contact-us', (req, res) => {
    res.render('index', {
    locals: setNavs(req.url, navs, !!req.session.userId),
     partials: setMainView('contactus')
    });
 });

 server.get('/logout', (req, res) => {
    res.render('index', {
     locals: setNavs(req.url, navs, !!req.session.userId),
     partials: setMainView('logout')
    });
 });

 server.get('/profile', checkAuth, (req, res) => {
    res.render('index', {
     locals: setNavs(req.url, navs, !!req.session.userId),
     partials: setMainView('profile')
    });
 });


server.listen(PORT, () =>
    console.log(`This server is running at POST ${PORT}`)    
)