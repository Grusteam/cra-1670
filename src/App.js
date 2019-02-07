import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import _ from 'lodash';
import VideoFrame from "./VideoFrame";

console.log('VideoFrame', VideoFrame);

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

		this.FPS = 25;
		this.frame = 0;
		this.callCount = 0;
		

		/* this */
		this.catchWindowScroll = this.catchWindowScroll.bind(this);
		this.step = this.step.bind(this);
		this.setVideoPosition = this.setVideoPosition.bind(this);
		this.setVideoRate = this.setVideoRate.bind(this);
		this.intervalSteps = this.intervalSteps.bind(this);
		this.reduceVideoPositionToExistingFrame = this.reduceVideoPositionToExistingFrame.bind(this);
		this.basicMeasures = this.basicMeasures.bind(this);
		this.onVideoReady = this.onVideoReady.bind(this);
	}

	componentDidMount() {
		const { video } = this.refs;

		video.addEventListener('loadeddata', this.onVideoReady);
	}

	onVideoReady(e) {
		const { video } = this.refs;

		this.videoLength = video.duration;


		this.framesCount = this.videoLength * this.FPS; 
		this.frameStep = 1 / this.FPS;

		this.playbackFPS = 20;
		this.playbackDelay = 1000 / this.playbackFPS;

		this.V = new VideoFrame({
			id: 'video',
			frameRate: 25,
			callback: function(response) {
				console.log(response);
			}
		})


		window.addEventListener('scroll', _.throttle(this.catchWindowScroll, this.playbackDelay));
		// window.addEventListener('scroll', _.throttle(this.catchWindowScroll, this.frameStep));
		// window.addEventListener('scroll', this.catchWindowScroll);

		// this.frame = requestAnimationFrame(this.step);
		// this.intervalSteps(this.frameStep);
		// console.log('this.frameStep', this.frameStep);
	}

	intervalSteps(frameStep) {
		setInterval(() => {
			this.frame++;

			const sec = frameStep * this.frame;

			console.log('this.frame', this.frame);
			console.log('sec', sec);


			this.setVideoPosition(sec);
		}, 1000 / this.FPS);
	}

	basicMeasures() {
		const
			{ refs } = this,
			{ video } = refs,
			{ scrollY, innerHeight, scrollHeight } = window,
			realPercent = scrollY / innerHeight * 100,
			scrollH = document.documentElement.scrollHeight,
			scrollPercent = scrollY / (scrollH - innerHeight) * 100,
			{ currentTime } = video;

		return {
			scrollPercent
		};
	}

	step(timestamp) {
		const
			{ refs } = this,
			{ video } = refs,
			{ scrollY, innerHeight, scrollHeight } = window,
			realPercent = scrollY / innerHeight * 100,
			scrollH = document.documentElement.scrollHeight,
			scrollPercent = scrollY / (scrollH - innerHeight) * 100,
			{ currentTime } = video;

		if (this.frame === 1) {
			this.smoothValue = scrollPercent;
		} else {
			this.smoothValue = this.smoothing(scrollPercent);
		}

		this.videoSeconds = this.smoothValue * this.videoLength / 100;

		const
			diffSeconds = currentTime - this.videoSeconds,
			diffPercent = diffSeconds / this.videoLength,
			testSpeed = this.smoothValue === 0 
				? this.speedBoundaries[0]
				: this.smoothValue / 100 * this.speedBoundaries[1],
			speedCoefficient = diffPercent * this.speedBoundaries[1];

		const framePos = this.reduceVideoPositionToExistingFrame();

		console.log('framePos', framePos);

		// console.log('this.videoSeconds', this.videoSeconds);

			// normalSpeed = this.smoothValue / 50,
			// normalizedRate = normalSpeed >= 0.1 && normalSpeed <= 20 ? normalSpeed : normalSpeed < 0.1 ? 0.1 : 20;
		
		// this.setVideoRate(speedCoefficient);

		// console.log('diffPercent', diffPercent);
		// console.log('currentTime', currentTime);
		// console.log('speedCoefficient', speedCoefficient);
		// console.log('this.smoothValue', this.smoothValue);
		// console.log('testSpeed', testSpeed);
		// console.log('this.videoLength', this.videoLength);
		// console.log('this.frame', this.frame);


		/* set video position */
		// this.setVideoPosition();
	}

	reduceVideoPositionToExistingFrame(s = this.videoSeconds) {
		const
			{ framesCount, videoLength, FPS, frameStep } = this,
			regardlessFrameRaw = FPS * s,
			regardlessFrame = Math.floor(regardlessFrameRaw),
			frameSeconds = regardlessFrame * frameStep;

		return frameSeconds;

		// console.log('s', s);
		// console.log('regardlessFrame', regardlessFrame);
		// console.log('regardlessFrameRaw', regardlessFrameRaw);
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

		const
			{ V } = this,
			frame = V.get(),
			SMPTE = V.toSMPTE();

		// console.log('SMPTE', SMPTE);
		// console.log('frame', frame);

		V.seekForward(1, console.log);

		/* const
			{ reduceVideoPositionToExistingFrame, basicMeasures } = this,
			{ scrollPercent } = basicMeasures();
		
		this.callCount++;

		this.videoSeconds = scrollPercent * this.videoLength / 100;
		const frameSeconds = reduceVideoPositionToExistingFrame(this.videoSeconds); */

		/* set video position */
		// console.log('this.callCount', this.callCount);
		// console.log('this.videoSeconds', this.videoSeconds);
		// this.setVideoPosition(frameSeconds);

		// return this.videoSeconds;
		// console.log('scrollPercent', scrollPercent);


		/* reassign-loop */
		// this.frame = requestAnimationFrame(this.step);
	}

	render() {
		return <div className="App" >
			<div className="video">
				<video id='video' ref='video' autoPlay={false} src={'./25fps.mp4'}>
				</video>
			</div>
		</div>	;
	}
}

export default App;
