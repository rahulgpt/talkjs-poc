import React, { Component } from 'react';
import styles from '../styles/Home.module.css';
import { withRouter } from 'next/router';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: '',
      targetId: '',
    }

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleUserIdChange = this.handleUserIdChange.bind(this);
    this.handleTargetIdChange = this.handleTargetIdChange.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();

    this.props.router.push(`/chat/${this.state.userId}/${this.state.targetId}`);
  }

  handleUserIdChange(e) {
    this.setState({ userId: e.target.value });
  }

  handleTargetIdChange(e) {
    this.setState({ targetId: e.target.value });
  }

  render() {
    return (
      <div className={styles.container}>
        <h1>Welcome</h1>
        <form onSubmit={this.handleSubmit}>
          <label>
            Your Id:
            <input type="text" name="name" value={this.state.value} onChange={this.handleUserIdChange} />
          </label>

          <label>
            Target Id:
            <input type="text" name="name" value={this.state.value} onChange={this.handleTargetIdChange} />
          </label>
          <input type="submit" value="Submit" />
        </form>
      </div>
    );
  }
}

export default withRouter(App);