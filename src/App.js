import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

const
	_a = 'https://alterainvest.ru/upload/pic_alt3/21299__2e6f531c-6cc1-4457-9240-a94612e02c89/dog.png',
	_i = 'https://i.imgur.com/Qubd8YK.png';
	
class App extends Component {
	constructor() {
		super();
		
		this.startDownload = this.startDownload.bind(this);
		this.finishDownload = this.finishDownload.bind(this);
	}
	
	componentDidMount() {
		this.startDownload(_a);
	}
	
	startDownload(src) {
		const downloadedImg = new Image;
		
		// downloadedImg.crossOrigin = "Anonymous";
		downloadedImg.addEventListener("load", this.finishDownload, false);
		downloadedImg.src = src;
	}
	
	finishDownload({ path }) {
		const
			{ canvas, app } = this.refs,
			img = path[0],
			context = canvas.getContext('2d');
			
		context.drawImage(img, -50, 0);
		
		const src = canvas.toDataURL();
		
		const image = new Image;
		
		image.src = src;
		
		app.appendChild(image);
	}
	
	render() {
		return (
			<div ref="app" className="App">
				<canvas id="canvas" ref="canvas" width="200" height="400" />
			</div>
		);
	}
}

export default App;
