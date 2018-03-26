////////////////////////////////////////////////////////////////////////////////
// Exercise:
//
// Make `withMouse` a "higher-order component" that sends the mouse position
// to the component as props (hint: use `event.clientX` and `event.clientY`).
//
// Got extra time?
//
// Make a `withCat` HOC that shows a cat chasing the mouse around the screen!
////////////////////////////////////////////////////////////////////////////////
import "./styles.css";

import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";

function withMouse(Component) {
  return class ComponentWithMouse extends React.Component {
    state = {
      mouse: { x: 0, y: 0 },
      cat: { x: 0, y: 0 }
    }

    componentWillMount() {
      document.addEventListener('mousemove', this.mouseMove)
    }

    mouseMove = (e) => {
      const { screenX: x, screenY: y } = e
      this.setState({
        mouse: { x, y }
      })
    }

    render () {
      return (
        <div >
          <Component {...this.props} mouse={this.state.mouse} />
        </div>
      )
    }
  }
}

function withCat(distance = { x: 60, y: 160 }) {
  return (Component) => class ComponentWithCat extends React.Component {
    render () {
      const cat = {
        x: this.props.mouse.x - distance.x,
        y: this.props.mouse.y - distance.y
      }

      return <Component {...this.props} cat={cat} />
    }
  }
}

class App extends React.Component {
  static propTypes = {
    mouse: PropTypes.shape({
      x: PropTypes.number.isRequired,
      y: PropTypes.number.isRequired
    }).isRequired
  };

  render() {
    const { mouse, cat } = this.props;

    return (
      <div className="container">
        <div>
          {mouse ? (
            <h1>
              The mouse position is ({mouse.x}, {mouse.y})
            </h1>
          ) : (
            <h1>We don't know the mouse position yet :(</h1>
          )}
        </div>
        <div
          className="cat"
          style={{
            left: cat.x + 'px',
            top: cat.y + 'px',
            transform: `rotate(${cat.x}deg)`
          }}
        >
        </div>
      </div>
    );
  }
}

const AppWithMouse = withMouse(
  withCat({ x: 90, y: 160 })(App)
);

ReactDOM.render(<AppWithMouse />, document.getElementById("app"));
