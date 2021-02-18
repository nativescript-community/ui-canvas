import { PercentLength } from '@nativescript/core/ui/styling/style-properties';
import { layout } from '@nativescript/core/utils/utils';
import { Canvas } from '../canvas';
import Rectangle from './rectangle';
import { stringProperty } from './shape';

export default class Text extends Rectangle {
    drawOnCanvas(canvas: Canvas) {
        canvas.drawText(this.text, layout.toDeviceIndependentPixels(PercentLength.toDevicePixels(this.left)), layout.toDeviceIndependentPixels(PercentLength.toDevicePixels(this.top)), this.paint);
    }
    @stringProperty text: string;
}
