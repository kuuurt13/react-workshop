////////////////////////////////////////////////////////////////////////////////
// Exercise:
//
// Make this work like a normal <select> box!
////////////////////////////////////////////////////////////////////////////////
import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import "./styles.css";

class Select extends React.Component {
  static propTypes = {
    onChange: PropTypes.func,
    value: PropTypes.any,
    defaultValue: PropTypes.any
  };

  state = {
    value: null,
    isOpen: false
  }

  componentDidMount() {
    this.setState({ value: this.props.defaultValue })
  }

  toggleOpen = () => {
    this.setState(state => ({
      isOpen: !state.isOpen
    }))
  }

  onSelect = value => {
    this.toggleOpen()

    if (this.props.defaultValue) {
      this.setState({ value })
    } else {
      this.props.onChange(value)
    }
  }

  render() {
    const currentValue = this.props.value || this.state.value
    let label = null

    React.Children.forEach(this.props.children, ({ props }) => {
      if (props.value === currentValue) {
        label = props.children
      }
    })

    return (
      <div className="select">
        <div className="label" onClick={this.toggleOpen}>
          {label} <span className="arrow">▾</span>
        </div>
        <div className="options" style={{ display: this.state.isOpen ? 'block': 'none' }}>
          {React.Children.map(this.props.children, child => (
            React.cloneElement(child, {
              ...child.props,
              onSelect: value => this.onSelect(value)
            })
          ))}
        </div>
      </div>
    );
  }
}

class Option extends React.Component {
  static propTypes = {
    onSelect: PropTypes.func,
  }

  render() {
    return (
      <div
        className="option"
        onClick={() => this.props.onSelect(this.props.value)}
      >
        {this.props.children}
      </div>
    )
  }
}

class Selecty extends React.Component {
  static Select = Select
  static Option = Option
}

class App extends React.Component {
  state = {
    selectValue: "dosa"
  };

  setToMintChutney = () => {
    this.setState({ selectValue: "mint-chutney" });
  };

  render() {
    return (
      <div>
        <h1>Select + Option</h1>

        <h2>Controlled</h2>
        <pre>{JSON.stringify(this.state, null, 2)}</pre>
        <p>
          <button onClick={this.setToMintChutney}>
            Set to Mint Chutney
          </button>
        </p>

        <Select
          value={this.state.selectValue}
          onChange={value => this.setState({ selectValue: value })}
        >
          <Option value="tikka-masala">Tikka Masala</Option>
          <Option value="tandoori-chicken">Tandoori Chicken</Option>
          <Option value="dosa">Dosa</Option>
          <Option value="mint-chutney">Mint Chutney</Option>
        </Select>

        <h2>Uncontrolled</h2>
        <Select defaultValue="tikka-masala">
          <Option value="tikka-masala">Tikka Masala</Option>
          <Option value="tandoori-chicken">Tandoori Chicken</Option>
          <Option value="dosa">Dosa</Option>
          <Option value="mint-chutney">Mint Chutney</Option>
        </Select>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("app"));
