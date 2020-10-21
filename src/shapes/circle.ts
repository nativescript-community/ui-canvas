import { PercentLength, Utils } from '@nativescript/core';
import { Canvas } from '../canvas';
import Rectangle from './rectangle';
import { percentLengthProperty } from './shape';

export default class Circle extends Rectangle {
    drawOnCanvas(canvas: Canvas) {
        const availableWidth = Utils.layout.toDevicePixels(canvas.getWidth());
        const availableHeight = Utils.layout.toDevicePixels(canvas.getHeight());

        canvas.drawCircle(Utils.layout.toDeviceIndependentPixels(PercentLength.toDevicePixels(this.left, 0, availableWidth)),
            Utils.layout.toDeviceIndependentPixels(PercentLength.toDevicePixels(this.top, 0, availableHeight)), Utils.layout.toDeviceIndependentPixels(PercentLength.toDevicePixels(this.radius, 0, availableWidth)), this.paint);
    }
    @percentLengthProperty radius: PercentLength = 0;
}
