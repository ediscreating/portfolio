import {Bounce, Power3} from 'gsap/EasePack';

const animationInfo = {
  topnav: {
    treshold: 0,
    showTweenInfo: {
      duration: 0.3,
      from: { opacity: 0, y: "-100%" }, to: { opacity: 1, y: '0%', paused: true }
    },
    hideTweenInfo: {
      duration: 0.5,
      to: { y: '-100%' }
    }
  },
  skillsoverview: {
    treshold: 0.5,
    showTweenInfo: {
      duration: 0.6,
      from: { opacity: 0, scale: 1.5 }, to: { opacity: 1, scale: 1, paused: true, ease: Power3.easeOut }
    },
    hideTweenInfo: {
      duration: 0.5,
      to: { y: '-100%', opacity: 0, ease: 'Power3.easeIn' }
    }
  },
  skillslist: {
    treshold: 0,
    showTweenInfo: {
      duration: 1,
      from: { scale: 0, transformOrigin: 'center center' }, to: { scale: 1, paused: true, ease: Power3.easeOut }
    },
    hideTweenInfo: {
      duration: 0.5,
      to: { x: '100%', opacity: 0 }
    }
  },
  skilllevel: {
    treshold: 0.6,
    showTweenInfo: {
      duration: 0.6,
      from: { scaleX: 0, transformOrigin: '0 center' }, to: {  scaleX: 1, paused: true, ease: Bounce.easeOut }
    }
  },
  skillname: {
    treshold: 0.6,
    showTweenInfo: {
      duration: 0.3,
      from: { opacity: 0, y: "-100%" }, to: { opacity: 1, y: '0%', paused: true }
    }
  },
  skillinfo: {
    treshold: 0.4,
    showTweenInfo: {
      duration: 0.3,
      from: { opacity: 0, y: "100%" }, to: { opacity: 1, y: '0%', paused: true }
    }
  },
  skillsoverviewbg: {
    treshold: 0,
    showTweenInfo: {
      duration: 0.5,
      from: { opacity: 0, x: "-100%" }, to: { opacity: 1, x: '0%', paused: true }
    },
    hideTweenInfo: {
      duration: 0.5,
      to: { x: '-100%', ease: Power3.easeIn }
    }
  }
};

export default animationInfo;
