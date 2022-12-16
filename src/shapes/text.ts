import { PercentLength, Utils } from '@nativescript/core';
import { Canvas } from '../canvas';
import Rectangle from './rectangle';
import { stringProperty } from './shape';

export default class Text extends Rectangle {
    drawOnCanvas(canvas: Canvas) {
        const availableWidth = Utils.layout.toDevicePixels(canvas.getWidth());
        const availableHeight = Utils.layout.toDevicePixels(canvas.getHeight());
        canvas.drawText(
            this.text,
            Utils.layout.toDeviceIndependentPixels(PercentLength.toDevicePixels(this.left, 0, availableWidth)),
            Utils.layout.toDeviceIndependentPixels(PercentLength.toDevicePixels(this.top, 0, availableHeight)),
            this.paint
        );
    }
    @stringProperty text: string;
}
