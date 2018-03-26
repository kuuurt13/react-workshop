////////////////////////////////////////////////////////////////////////////////
// Exercise:
//
// - Refactor App by creating a new component named `<GeoPosition>`
// - <GeoPosition> should use a child render callback that passes
//   to <App> the latitude and longitude state
// - When you're done, <App> should no longer have anything but
//   a render method
//
// Got extra time?
//
// - Now create a <GeoAddress> component that also uses a render
//   callback with the current address. You will use
//   `getAddressFromCoords(latitude, longitude)` to get the
//   address, it returns a promise.
// - You should be able to compose <GeoPosition> and <GeoAddress>
//   beneath it to naturally compose both the UI and the state
//   needed to render it
// - Make sure <GeoAddress> supports the user moving positions
////////////////////////////////////////////////////////////////////////////////
import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import LoadingDots from "./utils/LoadingDots";
import getAddressFromCoords from "./utils/getAddressFromCoords";

class GeoPosition extends React.Component {
  state = {
    data: null
  };

  componentDidMount() {
    console.log(this.props)
    if (this.props.latitude && this.props.longitude) {
      getAddressFromCoords(this.props.latitude, this.props.longitude).then(data => {
        console.log(data)
        this.setState({ data })
      })
    }
  }

  render() {
    console.log(this.state.data)
    return <LoadingDots />
    return this.state.data ? this.props.children(this.state) : <LoadingDots />
  }
}

class GeoAddress extends React.Component {
  state = {
    coords: {
      latitude: null,
      longitude: null
    },
    error: null
  };

  componentDidMount() {
    // this.geoId = navigator.geolocation.watchPosition(
    //   position => {
    //     this.setState({
    //       coords: {
    //         latitude: position.coords.latitude,
    //         longitude: position.coords.longitude
    //       }
    //     });
    //   },
    //   error => {
    //     this.setState({ error });
    //   }
    // );

    this.setState({
      coords: {
        latitude: 41.120363,
        longitude: 76.529949
      }
    });
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.geoId);
  }

  render() {
    return this.props.children(this.state)
  }
}

class App extends React.Component {
  render() {
    return (
      <GeoPosition>
        {location => (
          <div>
            <h1>Geolocation</h1>
            <GeoPosition coords={location.coords}>
              {address => <div>{JSON.stringify(address)}</div>}
            </GeoPosition>
            {/* {location.error ? (
              <div>Error: {location.error.message}</div>
            ) : (
              <dl>
                <dt>Latitude</dt>
                <dd>{location.coords.latitude || <LoadingDots />}</dd>
                <dt>Longitude</dt>
                <dd>{location.coords.longitude || <LoadingDots />}</dd>
              </dl> */}
            )}
          </div>
        )}
      </GeoPosition>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("app"));
