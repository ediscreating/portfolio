import TweenLite from 'gsap/TweenLite';
import 'gsap/CSSPlugin.js';
import TimelineLite from 'gsap/TimelineLite';
import {Elastic, Power3} from 'gsap/EasePack';

let showTl = null;
let hideTl = null;

const MainPage = {
  init() {
    showTl = new TimelineLite({paused: true});
    hideTl = new TimelineLite({paused: true});

    const intro = document.getElementsByClassName('js-intro')[0];
    const introElements = Array.from(document.querySelectorAll('.js-intro-element'));
    const images = document.getElementsByClassName('js-mainpage-img');
    const stripes = document.getElementsByClassName('js-stripe-anim');
    const circles = getSVGChildren(document.getElementsByClassName('js-anim-circles')[0]);

    hideTl.staggerTo(images, 0.3, { scale: 0, ease: Elastic.easeIn });
    hideTl.staggerTo(circles, 0.3, { scale: 0, ease: Elastic.easeIn });
    hideTl.staggerTo(stripes, 0.3, { scale: 0, ease: Elastic.easeIn });
    hideTl.to(intro, 2, { skewX: 360, scale: 0, transformOrigin: 'center top', ease: Elastic.easeInOut });

    showTl.fromTo(images[0], 0.3, { opacity: 0, x: "-100%" }, { opacity: 1, x: '0%' });
    showTl.fromTo(images[1], 0.3, { opacity: 0, x: "100%" }, { opacity: 1, x: '0%' }, '-=0.3');
    showTl.staggerFromTo(introElements, 0.5, { scale: 1.5, opacity: 0 }, { scale: 1, opacity: 1, ease: Power3.easeIn }, 0.5);
    showTl.fromTo(stripes[0],  0.3, { scale: 0, transformOrigin: 'right center' }, { scale: 1, ease: Elastic.easeOut });
    showTl.fromTo(stripes[1],  0.3, { scale: 0, transformOrigin: 'left center' }, { scale: 1, ease: Elastic.easeOut }, '-=0.3');
    showTl.staggerFromTo(circles, 0.3, { scale: 0 }, { scale: 1, ease: Elastic.easeOut });
  },

  open() {
    hideTl.pause(0, true);
    showTl.pause(0, true);
  },

  show() {
    return new Promise(resolve => {
      if (hideTl.isActive()) {
        hideTl.eventCallback('onReverseComplete', () => {
          resolve();
          hideTl.eventCallback('onReverseComplete', null);
        });
        hideTl.reverse();
      } else {
        showTl.eventCallback('onComplete', () => {
          resolve();
          showTl.eventCallback('onComplete', null);
        });
        showTl.play();
      }
    });
  },

  hide() {
    return new Promise(resolve => {
      if (showTl.isActive()) {
        showTl.eventCallback('onReverseComplete', () => {
          resolve();
          showTl.eventCallback('onReverseComplete', null);
        });
        showTl.reverse();
      } else {
        hideTl.eventCallback('onComplete', () => {
          resolve();
          hideTl.eventCallback('onComplete', null);
        });
        hideTl.play();
      }
    });
  },

  close() {}
};

function getSVGChildren(svg) {
  if (svg.children) return svg.children;
  return Array.from(svg.childNodes).filter(child => child instanceof SVGElement);
}

export default MainPage;
