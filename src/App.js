import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
	render() {
		return (
			<div className="App">
				{/*<video preload="auto" muted controls={true} >*/}
				<video preload="auto" muted playsInline autoPlay="autoplay" loop="loop">
				  <source src="./360_25_100_h264.mp4" type="video/mp4" />
				  <source src="./360_25_100_vp8.webm" type="video/webm" />
				  Your browser doesn't support HTML5 video tag.
				</video>
			</div>
		);
	}
}

export default App;