export const
	/* query selector */
	dqsa = (s, container = document) => {
		let result = [];

		try {
			result = Array.from(container.querySelectorAll(s));
		} catch (error) {
			console.log('dqsa error', error,);
			console.log('s, container', s, container);
		}

		return result;
	},
	dqsa0 = (s, childsFilter = false) => {
		const
			all = dqsa(s),
			first = all[0];

		if (childsFilter) {
			const filterNodes = (nodes) => {
				// console.log('nodes', nodes);
				return nodes.filter(node => {
					return (node.tagName && node.tagName.toLowerCase() === childsFilter.toLowerCase());
				})
			};

			const
				childs = first.childNodes,
				childsArr = Array.from(first.childNodes),
				filteredNodes = filterNodes(childsArr);

			return filteredNodes;
		}

		return first;
	},
	getBoundingClientRect = element => {
		const rect = element.getBoundingClientRect();
		
		return {
			top: rect.top,
			right: rect.right,
			bottom: rect.bottom,
			left: rect.left,
			width: rect.width,
			height: rect.height,
			x: rect.x,
			y: rect.y
		};
	},
	_console = (text = '', time = 0) => {
		const
			div = document.createElement('div'),
			body = dqsa0('body'),
			styles = {
				position: 'fixed',
				top: 0,
				left: 0,
				width: '100%',
				height: 'auto',
				zIndex: 99999,
				backgroundColor: 'rgba(0, 0, 0, 0.3)'
			};
		
		/*text*/
		div.innerHTML = `${text}`;
			
		for (const [key, value] of Object.entries(styles)) {
			div.style[key] = value;
		}
			
		const
			inserted = body.appendChild(div);
		
		if (time > 0) {
			setTimeout(
				() => {
					inserted.remove();
				},
				time
			);
		}
	},
	utils = {
		dqsa,
		dqsa0,
		getBoundingClientRect,
		_console,
	};

export default utils;
