import React, { Component } from 'react';
import './Crop.css';

import ReactCrop from 'react-image-crop';
import './custom-image-crop.css';

import {base64StringtoFile,
    downloadBase64File,
    extractImageFileExtensionFromBase64,
    image64toCanvasRef
} from './Utils'

class Crop extends Component {
	constructor() {
		super();

		this.state = {
			crop: {
				// aspect: 1/1
			},
			imagePath: null,
		};

		
		/* this */
		this.onCropChange = this.onCropChange.bind(this);
		this.onInputChange = this.onInputChange.bind(this);
		this.onImageLoaded = this.onImageLoaded.bind(this);
		this.onComplete = this.onComplete.bind(this);
	}
	
	onCropChange(crop) {
        this.setState({crop})
	}
	
	onInputChange(e) {
		const
			{ target } = e,
			{ value, files } = target,
			file = files[0];

		if (file) {
			const reader = new FileReader();

			reader.onload = e => {
				const imagePath = e.target.result;

				this.setState({
					imagePath
				});
			};
			
			reader.onerror = e => {
				console.error("Файл не может быть прочитан! код " + e.target.error.code);
			};
			
			reader.readAsDataURL(file);
		}

		// console.log('target, value, files', target, value, files);
	}

	onImageLoaded(e) {
		console.log('onImageLoaded');
	}

	onComplete(crop, pixelCrop) {
		const
			{ canvas } = this.refs,
			{ imagePath } = this.state;

		image64toCanvasRef(canvas, imagePath, pixelCrop)
	}

	render() {
		const { crop, imagePath } = this.state;

		return (
			<div className="Crop">
				{/*  imagePath && <img src='dog.png' />  */}
				{
					imagePath ?
						<ReactCrop
							src={imagePath}
							onChange={this.onCropChange}
							crop={crop} 
							onImageLoaded={this.onImageLoaded}
							onComplete = {this.onComplete}
						/> :
						<input type="file" onChange={this.onInputChange} />
				}
				<canvas ref="canvas" width="0" height="0"></canvas>
			</div>
		);
	}
}

export default Crop;
