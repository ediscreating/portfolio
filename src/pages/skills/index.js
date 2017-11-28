import './css/';
import TweenLite from 'gsap/TweenLite';
import TimelineLite from 'gsap/TimelineLite';
import 'gsap/CSSPlugin.js';
import inView from './inView';
import playTweens from './playTweens';
import animationInfo from './animationInfo';
import {
  getAnimLabelFromClass,
  getAnimPositionFromClass,
  sortElementsByAnimPosition,
  createTween
}  from './animUtils';

const tl = new TimelineLite({ paused: true });
const closeTL = new TimelineLite({ paused: true });

let tweens = [];

const Skills = {
  init() {
    const elements = Array.prototype.slice.call(document.querySelectorAll('[class*="js-animate"]'));

    let label;
    elements.forEach(element => {
      label = getAnimLabelFromClass(element.className);
      tweens.push(createTween(element, animationInfo[label].showTweenInfo));
    });

    inView.init(addTresholds(elements), handleEnterView);
  },
  open() {
    const sortedVisible = sortElementsByAnimPosition(inView.getVisible());

    for (let i = 0; i < sortedVisible.length; i++) {
      for (let j = 0; j < tweens.length; j++) {
        if (sortedVisible[i] === tweens[j].target) {
          tl.add(tweens[j].paused(false));
          tweens[j].target.isAnimatedOnOpen = true;
          break;
        }
      }
    }

    inView.start();
  },
  show() {
    if (closeTL.isActive()) {
      closeTL.reverse();
      closeTL.eventCallback('onReverseComplete', () => {
        if (tl.paused()) tl.play();
      });
    } else {
      tl.play();
    }
  },
  hide() {
    return new Promise(resolve => {
      if (tl.isActive()) tl.pause();

      closeTL.clear();

      let label;

      inView.getVisible().forEach(el => {
        label = getAnimLabelFromClass(el.className);
        if (animationInfo[label].hideTweenInfo) closeTL.add(createTween(el, animationInfo[label].hideTweenInfo));
      });

      closeTL.reversed(false);

      closeTL.eventCallback('onComplete', () => {
        resolve();
        closeTL.eventCallback('onComplete', null);
      });
      closeTL.play();
    });
  },
  close() {
    inView.stop();

    for (let i = 0; i < tweens.length; i++) {
      tl.remove(tweens[i]);
      tweens[i].target.isAnimatedOnOpen = false;
      tweens[i].target.isAnimatedOnScroll = false;
      tweens[i].pause(0, true);
    }

    tl.pause(0, true);
    closeTL.pause(0, true);
  }
};

function addTresholds(elements) {
  let label = undefined;
  return elements.map((el, i) => {
    label = getAnimLabelFromClass(el.className);
    return [el, animationInfo[label].treshold];
  });
}

function handleEnterView(elements) {
  let tween;
  let tweensToPlay = [];

  sortElementsByAnimPosition(elements).forEach(el => {
    if (el.isAnimatedOnOpen || el.isAnimatedOnScroll) {
      if (el.className.indexOf('skill__name') !== -1) {
        TweenLite.fromTo(el, 1.5, { rotation: 0 }, { rotation: 360, ease: 'Elastic.easeOut' });
      }
    } else if ((tween = TweenLite.getTweensOf(el)[0]) && !el.isAnimatedOnOpen) {
      tweensToPlay.push(tween);
      el.isAnimatedOnScroll = true;
    }
  });

  if (tweensToPlay.length > 0) playTweens(tweensToPlay);
}

export default Skills;
