import React, { Component } from "react";
import * as ui from "react-cross-ui-boilerplate";
import logo from "./logo.svg";
import "./App.css";

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <div style={{ marginTop: "50px" }}>
          <ui.Button>話を聞きに行きたい</ui.Button>
        </div>
      </div>
    );
  }
}

export default App;
