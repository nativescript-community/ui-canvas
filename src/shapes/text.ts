import { Canvas } from '../canvas';
import { stringProperty } from './shape';
import { Length, PercentLength, zeroLength } from '@nativescript/core/ui/styling/style-properties';
import Rectangle from './rectangle';
import { layout } from '@nativescript/core/ui/core/view';

export default class Text extends Rectangle {
    drawOnCanvas(canvas: Canvas) {
        canvas.drawText(this.text, layout.toDeviceIndependentPixels(Length.toDevicePixels(this.left)), layout.toDeviceIndependentPixels(Length.toDevicePixels(this.top)), this.paint);
    }
    @stringProperty text: string;
}
