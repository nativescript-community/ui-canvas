import { layout } from '@nativescript/core/utils/utils';
import { PercentLength } from '@nativescript/core/ui/styling/style-properties';
import { Canvas, Style } from '../canvas';
import Rectangle from './rectangle';
import { percentLengthProperty } from './shape';

export default class Line extends Rectangle {
    constructor() {
        super();
        this.paintStyle = Style.STROKE;
    }
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
    @percentLengthProperty({ nonPaintProp: true }) startX: PercentLength = 0;
    @percentLengthProperty({ nonPaintProp: true }) startY: PercentLength = 0;
    @percentLengthProperty({ nonPaintProp: true }) stopX: PercentLength = 0;
    @percentLengthProperty({ nonPaintProp: true }) stopY: PercentLength = 0;
}
