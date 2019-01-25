import React, { Component } from 'react';
import './Photo.css';

class Photo extends Component {
	constructor(props) {
		super();

		// const {  } = props;


		/* this */
		this.onDelete = this.onDelete.bind(this);
		this.onMoveToList = this.onMoveToList.bind(this);
	}

	
	onMoveToList(Photo) {
        console.log('onMoveToList');
	}
	
	onDelete(Photo) {
        console.log('onDelete');
	}

	render() {
		const { image: { src }, onClick } = this.props;

		return (
			<div className="photo">
				<img className="image" src={src} onClick={onClick} alt=''/>
				{/* <button className="btn btn--move" onClick={this.onMoveToList}>Move</button> */}
				{/* <button className="btn btn--del" onClick={this.onDelete}>Del</button> */}
			</div>
		);
	}
}

export default Photo;