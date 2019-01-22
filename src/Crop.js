import React, { Component } from 'react';
import './Crop.css';

import ReactCrop from 'react-image-crop';

class Crop extends Component {
	constructor() {
		super();

		this.state = {
			imagePath: null,
		};
		
		/* this */
		this.onCropChange = this.onCropChange.bind(this);
		this.onInputChange = this.onInputChange.bind(this);
	}
	
	onCropChange(e) {

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
				})
			};
			
			reader.onerror = e => {
				console.error("Файл не может быть прочитан! код " + e.target.error.code);
			};
			
			reader.readAsDataURL(file);
		}

		// console.log('target, value, files', target, value, files);
	}

	render() {
		const { imagePath } = this.state;
		console.log('imagePath', imagePath);

		return (
			<div className="Crop">
				<input type="file" onChange={this.onInputChange} />
				{/*  imagePath && <img src='dog.png' />  */}
				{imagePath && <ReactCrop src={imagePath} onChange={this.onCropChange}/>}
			</div>
		);
	}
}

export default Crop;
