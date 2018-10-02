import React from 'react';

export default class Project extends React.Component {
  render() {
    if (!this.props.project) {
      return 'Loading...';
    }
    
    return <div className="project">
      <h1 className="project-title">{this.props.project.name}</h1>
      <div className="project-status-container">
        <div className={`project-status-animation-container ${this.props.project.status ==='watching' ? 'positive' : 'negative'}`}>
          <div className="project-status-circle"></div>
        </div>
        <h2 className="project-status-text">
          {this.props.project.status}
        </h2>
      </div>
    </div>;
  }
}