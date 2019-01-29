export const
    _console = (text = '', timeout = 2000) => {
        const
            _body = document.body || document.getElementsByTagName('body')[0],
            msg = document.createElement('div');
            
        /* styles> */
        const styles = {
                position: 'absolute',
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                'background-color': 'rgba(0, 0, 0, 0.5)',
                'z-index': 999999,
                color: '#fff',
            };

        for (const [key, val] of Object.entries(styles)) {
            msg.style[key] = val;
        }
        /* <styles */

        msg.textContent = text;
        const node = _body.appendChild(msg);

        setTimeout(() => {
            node.remove();
        }, timeout);
    },
    downloadBase64File = (base64Data, filename) => {
        const element = document.createElement('a');

        element.setAttribute('href', base64Data);
        element.setAttribute('download', filename);

        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    },
    base64StringtoFile = (base64String, filename) => {
        const
            arr = base64String.split(','),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]);

            let n = bstr.length, u8arr = new Uint8Array(n);

        while(n--){
            u8arr[n] = bstr.charCodeAt(n);
        }

        return new File([u8arr], filename, {type:mime});
    },
    extractImageFileExtensionFromBase64 = (base64Data) => {
        return base64Data.substring("data:image/".length, base64Data.indexOf(";base64"))
    },
    image64toCanvasRef = (canvasRef, image64, pixelCrop) => {
        const canvas = canvasRef // document.createElement('canvas');

        canvas.width = pixelCrop.width;
        canvas.height = pixelCrop.height;

        const
            ctx = canvas.getContext('2d'),
            image = new Image();
        
        image.src = image64;
        image.onload = () => {
            ctx.drawImage(
                image,
                pixelCrop.x,
                pixelCrop.y,
                pixelCrop.width,
                pixelCrop.height,
                0,
                0,
                pixelCrop.width,
                pixelCrop.height
            )
        }
    },
    /* base64/URLEncoded => raw binary data string */
	dataURItoBlob = dataURI => {
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
	},
    parseFileTypeToString = file => {
		const {
			name,
			lastModified,
			lastModifiedDate,
			webkitRelativePath,
			size,
		} = file,
		result = `name: ${name}, lastModified: ${lastModified}, lastModifiedDate: ${lastModifiedDate}, webkitRelativePath: ${webkitRelativePath}, size: ${size}, `;

		return result;
	},
    makeFormData = () => {
		/* FD> */
		// const fd = new FormData();
		
		// /*file = downloadBase64File(canvasData, fileName); 
		// console.log('file', file);
		// */
		
		// fd.append('file', file);
		// /* check FD to screen */
		// const
		// 	fileFromFd = fd.get('file'),
		// 	str = parseFileTypeToString(fileFromFd);

		// _console(str);
		/* <FD */
	};