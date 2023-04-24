require('dotenv').config();
const es6Renderer = require("express-es6-template-engine");
const { setMainView, setNavs } = require('./utils');
const express = require("express");
const navs = require('./data/navs.json');

const server = express();
server.use(express.static('public'))

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
     locals: setNavs(req.url, navs),
     partials: setMainView('login')
    });
 });

 server.get('/gallery', (req, res) => {
    res.render('index', {
     locals: setNavs(req.url, navs),
     partials: setMainView('gallery')
    });
 });

 server.get('/about', (req, res) => {
    res.render('index', {
    locals: setNavs(req.url, navs),
     partials: setMainView('about')
    });
 });

 server.get('/contact-us', (req, res) => {
    res.render('index', {
    locals: setNavs(req.url, navs),
     partials: setMainView('contactus')
    });
 });

 server.get('/logout', (req, res) => {
    res.render('index', {
     locals: setNavs(req.url, navs),
     partials: setMainView('logout')
    });
 });

 server.get('/profile', (req, res) => {
    res.render('index', {
     locals: setNavs(req.url, navs),
     partials: setMainView('profile')
    });
 });


server.listen(PORT, () =>
    console.log(`This server is running at POST ${PORT}`)    
)