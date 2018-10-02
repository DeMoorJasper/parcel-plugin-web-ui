import React from 'react';
import Project from './components/Project';

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      project: null
    };

    this.socket = null;
  }

  handleSocketMessage(evt) {
    let message = evt.data;
    try {
      let messageJSON = JSON.parse(message);
      if (messageJSON.type === 'response') {
        if (messageJSON.identifier === 'project-data') {
          let project = messageJSON.data;
          this.setState({ project });
        }
      }
    } catch(e) {}
  }

  componentDidMount() {
    this.socket = new WebSocket("ws://localhost:8001/");
    this.socket.onmessage = evt => this.handleSocketMessage(evt);
    this.socket.onopen = () => {
      console.log('Connected to websocket!');
      this.socket.send(JSON.stringify({
        type: 'request',
        identifier: 'project-data'
      }));
    };
  }

  render() {
    return <div className='main'>
      <Project project={this.state.project} />
    </div>;
  }
}
