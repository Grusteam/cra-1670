import React, { Component } from 'react';
import './Crop.css';
import { Cropper } from 'react-image-cropper';
import {
	downloadBase64File,
	base64StringtoFile,
	extractImageFileExtensionFromBase64,
	// image64toCanvasRef,
} from './Utils';

class Crop extends Component {
	constructor() {
		super();
		
		/* this */
		this.onClick = this.onClick.bind(this);
		this.fileLoaded = this.fileLoaded.bind(this);
		this.appendImage = this.appendImage.bind(this);
	}

	componentDidMount() {
	}

	onClick(e) {
			const
				// { canvas } = this.refs,
				// values = this.cropper.values(),
				Base64 = this.cropper.crop(),
				extention = extractImageFileExtensionFromBase64(Base64),
				fileName = `name.${extention}`,
				file = base64StringtoFile(Base64, fileName);

			downloadBase64File(Base64, fileName);

			console.log('file', file);
	}

	fileLoaded({ target }) {
		const
			{ value } = target,
			file = target.files ? target.files[0] : null;

		if (file) {
			const
				fd = new FormData;

			fd.append('file', file);
			console.log('fd', fd.getAll('file'));
		}

		if (value) {
			this.appendImage(value);
		}
	}

	appendImage(img) {
		const { cropper } = this.refs;

		console.log('img', img);
		console.log('cropper', cropper);
		cropper.src = img;
	}

	render() {
		return (
			<div onChange={this.fileLoaded} className="Crop">
				<input name="file" type="file"/>
				<Cropper 
						src="" 
						ref="cropper"
				/>
				<button className="download" onClick={this.onClick}>Console && Download file</button>
				<canvas className="canvas" ref="canvas"></canvas>
			</div>
		);
	}
}

export default Crop;
