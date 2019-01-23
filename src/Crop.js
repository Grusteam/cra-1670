import React, { Component } from 'react';

/* dep */
import ReactCrop from 'react-image-crop';
import './custom-image-crop.css';

/* components */
import './Crop.css';
import Photo from './Photo';

/* Utils */
import {
	// base64StringtoFile,
    // downloadBase64File,
    extractImageFileExtensionFromBase64,
    image64toCanvasRef,
	_console,
} from './Utils'

/* ... . .-. --. . / --.. .... ..- .-. .- ...- .-.. . ...- */

class Crop extends Component {
	constructor(props) {
		super();

		// const {  } = props;
		this.cropFull = {
			/* проценты */
			x: 0,
			y: 0,
			width: 100,
			height: 100,
			/* фиксация соотношения сторон выделения */
			// aspect: 1/1
		};

		this.state = {
			crop: this.cropFull,
			imagePath: null,
			photos: [],
			showPopup: false,
		};

		/* статичные настройки */
		this.parameters = {
			imageMaxSize: 10 * 1000 * 1000, /* Mb */
			acceptMime: 'image/x-png, image/png, image/jpg, image/jpeg, image/gif',
			fileTypes: ['x-png', 'png', 'jpg', 'jpeg', 'gif'],
		};

		/* this */
		this.onCropChange = this.onCropChange.bind(this);
		this.onInputChange = this.onInputChange.bind(this);
		this.onImageLoaded = this.onImageLoaded.bind(this);
		this.onComplete = this.onComplete.bind(this);
		this.verifyFiles = this.verifyFiles.bind(this);
		this.onFinishEditingClick = this.onFinishEditingClick.bind(this);
		this.addImage = this.addImage.bind(this);
		this.showPopup = this.showPopup.bind(this);
	}
	
	/* ... . .-. --. . / --.. .... ..- .-. .- ...- .-.. . ...- */

	verifyFiles = (files) => {
        if (files && files.length > 0){
            const
				currentFile = files[0],
				currentFileType = currentFile.type,
				shortenFileType = currentFile.type.split('image/')[1],
				currentFileSize = currentFile.size;

			console.log('shortenFileType', shortenFileType);

            if (currentFileSize > this.imageMaxSize) {
                // alert("This file is not allowed. " + currentFileSize + " bytes is too large")
                return false;
            }

			console.log('currentFileType', currentFileType);

            if (!this.parameters.fileTypes.includes(shortenFileType)){
                // alert("This file is not allowed. Only images are allowed.")
                return false;
            }

            return true;
        }
    }
	
	/* во время перемещения выделенной области */
	onCropChange(crop) {
		// console.log('crop', crop);
        this.setState({crop})
	}

	/* после получения base64 из input.files */
	showPopup(imagePath) {
		this.setState({
			imagePath,
			showPopup: true,
		});
	}
	
	/* после открытия файла */
	onInputChange(e) {
		const
			{ target } = e,
			{ /* value, */ files } = target,
			file = files[0];

		// console.log('files', files);

		if (this.verifyFiles(files)) {
			/* вытыщим base64 картинку и кинем ее в колбэк */
			this.getBase64FromFile(file, this.showPopup);
		}

		// console.log('target, value, files', target, value, files);
	}

	/* base64 */
	getBase64FromFile(file, callback) {
		let base64;

		const reader = new window.FileReader();

		/* onload */
		reader.onload = e => {
			const base64 = e.target.result;
			
			callback(base64);
		};
		
		/* onerror */
		reader.onerror = e => {
			console.error("Файл не может быть прочитан! код " + e.target.error.code);
		};
		
		reader.readAsDataURL(file);
	}

	/* после получения изображения редактором */
	onImageLoaded(image, pixelCrop) {
		this.onComplete(null, pixelCrop);
		// console.log('image, pixelCrop', image, pixelCrop);
	}

	/* после отпускания области редактирования */
	onComplete(crop, pixelCrop) {
		// console.log('crop, pixelCrop', crop, pixelCrop);
		const
			{ canvas } = this.refs,
			{ imagePath } = this.state;

		image64toCanvasRef(canvas, imagePath, pixelCrop);
	}

	/* base64/URLEncoded => raw binary data string */
	dataURItoBlob(dataURI) {
		var byteString;
		if (dataURI.split(',')[0].indexOf('base64') >= 0)
			byteString = window.atob(dataURI.split(',')[1]);
		else
			byteString = window.decodeURI(dataURI.split(',')[1]);

		// separate out the mime component
		var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

		// write the bytes of the string to a typed array
		var ia = new Uint8Array(byteString.length);
		for (var i = 0; i < byteString.length; i++) {
			ia[i] = byteString.charCodeAt(i);
		}

		return new Blob([ia], {type:mimeString});
	}

	parseFileTypeToString(file) {
		const {
			name,
			lastModified,
			lastModifiedDate,
			webkitRelativePath,
			size,
		} = file,
		result = `name: ${name}, lastModified: ${lastModified}, lastModifiedDate: ${lastModifiedDate}, webkitRelativePath: ${webkitRelativePath}, size: ${size}, `;

		return result;
	}

	addImage(src) {
		// const { gallery } = this.refs;
	}

	/* конец редактированиия одной фотографии */
	onFinishEditingClick(e) {
		const
			{ canvas } = this.refs,
			{ imagePath } = this.state,
			fileName = `name.${extractImageFileExtensionFromBase64(imagePath)}`,
			canvasData = canvas.toDataURL(fileName),
			file = this.dataURItoBlob(canvasData),
			fd = new FormData();
		
			/*file = downloadBase64File(canvasData, fileName); 
			console.log('file', file);
			*/
		
		fd.append('file', file);

		/* check FD to screen */
		const
			fileFromFd = fd.get('file'),
			str = this.parseFileTypeToString(fileFromFd);

		console.log('canvasData', canvasData);
		console.log('file', file);
		console.log('fileFromFd', fileFromFd);
		_console(str);

		/* newPhoto */
		const newPhoto = { src: canvasData };

		this.setState({
			photos: [...this.state.photos, newPhoto],
			showPopup: false,
			crop: this.cropFull,
		});
	}

	/* ... . .-. --. . / --.. .... ..- .-. .- ...- .-.. . ...- */

	render() {
		const
			// {  } = this.props,
			{ crop, imagePath, photos, showPopup } = this.state;

		// console.log('crop, imagePath', crop, imagePath);

		return (
			<div className="Crop">
				{/*  imagePath && <img src='dog.png' />  */}

				{/* отредактированные фото */}
				{photos.map((image, i) => {
					const { src } = image;

					return (
						<Photo
							image={image}
							key={i}
						/>
					);
				})}
				
				<div className="gallery" ref="gallery"></div>
					{showPopup &&
						<div className="popup">
							<ReactCrop
								src={imagePath}
								onChange={this.onCropChange}
								crop={crop} 
								onImageLoaded={this.onImageLoaded}
								onComplete = {this.onComplete}
							/>
							<button className="finish-editing" onClick={this.onFinishEditingClick}>Finish editing</button>
						</div>		
					}
						<input
							accept={this.parameters.acceptMime}
							type="file"
							onChange={this.onInputChange}
							multiple={true}
							className="file-input"
						/>
				<canvas ref="canvas" style={{display:'none'}} width="0" height="0"></canvas>
				{/* <div className="console"></div> */}
			</div>
		);
	}
}

export default Crop;