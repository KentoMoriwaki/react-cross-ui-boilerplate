import React, { Component } from "react";
import * as ui from "react-cross-ui-boilerplate";
import logo from "./logo.svg";
import "./App.css";

class App extends Component {
  render() {
    console.log(ui.Button);
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <ui.Button>Hello, World</ui.Button>
      </div>
    );
  }
}

export default App;
