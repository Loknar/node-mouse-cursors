
var express = require('express');

// Create express app.
var app = express();
var port = 3700;

// Setup the template engine (jade)
app.set('views', __dirname + '/tpl');
app.set('view engine', "jade");
app.engine('jade', require('jade').__express);

// Middleware
app.get("/", function(req, res){
    res.render("page");
});

// setup a public folder directory
app.use(express.static(__dirname + '/public'));

// Listen with socket.io integration
var io = require('socket.io').listen(app.listen(port));
console.log("Listening on port " + port);


// Connection listening and handling
var positions = {}; // holds position of all mouse cursors
var total = 0;

io.sockets.on('connection', function (socket) {
  // assign the socket a numeric id
  socket.number = ++total; // socket.id used by socket.io, leave it alone
  
  // send the positions of everyone else
  socket.emit(positions);
  
  // send updated mouse position to everyone else
  socket.on('mouse movement', function (mouse) {
    positions[socket.number] = mouse.pos;
    socket.broadcast.emit('mouse update', { id: socket.number, pos: mouse.pos });
  });
  
  // let everyone else know about the disconnection
  socket.on('disconnect', function () {
    delete positions[socket.number];
    socket.broadcast.emit('mouse disconnect', { id: socket.number });
  });
});
