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
			ReactCropImageSrc: null,
			photos: [],
			showPopup: false,
			editedPhotoIndex: null,
		};

		/* статичные настройки */
		this.parameters = {
			imageMaxSize: 10 * 1000 * 1000, /* Mb */
			acceptMime: 'image/x-png, image/png, image/jpg, image/jpeg, image/gif',
			fileTypes: ['x-png', 'png', 'jpg', 'jpeg', 'gif'],
		};

		this.fetchOptions = {
			endPoint: 'https://alterainvest.ru/api/v2/altbroker3/tools/picture/add/',
			type: 'POST',
			login: 'md.spb@alterainvest.ru',
			token: 'b83c6d2e38722893361052f3e740ca71',
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
		this.onCancelEditingClick = this.onCancelEditingClick.bind(this);
		this.tryFetch = this.tryFetch.bind(this);
		this.pushToPhotos = this.pushToPhotos.bind(this);
		this.onPhotoClick = this.onPhotoClick.bind(this);
		this.sendAll = this.sendAll.bind(this);
	}
	
	/* ... . .-. --. . / --.. .... ..- .-. .- ...- .-.. . ...- */

	async fetch({
		fetch = (typeof window === 'undefined' ? ()=>{} : window.fetch),
		address = 'http://httpbin.org/post',
		options = {
			method: 'POST',
			headers: new Headers({
				'Content-Type': 'json'
			}),
		},
	} = {}) {
		const result = await fetch(address, options).then(response => {
			const contentType = response.headers.get("content-type");

			if (contentType && contentType.includes("application/json")) {
				return response.json();
			}

			return response.blob();
		});

		return result;
	}

	async tryFetch() {
			const myHeaders = new Headers();

			myHeaders.append("Content-Type", "json");

			const
				options = {
					method: 'POST',
					headers: myHeaders,
					mode: 'cors',
					cache: 'default',
				};

			// console.log('crop, ReactCropImageSrc', crop, ReactCropImageSrc);

			const result = await this.fetch();

			return result;
		}

	verifyFiles = (files) => {
        if (files && files.length > 0){
            const
				currentFile = files[0],
				currentFileType = currentFile.type,
				shortenFileType = currentFile.type.split('image/')[1],
				currentFileSize = currentFile.size;

            if (currentFileSize > this.imageMaxSize) {
                // alert("This file is not allowed. " + currentFileSize + " bytes is too large")
                return false;
            }

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
	showPopup(ReactCropImageSrc, editedPhotoIndex) {
		this.setState({
			ReactCropImageSrc,
			showPopup: true,
			editedPhotoIndex,
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
			/* this.getBase64FromFile(file, this.showPopup); */
			this.getBase64FromFile(file, this.pushToPhotos);
		}

		// console.log('target, value, files', target, value, files);
	}

	pushToPhotos(base64) {
		/* newPhoto */
		const newPhoto = { src: base64 };

		this.setState({
			photos: [...this.state.photos, newPhoto],
		});
	}

	/* base64 */
	getBase64FromFile(file, callback) {
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
		/* const
			{ background, } = this.refs,
			{ width, height } = pixelCrop; */

		this.onComplete(null, pixelCrop);
		// console.log('image, pixelCrop', image, pixelCrop);
	}

	/* после отпускания области редактирования */
	onComplete(crop, pixelCrop) {
		// console.log('crop, pixelCrop', crop, pixelCrop);
		const
			{ canvas } = this.refs,
			{ ReactCropImageSrc } = this.state;

		image64toCanvasRef(canvas, ReactCropImageSrc, pixelCrop);
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

	/* отмена редактирования */
	onCancelEditingClick(e) {
		this.setState({
			showPopup: false,
		});
	}

	makeFormData() {
		/* FD> */
		// const fd = new FormData();
		
		// /*file = downloadBase64File(canvasData, fileName); 
		// console.log('file', file);
		// */
		
		// fd.append('file', file);
		// /* check FD to screen */
		// const
		// 	fileFromFd = fd.get('file'),
		// 	str = this.parseFileTypeToString(fileFromFd);

		// _console(str);
		/* <FD */
	}

	/* конец редактированиия одной фотографии */
	onFinishEditingClick(e) {
		const
			{ canvas } = this.refs,
			{ ReactCropImageSrc, photos, editedPhotoIndex } = this.state,
			fileName = `name.${extractImageFileExtensionFromBase64(ReactCropImageSrc)}`,
			canvasData = canvas.toDataURL(fileName),
			file = this.dataURItoBlob(canvasData);

		const 
			pre = photos.slice(0, editedPhotoIndex),
			newPhoto = { src: canvasData }, //current
			post = photos.slice(editedPhotoIndex + 1);

		this.setState({
			// photos: [...this.state.photos, newPhoto],
			photos: [...pre, newPhoto, ...post],
			showPopup: false,
			crop: this.cropFull,
		});
	}

	/* клик по фото для вызова редактора */
	onPhotoClick(index, e) {
		const
			{ target } = e,
			{ photos } = this.state,
			imageStateObj = photos[index],
			{ src } = imageStateObj;

		this.showPopup(src, index);
	}

	sendAll(e) {
		const
			{ photos } = this.state;
		
		console.log('photos', photos);
	}

	/* ... . .-. --. . / --.. .... ..- .-. .- ...- .-.. . ...- */

	render() {
		const
			// {  } = this.props,
			{ crop, ReactCropImageSrc, photos, showPopup } = this.state;

		/* setTimeout(async() => {
			const obj = await this.tryFetch();

			console.log('obj', obj);
		}, 1000); */

		return (
			<div className="Crop">
				{/*  ReactCropImageSrc && <img src='dog.png' />  */}

				{/* отредактированные фото */}
				<div className="photos">
					{photos.map((image, i) => {
						// const { src } = image;

						return (
							<Photo
								image={image}
								key={i}
								onClick={(...all) => this.onPhotoClick(i, ...all)}
							/>
						);
					})}
				</div>
				
				<div className="gallery" ref="gallery"></div>
						<div className="input-wrapper">
							<input
								accept={this.parameters.acceptMime}
								type="file"
								onChange={this.onInputChange}
								multiple={true}
								className="input-wrapper__input"
							/>
							<div className="input-wrapper__field">Перетащите сюда файлы для добавления или нажмите для выбора</div>
						</div>
						<div className={`popup ${showPopup ? 'is-active' : ''}`}>
							<div className="background" ref="background">
								{showPopup && <ReactCrop
									src={ReactCropImageSrc}
									onChange={this.onCropChange}
									crop={crop} 
									onImageLoaded={this.onImageLoaded}
									onComplete = {this.onComplete}
								/>}
								<div className="wrapper">
									<button ref="finish" className="finish-editing" onClick={this.onFinishEditingClick}>Finish editing</button>
									<button ref="cancel" className="cancel-editing" onClick={this.onCancelEditingClick}>cancel editing</button>
								</div>
							</div>
						</div>
				<canvas ref="canvas" style={{display:'none'}} width="0" height="0"></canvas>
				<button ref="sendAll" className="send" onClick={this.sendAll}>send all</button>
				{/* <div className="console"></div> */}
			</div>
		);
	}
}

export default Crop;