import { PercentLength } from '@nativescript/core/ui/styling/style-properties';
import { layout } from '@nativescript/core/utils/utils';
import { Canvas } from '../canvas';
import Rectangle from './rectangle';
import { stringProperty } from './shape';

export default class Text extends Rectangle {
    drawOnCanvas(canvas: Canvas) {
        const availableWidth = layout.toDevicePixels(canvas.getWidth());
        const availableHeight = layout.toDevicePixels(canvas.getHeight());
        canvas.drawText(
            this.text,
            layout.toDeviceIndependentPixels(PercentLength.toDevicePixels(this.left, 0, availableWidth)),
            layout.toDeviceIndependentPixels(PercentLength.toDevicePixels(this.top, 0, availableHeight)),
            this.paint
        );
    }
    @stringProperty text: string;
}
