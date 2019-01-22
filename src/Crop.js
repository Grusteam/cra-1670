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

		
		this.extremums = {
			imageMaxSize: 1000000000, /* bytes */
			fileTypes: ['x-png', 'png', 'jpg', 'jpeg', 'gif'],
		};
		

		/* this */
		this.onCropChange = this.onCropChange.bind(this);
		this.onInputChange = this.onInputChange.bind(this);
		this.onImageLoaded = this.onImageLoaded.bind(this);
		this.onComplete = this.onComplete.bind(this);
		this.verifyFiles = this.verifyFiles.bind(this);
		this.onDownloadClick = this.onDownloadClick.bind(this);
	}

	verifyFiles = (files) => {
        if (files && files.length > 0){
            const
				currentFile = files[0],
				currentFileType = currentFile.type,
				shortenFileType = currentFile.type.split('image/')[1],
				currentFileSize = currentFile.size;

			console.log('shortenFileType', shortenFileType);

            if (currentFileSize > this.imageMaxSize) {
                alert("This file is not allowed. " + currentFileSize + " bytes is too large")
                return false;
            }

			console.log('currentFileType', currentFileType);

            if (!this.extremums.fileTypes.includes(shortenFileType)){
                alert("This file is not allowed. Only images are allowed.")
                return false;
            }

            return true;
        }
    }
	
	onCropChange(crop) {
        this.setState({crop})
	}
	
	onInputChange(e) {
		const
			{ target } = e,
			{ value, files } = target,
			file = files[0];


		if (this.verifyFiles(files)) {
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

		image64toCanvasRef(canvas, imagePath, pixelCrop);
	}

	onDownloadClick(e) {
		const
			{ canvas } = this.refs,
			{ imagePath } = this.state,
			fileName = `name.${extractImageFileExtensionFromBase64(imagePath)}`,
			canvasData = canvas.toDataURL(fileName),
			file = downloadBase64File(canvasData, fileName);

		console.log('file', file);
	}

	render() {
		const { crop, imagePath } = this.state;

		console.log('crop, imagePath', crop, imagePath);

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
				<button onClick={this.onDownloadClick}>Download</button>
			</div>
		);
	}
}

export default Crop;
