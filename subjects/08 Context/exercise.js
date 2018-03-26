////////////////////////////////////////////////////////////////////////////////
// Exercise:
//
// Using context, implement the <Form>, <SubmitButton>, and <TextInput>
// components such that:
//
// - Clicking the <SubmitButton> calls <Form onSubmit>
// - Hitting "Enter" while in a <TextInput> submits the form
// - Don't use a <form> element, we're intentionally recreating the
//   browser's built-in behavior
//
// Got extra time?
//
// - Send the values of all the <TextInput>s to the <Form onSubmit> handler
//   without using DOM traversal APIs
// - Implement a <ResetButton> that resets the <TextInput>s in the form
////////////////////////////////////////////////////////////////////////////////
import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";

class Form extends React.Component {
  static childContextTypes = {
    onSubmit: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    onReset: PropTypes.func.isRequired,
    form: PropTypes.object.isRequired
  }

  state = {
    form: {}
  }

  getChildContext() {
    return {
      onSubmit: this.onSubmit,
      onChange: this.onChange,
      onReset: this.onReset,
      form: this.state.form
    }
  }

  onReset = () => {
    this.setState({ form: {} })
  }

  onChange = (name, value) => {
    this.setState(state => ({
      ...state,
      form: { ...state.form, [name]: value }
    }))
  }

  onSubmit = () => {
    this.props.onSubmit(this.state.form)
  }

  render() {
    return <div>{this.props.children}</div>;
  }
}

class SubmitButton extends React.Component {
  static contextTypes = {
    onSubmit: PropTypes.func.isRequired,
  }

  render() {
    return <button onClick={this.context.onSubmit}>{this.props.children}</button>;
  }
}

class ResetButton extends React.Component {

  static contextTypes = {
    onReset: PropTypes.func.isRequired,
  }

  render() {
    return <button style={{ backgroundColor: 'red' }} onClick={this.context.onReset}>{this.props.children}</button>;
  }

}

class TextInput extends React.Component {
  static contextTypes = {
    onSubmit: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    form: PropTypes.object.isRequired,
  }

  render() {
    return (
      <input
        type="text"
        name={this.props.name}
        placeholder={this.props.placeholder}
        value={this.context.form[this.props.name] || ''}
        onChange={e => {
          this.context.onChange(this.props.name, e.target.value)
        }}
        onKeyPress={e => e.key === 'Enter' && this.context.onSubmit()}
      />
    );
  }
}

class App extends React.Component {
  handleSubmit = (form) => {
    if (form.firstName && form.lastName) {
      return alert("YOU WIN, " + form.firstName + ' ' + form.lastName);
    }

    document.getElementsByTagName('body')[0].style.backgroundColor = 'red'

    setTimeout(() => {
      alert("WE ALL LOSE!!!")
      document.getElementsByTagName('body')[0].style.backgroundColor = '#fff'
    })
  };

  render() {
    return (
      <div>
        <h1>
          This isn't even my final <code>&lt;Form/&gt;</code>!
        </h1>

        <Form onSubmit={this.handleSubmit}>
          <p>
            <TextInput name="firstName" placeholder="First Name" />{" "}
            <TextInput name="lastName" placeholder="Last Name" />
          </p>
          <p>
            <SubmitButton>Submit</SubmitButton>
            <ResetButton>Reset</ResetButton>
          </p>
        </Form>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("app"));
