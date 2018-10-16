import React, { Component } from 'react';
import './App.css';

class App extends Component {
  state = {
    response: ''
  };

  componentDidMount=()=> {
    this.callApi()
      .then(res => this.setState({ response: res.express }))
      .catch(err => console.log(err));
    this.addMessages({name:'Tim', message:'Hello'})
  }

  callApi = async () => {
    const response = await fetch('/api/hello');
    const body = await response.json();

    if (response.status !== 200) throw Error(body.message);

    return body;
  };  
  addMessages = (message)=>{
    document.getElementById('messages').insertAdjacentHTML('afterbegin',`<h4> ${message.name}</h4> <p>${message.message}</p>`)
  }  

  render() {
    return (
      <div className="container">
        <br/>
        <p className="App-intro">{this.state.response}</p>
        <div className="jumbotron">
          <h1 className="display-4">Send Messageeeeee</h1>
          <br/>
          <input type="text" className="form-control" placeholder="Name"/>
          <br/>
          <button id="send" className="btn btn-success" onClick={this.componentDidMount}>Send</button>
        </div>
        <div id="messages"></div>
      </div>      
    );
  }
}

export default App;
