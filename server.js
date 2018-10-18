const express = require('express');
let bodyParser = require('body-parser')
const path = require('path');
const app = express();
let http = require('http').Server(app)
let io = require('socket.io')(http)
const port = process.env.PORT || 5000;
let mongoose = require('mongoose')
const dbUrl = 'mongodb://user:user12345678@ds235243.mlab.com:35243/learning-node'
let Message = mongoose.model('Message',{
  name: String,
  message: String
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))

app.get('/messages', (req, res)=>{
  Message.find({},(err, messages)=>{
      res.send(messages)
  })
})

app.get('/messages/:user', (req, res)=>{
  let user = req.params.user
  Message.find({name: user},(err, messages)=>{
      res.send(messages)
  })
})

app.post('/messages', async (req, res)=>{
  try {
      // throw "some error" //for testing purpose
      let message = new Message(req.body)
      let messageSaved = await message.save()
      console.log('Message saved!', messageSaved)
      let censored = await Message.findOne({message: 'badword'})
      if(censored){
          console.log('Censored words found', censored)
          await Message.deleteOne({_id: censored.id})
          console.log('Censored word deleted!')
      } else {
          io.emit('message', req.body)
      }
      res.sendStatus(200)
  } catch (error){
      res.sendStatus(500)
      return console.error(error)
  } finally {
    console.log('Message post called')
  }
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

mongoose.connect(dbUrl,{useNewUrlParser: true},(err)=>{
  console.log('mongo db connection', err)
})

http.listen(port, () => console.log(`Listening on port ${port}`));