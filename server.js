const express = require('express');
let bodyParser = require('body-parser')
const path = require('path');
const app = express();
let http = require('http').Server(app)
let io = require('socket.io')(http)
const port = process.env.PORT || 5000;

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))
// API calls
let messages = [
  {name: 'Time', message:'Hi'},
  {name: 'Jane', message:'Hello'}
]
app.get('/messages', (req, res) => {
  res.send(messages);
});
app.post('/messages', (req, res)=>{
  messages.push(req.body)
  io.emit('message', req.body)
  res.sendStatus(200)
})
io.on('connection', (socket)=>{
  console.log('a user connected')
})
if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, 'client/build')));
  // Handle React routing, return all requests to React app
  app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}
http.listen(port, () => console.log(`Listening on port ${port}`));