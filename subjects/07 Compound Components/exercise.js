////////////////////////////////////////////////////////////////////////////////
// Exercise:
//
// Implement a radio group form control with the API found in <App>.
//
// - Clicking a <RadioOption> should update the value of <RadioGroup>
// - The selected <RadioOption> should pass the correct value to its <RadioIcon>
// - The `defaultValue` should be set on first render
//
// Hints to get started:
//
// - <RadioGroup> will need some state
// - It then needs to pass that state to the <RadioOption>s so they know
//   whether or not they are active
//
// Got extra time?
//
// - Implement an `onChange` prop that communicates the <RadioGroup>'s state
//   back to the parent so it can use it to render.
// - Implement keyboard controls on the <RadioGroup> (you'll need tabIndex="0" on
//   the <RadioOption>s so the keyboard will work)
//   - Enter and space bar should select the option
//   - Arrow right, arrow down should select the next option
//   - Arrow left, arrow up should select the previous option
////////////////////////////////////////////////////////////////////////////////
import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";

class RadioGroup extends React.Component {
  static propTypes = {
    defaultValue: PropTypes.string
  };

  state = {
    currentValue: "fm",
    currentIndex: 0
  }

  componentWillMount() {
    this.props.defaultValue && this.setState({ currentValue: this.props.defaultValue })
    document.addEventListener('keydown', this.handleKeyboard)
  }

  handleKeyboard = ({ key }) => {
    const children = React.Children.toArray(this.props.children)
    if (key === 'ArrowUp') {
      const newIndex = this.state.currentIndex - 1 < 0 ? children.length - 1 : this.state.currentIndex - 1
      this.setState({ currentValue: children[newIndex].props.value, currentIndex: newIndex })
    } else if (key === 'ArrowDown') {
      const newIndex = this.state.currentIndex + 1 >= children.length ? 0 : this.state.currentIndex + 1
      this.setState({ currentValue: children[newIndex].props.value, currentIndex: newIndex })
    }
  }

  render() {
    return (
      <div>
        {React.Children.map(this.props.children, (child, i)  =>
          React.cloneElement(child, {
            _isSelected: child.props.value === this.state.currentValue,
            _onSelect: currentValue => {
              this.setState({ currentValue, currentIndex: i })
              this.props.onChange(currentValue)
            }
          })
        )}
      </div>
    )
  }
}

class RadioOption extends React.Component {
  static propTypes = {
    value: PropTypes.string,
    _onSelect: PropTypes.func,
  };

  render() {
    return (
      <div onClick={() => this.props._onSelect(this.props.value)}>
        <RadioIcon
          isSelected={this.props._isSelected}
        /> {this.props.children}
      </div>
    );
  }
}

class RadioIcon extends React.Component {
  static propTypes = {
    isSelected: PropTypes.bool.isRequired
  };

  render() {
    return (
      <div
        style={{
          borderColor: "#ccc",
          borderWidth: 3,
          borderStyle: this.props.isSelected ? "inset" : "outset",
          borderColor: this.props.isSelected ? "#bada55" : "#ccc",
          height: 16,
          width: 16,
          display: "inline-block",
          cursor: "pointer",
          background: this.props.isSelected ? "rgba(0, 0, 0, 0.05)" : ""
        }}
      />
    );
  }
}

class Radio extends React.Component {
  static Group = RadioGroup
  static Option = RadioOption
  static Icon = RadioIcon
}

class App extends React.Component {
  render() {
    return (
      <div>
        <h1>♬ It's about time that we all turned off the radio ♫</h1>

        <Radio.Group defaultValue="am" onChange={value => console.log(value)}>
          <Radio.Option value="am">AM</Radio.Option>
          <Radio.Option value="fm">FM</Radio.Option>
          <Radio.Option value="tape">Tape</Radio.Option>
          <Radio.Option value="aux">Aux</Radio.Option>
        </Radio.Group>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("app"));
