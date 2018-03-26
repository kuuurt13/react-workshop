////////////////////////////////////////////////////////////////////////////////
import React from "react";
import PropTypes from "prop-types";
import { createHashHistory } from "history";

/*
// read the current URL
history.location

// listen for changes to the URL
history.listen(() => {
  history.location // is now different
})

// change the URL
history.push('/something')
*/

class Router extends React.Component {
  history = createHashHistory();

  static childContextTypes = {
    pushHistory: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
  }

  state = {
    location: {}
  }

  getChildContext() {
    return {
      pushHistory: this.pushHistory,
      location: this.state.location,
    }
  }

  componentDidMount() {
    this.setState({ location: this.history.location })

    this.history.listen((location) => { this.setState({ location }) })
  }

  pushHistory = (path) => {
    this.state.location.pathname !== path && this.history.push(path)
  }

  render() {
    return this.props.children;
  }
}

class Route extends React.Component {
  static contextTypes = {
    location: PropTypes.object.isRequired,
  }

  render() {
    const { path, render, component: Component } = this.props;
    const { location = {} } = this.context
    const route = render ? render() : <Component />

    return path === location.pathname ? route : null
  }
}

class Redirect extends React.Component {
  static contextTypes = {
    location: PropTypes.object.isRequired,
    pushHistory: PropTypes.func.isRequired,
  }

  redirect = () => {
    const { from, to } = this.props;
    const { pushHistory, location = {} } = this.context

    if (from === location.pathname) {
      pushHistory(to)
    }
  }

  componentDidMount() {
    this.redirect()
  }

  componentDidUpdate() {
    this.redirect()
  }

  render () { return null }
}

class Link extends React.Component {
  static contextTypes = {
    pushHistory: PropTypes.func.isRequired,
  }

  handleClick = e => {
    e.preventDefault();
    this.context.pushHistory(this.props.to)
  };

  render() {
    return (
      <a href={`#${this.props.to}`} onClick={this.handleClick}>
        {this.props.children}
      </a>
    );
  }
}

export { Router, Route, Link, Redirect };
