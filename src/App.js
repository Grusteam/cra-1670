import React, { Component } from 'react';
import './App.css';
import { Cropper } from 'react-image-cropper';
import {
	downloadBase64File,
	base64StringtoFile,
	extractImageFileExtensionFromBase64,
	image64toCanvasRef,
} from './Utils';

class App extends Component {
	constructor() {
		super();
		this.onClick = this.onClick.bind(this);
	}
	componentDidMount() {
	}

	onClick(e) {
			const
				values = this.cropper.values(),
				Base64 = this.cropper.crop(),
				extention = extractImageFileExtensionFromBase64(Base64),
				{ canvas } = this.refs,
				fileName = `name.${extention}`,
				file = base64StringtoFile(Base64, fileName);

			downloadBase64File(Base64, fileName);

			console.log('file', file);
	}

	render() {
		return (
			<div className="App">
				<Cropper 
						src="sample.jpg" 
						ref={ ref => { this.cropper = ref }}
				/>
				<button onClick={this.onClick}>Click</button>
				<canvas ref="canvas"></canvas>
			</div>
		);
	}
}

export default App;
