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
        const marginLeft = this.marginLeft?(PercentLength.toDevicePixels(this.marginLeft, 0, availableWidth)):0;
        const marginTop = this.marginTop?(PercentLength.toDevicePixels(this.marginTop, 0, availableHeight)):0;
        const marginRight = this.marginRight?(PercentLength.toDevicePixels(this.marginRight, 0, availableWidth)):0;
        const marginBottom = this.marginBottom?(PercentLength.toDevicePixels(this.marginBottom, 0, availableHeight)):0;
        canvas.drawLine(
            layout.toDeviceIndependentPixels(PercentLength.toDevicePixels(this.startX, 0, availableWidth) + marginLeft),
            layout.toDeviceIndependentPixels(PercentLength.toDevicePixels(this.startY, 0, availableHeight) + marginTop),
            layout.toDeviceIndependentPixels(PercentLength.toDevicePixels(this.stopX, 0, availableWidth) - marginRight - marginLeft),
            layout.toDeviceIndependentPixels(PercentLength.toDevicePixels(this.stopY, 0, availableHeight) - marginBottom - marginTop),
            this.paint
        );
    }
    @percentLengthProperty({ nonPaintProp: true }) startX: PercentLength = 0;
    @percentLengthProperty({ nonPaintProp: true }) startY: PercentLength = 0;
    @percentLengthProperty({ nonPaintProp: true }) stopX: PercentLength = 0;
    @percentLengthProperty({ nonPaintProp: true }) stopY: PercentLength = 0;
}
