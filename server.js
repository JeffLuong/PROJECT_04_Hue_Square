var express            = require('express'),
    server             = express(),
    mongoose           = require('mongoose'),
    morgan             = require('morgan'),
    session            = require('express-session');
    // url                = 'mongodb://localhost:27017/hue_db';

// This sets PORT to the process PORT, if it doesn't exist, use local port.
// var PORT = process.env.PORT || 3000;
// var MONGOURI = process.env.MONGOLAB_URI || url;

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

// mongoose.connect(MONGOURI);
// var db = mongoose.connection;

// db.on('error', function() {
//   console.log("Database error");
// });
//
// db.once('open', function() {
//   console.log("Database up and running");
  server.listen(3000, function() {
    console.log("Server up and running");
  });
// });
