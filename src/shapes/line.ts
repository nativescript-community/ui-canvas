import { CoreTypes } from '@nativescript/core';
import { PercentLength } from '@nativescript/core/ui/styling/style-properties';
import { layout } from '@nativescript/core/utils/layout-helper';
import { Canvas, Style } from '../canvas';
import Rectangle from './rectangle';
import { percentLengthProperty } from './shape';

export default class Line extends Rectangle {
    paintStyle = Style.STROKE;
    drawOnCanvas(canvas: Canvas) {
        const availableWidth = layout.toDevicePixels(canvas.getWidth());
        const availableHeight = layout.toDevicePixels(canvas.getHeight());
        canvas.drawLine(
            layout.toDeviceIndependentPixels(PercentLength.toDevicePixels(this.startX, 0, availableWidth)),
            layout.toDeviceIndependentPixels(PercentLength.toDevicePixels(this.startY, 0, availableHeight)),
            layout.toDeviceIndependentPixels(PercentLength.toDevicePixels(this.stopX, 0, availableWidth)),
            layout.toDeviceIndependentPixels(PercentLength.toDevicePixels(this.stopY, 0, availableHeight)),
            this.paint
        );
    }
    @percentLengthProperty({ nonPaintProp: true }) startX: CoreTypes.PercentLengthType = 0;
    @percentLengthProperty({ nonPaintProp: true }) startY: CoreTypes.PercentLengthType = 0;
    @percentLengthProperty({ nonPaintProp: true }) stopX: CoreTypes.PercentLengthType = 0;
    @percentLengthProperty({ nonPaintProp: true }) stopY: CoreTypes.PercentLengthType = 0;
}
