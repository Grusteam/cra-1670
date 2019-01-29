import React, { Component } from 'react';

/* dep */
import ReactCrop from 'react-image-crop';
import './custom-image-crop.css';

/* components */
import './Crop.css';
import Photo from './Photo';

/* Utils */
import {
    image64toCanvasRef,
    extractImageFileExtensionFromBase64,
	// base64StringtoFile,
    // downloadBase64File,
	// dataURItoBlob,
	// parseFileTypeToString,
	// makeFormData,
	// _console,
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
		};

		this.state = {
			/* выделение */
			crop: this.cropFull,
			showPopup: false,
			ReactCropImageSrc: null,
			editedPhotoIndex: null,
			/* видимый результат */
			photos: [],
		};

		/* статичные настройки (ограничения!)*/
		this.parameters = {
			imageMaxSize: 10 * 1000 * 1000, /* Mb */
			acceptMime: 'image/x-png, image/png, image/jpg, image/jpeg, image/gif',
			fileTypes: ['x-png', 'png', 'jpg', 'jpeg', 'gif'],
			ratio: 983/517
		};

		/* тестовые данные */
		this.fetchOptions = {
			endPoint: 'https://alterainvest.ru/api/v2/altbroker3/tools/picture/add/',
			type: 'POST',
			login: 'md.spb@alterainvest.ru',
			token: 'b83c6d2e38722893361052f3e740ca71',
		};

		/* this */
		(function(_){
			const bindings = [
				'onCropChange',
				'onInputChange',
				'onImageLoaded',
				'onComplete',
				'verifyFiles',
				'onFinishEditingClick',
				'showPopup',
				'onCancelEditingClick',
				'tryFetch',
				'pushToPhotos',
				'onPhotoClick',
				'sendAll',
				'onAspectRatioFixChange',
			];

			bindings.forEach(n => {_[n] = _[n].bind(_);});
		})(this);
	}

	/* ... . .-. --. . / --.. .... ..- .-. .- ...- .-.. . ...- */

	/* aspect */
	onAspectRatioFixChange({ target: { checked } }) {
		this.setState({
			crop: {
				...this.state.crop,
				aspect: checked ? (this.parameters.ratio) : null,
			}
		});
	}

	/* fetch */
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

	/* test */
	async tryFetch() {
			const myHeaders = new Headers();

			myHeaders.append("Content-Type", "json");

			/* const
				options = {
					method: 'POST',
					headers: myHeaders,
					mode: 'cors',
					cache: 'default',
				}; */

			// console.log('crop, ReactCropImageSrc', crop, ReactCropImageSrc);

			const result = await this.fetch();

			return result;
		}

	/* ограничения! */
	verifyFiles = (files) => {
        if (files && files.length > 0){
            const
				currentFile = files[0],
				// currentFileType = currentFile.type,
				shortenFileType = currentFile.type.split('image/')[1],
				currentFileSize = currentFile.size;

            if (currentFileSize > this.imageMaxSize) {
                // `This file is not allowed. ${currentFileSize} bytes is too large`
                return false;
            }

            if (!this.parameters.fileTypes.includes(shortenFileType)){
                // `This file is not allowed. Only images are allowed.`
                return false;
            }

            return true;
        }
    }
	
	/* во время перемещения выделенной области */
	onCropChange(crop) {
		// console.log('crop', crop);
		// console.log('this.state', this.state);
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
			{ state } = this,
			{ target } = e,
			{ /* value, */ files } = target;

			// file = files[0];

		// console.log('files', files);

		if (this.verifyFiles(files)) {
			/* вытыщим base64 картинку и кинем ее в колбэк */
			/* this.getBase64FromFile(file, this.showPopup); */
			const
				rawData = [],
				collectRawData = (base64, index) => {
					rawData.push(base64);

					if (index === files.length - 1) {
						this.setState({
							photos: [...state.photos, ...rawData],
						});

						/* this.pushToPhotos(...rawData); */
					}
				};

			this.getBase64FromFile(Array.from(files), collectRawData);
		}

		// console.log('target, value, files', target, value, files);
	}

	/* 1 фото */
	pushToPhotos(base64) {
		/* newPhoto */
		const newPhoto = { src: base64 };

		this.setState({
			photos: [...this.state.photos, newPhoto],
		});
	}

	/* base64 */
	getBase64FromFile(files, callback) {
		files.forEach((file, index) => {
			const reader = new window.FileReader();

			/* onload */
			reader.onload = e => {
				const base64 = e.target.result;
				
				callback(base64, index);
			};
			
			/* onerror */
			reader.onerror = e => {
				console.error("Файл не может быть прочитан! код " + e.target.error.code);
			};
			
			reader.readAsDataURL(file);
		});
	}

	/* после получения изображения редактором */
	onImageLoaded(image, pixelCrop) {
		/* const
			{ background, } = this.refs,
			{ width, height } = pixelCrop; */

		// console.log('image, pixelCrop', image, pixelCrop);
		
		this.onComplete(null, pixelCrop);
	}

	/* после отпускания области редактирования */
	onComplete(crop, pixelCrop) {
		// console.log('crop, pixelCrop', crop, pixelCrop);
		const
			{ canvas } = this.refs,
			{ ReactCropImageSrc } = this.state;

		image64toCanvasRef(canvas, ReactCropImageSrc, pixelCrop);
	}

	/* отмена редактирования */
	onCancelEditingClick({ type, target: { dataset: { role } }, currentTarget }) {
		const
			cancelClick = role === 'close-click' && type === 'click',
			backgroundDown = role === 'close-down' && type === 'mousedown';

		if (cancelClick || backgroundDown) {
			this.setState({
				showPopup: false,
			});
		}
	}

	/* конец редактированиия одной фотографии */
	onFinishEditingClick(e) {
		const
			{ canvas } = this.refs,
			{ ReactCropImageSrc, photos, editedPhotoIndex } = this.state,
			extension = extractImageFileExtensionFromBase64(ReactCropImageSrc),
			mime = `image/${extension}`,
			canvasData = canvas.toDataURL(mime);

		// const file = dataURItoBlob(canvasData);

		const 
			pre = photos.slice(0, editedPhotoIndex),
			post = photos.slice(editedPhotoIndex + 1);
			
		// newPhoto = { src: canvasData }, //current
		// photos: [...this.state.photos, newPhoto],

		this.setState({
			photos: [...pre, canvasData, ...post],
			showPopup: false,
			crop: {
				...this.cropFull,
				/* фиксация соотношения сторон выделения */
				aspect: this.state.crop.aspect
			},
		});
	}

	/* клик по фото для вызова редактора */
	onPhotoClick(index, e) {
		const
			// { target } = e,
			{ state, showPopup } = this,
			{ photos } = state,
			src = photos[index];
			// { src } = imageStateObj;

		showPopup(src, index);
	}

	/* test */
	sendAll(e) {
		let photosShortStr = '';

		const
			{ state, refs } = this,
			preLen = 30,
			postLen = 20,
			{ output } = refs,
			{ photos } = state;

		photos.forEach(src => {
			const
				pre = src.substring(0, preLen),
				post = src.substring(src.length - postLen, src.length - 1),
				short = `&nbsp&nbsp&nbsp&nbsp${pre}...${post},</br>`;
			
			photosShortStr += short;

			return short;
		});

		const result = `[<br/>${photosShortStr}]`;

		output.innerHTML = result;
	}

	/* ... . .-. --. . / --.. .... ..- .-. .- ...- .-.. . ...- */

	/* test> */
	/* setTimeout(async() => {
			const obj = await this.tryFetch();

			console.log('obj', obj);
		}, 1000); */
	/* <test */

	render() {
		const
			// {  } = this.props,
			{ crop, ReactCropImageSrc, photos, showPopup } = this.state;

		return (
			/* наш компонент */
			<div className="crop">
				{/* шапка */}
				<div className="header">
					<div className="title">Галерея</div>
					<div className="hr"></div>
				</div>
		
				{/* отредактированные фото */}
				<div className="photos">
					{photos.map((src, i) => {
						return (
							<Photo
								src={src}
								key={i}
								onClick={(...all) => this.onPhotoClick(i, ...all)}
							/>
						);
					})}
				</div>

				{/* ввод */}
				<div className="input-outer-wrapper">
					<div className="input-wrapper">
						<input
							accept={this.parameters.acceptMime}
							type="file"
							onChange={this.onInputChange}
							multiple={true}
							className="input-wrapper__input"
						/>
						<div className="input-wrapper__field">
							<div>Перетащите сюда файлы для добавления или нажмите для выбора</div>
						</div>
					</div>
				</div>
				
				{/* popup */}
				<div ref="popup" className={`popup ${showPopup ? 'is-active' : ''}`} data-role='close-down' onMouseDown={this.onCancelEditingClick}>
					<div className="background" ref="background">
						{showPopup && <ReactCrop
							src={ReactCropImageSrc}
							onChange={this.onCropChange}
							crop={crop} 
							onImageLoaded={this.onImageLoaded}
							onComplete={this.onComplete}
							imageStyle={{
								maxHeight: '600px',
								maxWidth: '800px',
								minHeight: '30px',
								minWidth: '30px',
							}}
						/>}
						<div className="wrapper">
							<button ref="finish" className="finish-editing" onClick={this.onFinishEditingClick}>Сохранить</button>
							<button ref="cancel" className="cancel-editing" data-role='close-click' onClick={this.onCancelEditingClick}>Отменить</button>
							<div className="aspect">
								<input type="checkbox" id="aspect-ratio" onChange={this.onAspectRatioFixChange}></input>
								<label htmlFor="aspect-ratio">Фиксированные пропорции</label>
							</div>
						</div>
					</div>
				</div>
				
				{/* canvas - необходимый скрытый элемент */}
				<canvas ref="canvas" style={{display:'none'}} width="0" height="0"></canvas>

				{!!photos.length && <div className="wrapper">
					<button ref="sendAll" className="send" onClick={this.sendAll}>Отправить</button>
				</div>}
				
				<div ref="output" className="output"></div>
			</div>
		);
	}
}

export default Crop;