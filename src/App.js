import React, { Component } from 'react';
import './App.css';

import Crop from './Crop';

class App extends Component {
  render() {
    return (
      <div className="app" >
        <Crop test="test_1"/>
      </div>
    );
  }
}

export default App;
