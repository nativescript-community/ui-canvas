import { Canvas, Style } from '../canvas';
import { booleanProperty, lengthProperty, numberProperty, percentLengthProperty } from './shape';
import { Length, PercentLength, zeroLength } from '@nativescript/core/ui/styling/style-properties';
import Rectangle from './rectangle';
import { layout } from '@nativescript/core/ui/core/view';

export default class Line extends Rectangle {
    paintStyle = Style.STROKE;
    drawOnCanvas(canvas: Canvas) {
        const availableWidth = layout.toDevicePixels(canvas.getWidth());
        const availableHeight = layout.toDevicePixels(canvas.getHeight());
        canvas.drawLine(
            layout.toDeviceIndependentPixels(PercentLength.toDevicePixels(this.startX, 0, availableWidth)),
            layout.toDeviceIndependentPixels(PercentLength.toDevicePixels(this.startY, 0, availableHeight)),
            layout.toDeviceIndependentPixels(PercentLength.toDevicePixels(this.stopX, 0, availableWidth)),
            layout.toDeviceIndependentPixels( PercentLength.toDevicePixels(this.stopY, 0, availableHeight)),
            this.paint
        );
    }
    @percentLengthProperty startX: PercentLength = 0;
    @percentLengthProperty startY: PercentLength = 0;
    @percentLengthProperty stopX: PercentLength = 0;
    @percentLengthProperty stopY: PercentLength = 0;
}
