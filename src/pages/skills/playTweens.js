const timelines = [];
let playing = false;

function playTweens(tweens) {
  const tl = getTimelineWithTweens(tweens);

  if (playing) timelines[timelines.length - 1].pause();

  timelines.push(tl);

  playTL(tl, handleComplete);
}

function handleComplete() {
  timelines.pop();
  const next = timelines[timelines.length - 1];
  if (next) playTL(next, handleComplete);
}

function getTimelineWithTweens(tweens) {
  let tl = new TimelineLite({ paused: true });

  for (let i = 0; i < tweens.length; i++) {
    tl.add(tweens[i].paused(false));
  }

  return tl;
}

function playTL(tl, onComplete) {
  tl.eventCallback('onComplete', () => {
    playing = false;
    onComplete();
  });

  tl.play();

  playing = true;
}


export default playTweens;
