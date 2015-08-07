var express            = require('express'),
    server             = express(),
    morgan             = require('morgan'),
    session            = require('express-session');

var PORT = process.env.PORT || 3000;

// MORGAN ERROR DETECTION
server.use(morgan('short'));

// SESSIONS
server.use(session({
  secret: "mysecret",
  resave: true,
  saveUninitialized: false
}));

// STATIC FILES
server.use(express.static("./public"));

// LANDING PAGE
server.get('/', function(req, res) {
  res.render('index');
});

server.get('/about', function(req, res) {
  res.render('about');
});

server.listen(PORT, function() {
  console.log("Server up and running");
});
