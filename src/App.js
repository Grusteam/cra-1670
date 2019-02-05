import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import _ from 'lodash';

const EasingFunctions = {
  // no easing, no acceleration
  linear: function (t) { return t },
  // accelerating from zero velocity
  easeInQuad: function (t) { return t*t },
  // decelerating to zero velocity
  easeOutQuad: function (t) { return t*(2-t) },
  // acceleration until halfway, then deceleration
  easeInOutQuad: function (t) { return t<.5 ? 2*t*t : -1+(4-2*t)*t },
  // accelerating from zero velocity 
  easeInCubic: function (t) { return t*t*t },
  // decelerating to zero velocity 
  easeOutCubic: function (t) { return (--t)*t*t+1 },
  // acceleration until halfway, then deceleration 
  easeInOutCubic: function (t) { return t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1 },
  // accelerating from zero velocity 
  easeInQuart: function (t) { return t*t*t*t },
  // decelerating to zero velocity 
  easeOutQuart: function (t) { return 1-(--t)*t*t*t },
  // acceleration until halfway, then deceleration
  easeInOutQuart: function (t) { return t<.5 ? 8*t*t*t*t : 1-8*(--t)*t*t*t },
  // accelerating from zero velocity
  easeInQuint: function (t) { return t*t*t*t*t },
  // decelerating to zero velocity
  easeOutQuint: function (t) { return 1+(--t)*t*t*t*t },
  // acceleration until halfway, then deceleration 
  easeInOutQuint: function (t) { return t<.5 ? 16*t*t*t*t*t : 1+16*(--t)*t*t*t*t }
}

class App extends Component {
	constructor() {
		super();

		this.smoothValue = 0;

		this.speedBoundaries = [0.1, 16];

		/* this */
		this.catchWindowScroll = this.catchWindowScroll.bind(this);
		this.step = this.step.bind(this);
		this.setVideoPosition = this.setVideoPosition.bind(this);
		this.setVideoRate = this.setVideoRate.bind(this);
	}

	componentDidMount() {
		const { video } = this.refs;


		video.addEventListener('loadeddata', (e) => {
			this.videoLength = video.duration;
			this.frame = requestAnimationFrame(this.step);
			window.addEventListener('scroll', _.throttle(this.catchWindowScroll, 40));
		});
	}

	step(timestamp) {
		const
			{ scrollY, innerHeight, scrollHeight } = window,
			realPercent = scrollY / innerHeight * 100,
			scrollH = document.documentElement.scrollHeight,
			scrollPercent = scrollY / (scrollH - innerHeight) * 100;
		

		if (this.frame === 1) {
			this.smoothValue = scrollPercent;
		} else {
			this.smoothValue = this.smoothing(scrollPercent);
		}

		this.videoSeconds = this.smoothValue * this.videoLength / 100;

		const
			testSpeed = this.smoothValue === 0 
				? this.speedBoundaries[0]
				: this.smoothValue / 100 * this.speedBoundaries[1];

			// normalSpeed = this.smoothValue / 50,
			// normalizedRate = normalSpeed >= 0.1 && normalSpeed <= 20 ? normalSpeed : normalSpeed < 0.1 ? 0.1 : 20;
		
		this.setVideoRate(testSpeed);

		console.log('this.smoothValue', this.smoothValue);
		console.log('testSpeed', testSpeed);
		// console.log('this.videoLength', this.videoLength);
		// console.log('this.frame', this.frame);


		/* set video position */
		// this.setVideoPosition();
	}

	setVideoPosition(s = this.videoSeconds) {
		const { video } = this.refs;
		video.currentTime = s;
	}

	setVideoRate(r = this.videoRate) {
		const
			{ video } = this.refs,
			normalized = r >= 20 ? 16 : r < 0.1 ? 0.1 : r;

		video.playbackRate = normalized;

		console.log('video.playbackRate', video.playbackRate);
	}

	smoothing(percent = 0) {
		return percent;
	}

	catchWindowScroll(e) {
		/* reassign-loop */
		this.frame = requestAnimationFrame(this.step);
	}

	render() {
		return <div className="App" >
			<div className="video">
				<video ref='video' autoPlay={true} src={'./video.mp4'}>
				</video>
			</div>
		</div>	;
	}
}

export default App;
