import React, { Component } from 'react';
import './App.css';
import openSocket from 'socket.io-client';
const socket = openSocket('/'); 

class App extends Component {
  state = {
    timestamp: 'no timestamp yet',
    response: ''
  };

  componentDidMount=()=> {
    this.callApi()
      .then(res => res.forEach(this.addMessages))
      .catch(err => console.log(err));
    socket.on('message', this.addMessages)
  }

  callApi = async () => {
    const response = await fetch('/messages');
    const body = await response.json();

    if (response.status !== 200) throw Error(body.message);

    return body;
  };  
  addMessages = (message)=>{
    document.getElementById('messages').insertAdjacentHTML('beforeend',`<h4> ${message.name}</h4> <p>${message.message}</p>`)
  }  
  postMessage = (message)=>{
    fetch('/messages',{
      method: 'post',
      body: JSON.stringify(message),
      headers: {"Content-Type": "application/json"}
    })
  }
  sendMessage =()=>{
    const name = document.getElementById('name').value;
    const message = document.getElementById('message').value;
    const msg = {name, message}
    console.log(msg)
    this.postMessage(msg)
  }

  render() {
    return (
      <div className="container">
        <br/>
        <p className="App-intro">{this.state.response}</p>
        <div className="jumbotron">
          <h1 className="display-4">Send Message</h1>
          <br/>
          <input id="name" type="text" className="form-control" placeholder="Name"/>
          <br/>
          <textarea id="message" className="form-control" placeholder="Message"></textarea>
          <br/>  
          <button id="send" className="btn btn-success" onClick={this.sendMessage}>Send</button>
        </div>
        <div id="messages"></div>
      </div>      
    );
  }
}

export default App;
