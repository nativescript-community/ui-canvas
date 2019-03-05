const TWEEN = require('@tweenjs/tween.js');
export { Easing } from '@tweenjs/tween.js';

const TweenUpdate = TWEEN.update;

export class Animation extends TWEEN.Tween {
    constructor(obj) {
        super(obj);
        this['_onCompleteCallback'] = function() {
            cancelAnimationFrame();
        };
    }
    start(time?: number) {
        startAnimationFrame();
        return super.start(time);
    }
}

let animationFrameRunning = false;
const cancelAnimationFrame = function() {
    runningTweens--;
    if (animationFrameRunning && runningTweens === 0) {
        animationFrameRunning = false;
    }
};

let runningTweens = 0;
const startAnimationFrame = function() {
    runningTweens++;
    if (!animationFrameRunning) {
        animationFrameRunning = true;
        tAnimate();
    }
};
//////////////////////////
// requestAnimationFrame polyill
let lastTime = 0;

const requestAnimationFrame = function(callback) {
    const currTime = new Date().getTime();
    const timeToCall = Math.max(0, 16 - (currTime - lastTime));
    const id = setTimeout(function() {
        callback(currTime + timeToCall);
    }, timeToCall);
    lastTime = currTime + timeToCall;
    return id;
};
//////////////////////////

function tAnimate() {
    if (animationFrameRunning) {
        requestAnimationFrame(tAnimate);
        TWEEN.update();
    }
}
