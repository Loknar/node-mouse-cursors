
// client interaction functionality setup
window.onload = function () {
  var socket = io.connect('http://localhost:3700');
  
  // send mouse position updates
  document.onmousemove = function (ev) {
    socket.emit("mouse movement", { pos: { x: ev.clientX, y: ev.clientY } });
  }
  
  // initial setup, should only happen once right after socket connection has been established
  socket.on('mouse setup', function (mouses) {
    for (var mouse_id in mouses) {
      virtualMouse.move(mouse_id, mouses.mouse_id);
    }
  });
  
  // update mouse position
  socket.on('mouse update', function (mouse) {
    virtualMouse.move(mouse.id, mouse.pos);
  });
  
  // remove disconnected mouse
  socket.on('mouse disconnect', function (mouse) {
    virtualMouse.remove(mouse.id);
  });
  
}

// virtual mouse module
var virtualMouse = {
  // moves a cursor with corresponding id to position pos
  // if cursor with that id doesn't exist we create one in position pos
  move: function (id, pos) {
    var cursor = document.getElementById('cursor-' + id);
    if (!cursor) {
      cursor = document.createElement('img');
      cursor.className = 'virtualMouse';
      cursor.id = 'cursor-' + id;
      cursor.src = '/img/cursor.png';
      cursor.style.position = 'absolute';
      document.body.appendChild(cursor);
    }
    cursor.style.left = pos.x + 'px';
    cursor.style.top = pos.y + 'px';
  },
  // remove cursor with corresponding id
  remove: function (id) {
    var cursor = document.getElementById('cursor-' + id);
    cursor.parentNode.removeChild(cursor);
  }
}