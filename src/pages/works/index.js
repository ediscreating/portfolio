import picturefill from './picturefill.js';
import TweenLite from 'gsap/TweenLite';
import TimelineLite from 'gsap/TimelineLite';
import 'gsap/CSSPlugin.js';

const tl = new TimelineLite({ paused: true });

const Works = {
  init() {
    picturefill();

    const worksTopNav = document.getElementsByClassName('js-works-top-nav')[0];
    const workHeading = document.getElementsByClassName('js-work-heading')[0];
    const workImg = document.getElementsByClassName('js-work-img')[0];
    const workDesc = document.getElementsByClassName('js-work-description')[0];
    const whiteCol = document.getElementsByClassName('js-white-col')[0];

    tl.fromTo(worksTopNav, 0.3, { y: '-100%', opacity: 0 }, { y: '0%', opacity: 1 });
    tl.fromTo(workHeading, 0.4, { x: '-100%', opacity: 0 }, { x: '0%', opacity: 1 });
    if (workDesc) tl.fromTo(workDesc, 0.4, { x: '100%', opacity: 0 }, { x: '0%', opacity: 1 });
    tl.fromTo([workImg, whiteCol], 0.4, { x: '100%' }, { x: '0%' });
  },
  open() {
    tl.pause(0, true);
  },
  show() {
    return new Promise(resolve => {
      tl.reversed(false);
      tl.eventCallback('onComplete', resolve);
      tl.play();
    });
  },
  hide() {
    return new Promise(resolve => {
      tl.eventCallback('onReverseComplete', resolve);
      tl.reverse();
    });
  },
  close() {}
};

export default Works;
