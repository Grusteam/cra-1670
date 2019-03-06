import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import _ from 'lodash';
import VideoFrame from "./VideoFrame";

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

		this.frame = 0;
		this.callCount = 0;
		this.frameRateDivider = 1;

		/* this */
		this.catchWindowScroll = this.catchWindowScroll.bind(this);
		this.step = this.step.bind(this);
		this.setVideoPosition = this.setVideoPosition.bind(this);
		this.setVideoRate = this.setVideoRate.bind(this);
		this.intervalSteps = this.intervalSteps.bind(this);
		this.reduceVideoPositionToExistingFrame = this.reduceVideoPositionToExistingFrame.bind(this);
		this.basicMeasures = this.basicMeasures.bind(this);
		this.onVideoReady = this.onVideoReady.bind(this);
		this.intervalIt = this.intervalIt.bind(this);
		this.permanentSetVideoPosition = this.permanentSetVideoPosition.bind(this);
		this.RAF = this.RAF.bind(this);
		this.initPosition = this.initPosition.bind(this);
		this.setVideoSize = this.setVideoSize.bind(this);
	}

	componentDidMount() {
		const { video } = this.refs;

		// this.setVideoSize();

		video.addEventListener('loadeddata', this.onVideoReady);
	}

	initPosition() {
		const
			{ refs } = this,
			{ video } = refs,
			{ scrollY, innerHeight, scrollHeight } = window,
			realPercent = scrollY / innerHeight * 100,
			scrollH = document.documentElement.scrollHeight,
			scrollPercent = scrollY / (scrollH - innerHeight) * 100,
			{ currentTime } = video;


		this.videoSeconds = scrollPercent / 100;
		this.prevPosition = this.videoSeconds;
	}

	setVideoSize() {
		const
			{ video } = this.refs,
			{ innerWidth, innerHeight } = window;

		video.setAttribute('width', innerWidth);
		/* video.setAttribute('height', innerHeight); */
	}

	onVideoReady(e) {
		const
			{ video } = this.refs,
			{ dataset, src } = video,
			{ fps } = Object.assign({}, dataset);


		this.videoLength = video.duration;
		this.FPS = +fps;


		this.framesCount = this.videoLength * this.FPS; 
		this.frameStep = 1 / this.FPS;

		this.playbackDelay = 1000 / this.FPS / this.frameRateDivider;

		console.log('this.FPS', this.FPS);
		console.log('this.playbackDelay', this.playbackDelay);
		console.log('this.frameStep', this.frameStep);

		/* this.V = new VideoFrame({
			id: 'video',
			frameRate: this.FPS,
			callback: function(response) {
				console.log(response);
			}
		}) */

		this.initPosition();
		this.RAF();

		// this.intervalIt();

		// this.magiHack(video);

		// window.addEventListener('scroll', _.throttle(this.catchWindowScroll, this.playbackDelay));
		window.addEventListener('scroll', this.catchWindowScroll);

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

		/* if (this.frame === 1) {
			this.smoothValue = scrollPercent;
		} else {
			this.smoothValue = this.smoothing(scrollPercent);
		} */

		// this.videoSeconds = this.smoothValue * this.videoLength / 100;
		this.videoSeconds = scrollPercent / 100;

		// console.log('this.videoSeconds', this.videoSeconds);

		// const
		// 	diffSeconds = currentTime - this.videoSeconds,
		// 	diffPercent = diffSeconds / this.videoLength,
		// 	testSpeed = this.smoothValue === 0 
		// 		? this.speedBoundaries[0]
		// 		: this.smoothValue / 100 * this.speedBoundaries[1],
		// 	speedCoefficient = diffPercent * this.speedBoundaries[1];

		// const framePos = this.reduceVideoPositionToExistingFrame();

		// console.log('framePos', framePos);

		// console.log('timestamp', timestamp);
		// console.log('this.videoSeconds', this.videoSeconds);

		/* reassign-loop */
		// this.frame = requestAnimationFrame(this.step);
		
		// const frameSecond = this.frame * 1/60;

		// this.setVideoPosition(frameSecond);

		// console.log('this.frame', this.frame);
		// console.log('frameSecond', frameSecond);

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
			{ V } = this,
			frame = V.get(),
			SMPTE = V.toSMPTE();

		const
			{ framesCount, videoLength, FPS, frameStep } = this,
			regardlessFrameRaw = FPS * s,
			regardlessFrame = Math.floor(regardlessFrameRaw),
			frameSeconds = regardlessFrame * frameStep;

		// console.log('s', s);
		// console.log('regardlessFrameRaw, regardlessFrame, frameSeconds', regardlessFrameRaw, regardlessFrame, frameSeconds);

		return regardlessFrame;
		// return frameSeconds;

		// console.log('regardlessFrame', regardlessFrame);
		// console.log('regardlessFrameRaw', regardlessFrameRaw);
	}

	setVideoPosition(s = this.videoSeconds) {
		// console.log('s', s);
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

		/* const
			{ V } = this,
			frame = V.get(),
			SMPTE = V.toSMPTE(); */

		// console.log('SMPTE', SMPTE);


		const
			{ reduceVideoPositionToExistingFrame, basicMeasures } = this,
			{ scrollPercent } = basicMeasures();
		
		// console.log('scrollPercent', scrollPercent);

		// this.callCount++;
		this.videoSeconds = scrollPercent * this.videoLength / 100 + 0.00001;

		/* const
			{ V } = this,
			frame = V.get(),
			seekFrame = reduceVideoPositionToExistingFrame(this.videoSeconds),
			SMPTE = V.toSMPTE(seekFrame); */

		// console.log('seekFrame', seekFrame);
		// console.log('SMPTE', SMPTE);


		/* set video position */
		// this.setVideoPosition();





		// console.log('SMPTE', SMPTE);

		// V.toFrames(SMPTE);

		/* set video position */
		// console.log('this.callCount', this.callCount);
		// console.log('this.videoSeconds', this.videoSeconds);
		// this.setVideoPosition(frameSeconds);

		// return this.videoSeconds;


		/* reassign-loop */
		// this.frame = requestAnimationFrame(this.step);
	}

	intervalIt(delay = this.playbackDelay) {
		const
			{ V } = this;

		setInterval(() => {
		const
			frame = V.get(),
			SMPTE = V.toSMPTE();

			V.seekForward(1);
			// console.log('frame', frame);
			console.log('SMPTE', SMPTE);
		}, delay);
	}

	RAF() {
		window.requestAnimationFrame(this.permanentSetVideoPosition);
	}

	permanentSetVideoPosition(timestamp){
		if (this.prevPosition !== this.videoSeconds) {
			this.setVideoPosition();
		}

		this.prevPosition = this.videoSeconds;
		window.requestAnimationFrame(this.permanentSetVideoPosition);
	}
	

	magiHack(vid) {
		// pause video on load
		vid.pause();
		
		// pause video on document scroll (stops autoplay once scroll started)
		window.onscroll = function(){
			vid.pause();
		};

		// refresh video frames on interval for smoother playback
		setInterval(function(){
			vid.currentTime = window.pageYOffset/280;
		}, 40);
	}

	render() {
		console.log('render');
		return <div className="App" >
			<div className="video-wrapper">
				<video
					preload="auto"
					id='video'
					ref='video'
					autoPlay={false}
					data-fps='30'
					src={'./720_30_1000_h264.mp4'}
					controls="true"
					/* src={'./1080_30_1000_h264.mp4'} */
					/* src={'./720_25_800_h264.mp4'} */
				/>
			</div>
		</div>	;
	}
}

export default App;
