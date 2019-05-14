import { Canvas, createRect, Rect } from '../canvas';
import { nsProperty } from '../canvas.common';
import Shape, { lengthProperty, percentLengthProperty } from './shape';
import { Length, PercentLength, zeroLength } from 'tns-core-modules/ui/styling/style-properties';
import { Property } from 'tns-core-modules/ui/core/properties';
import { layout } from 'tns-core-modules/ui/core/view';

export { Rect };
export default class Rectangle extends Shape {
    drawOnCanvas(canvas: Canvas) {
        // console.log('Rectangle', 'drawOnCanvas');
        canvas.drawRect(this.getRect(canvas), this.paint);
    }
    @percentLengthProperty width: PercentLength;
    @percentLengthProperty height: PercentLength;
    @lengthProperty left: Length = zeroLength;
    @lengthProperty top: Length = zeroLength;

    getRect(canvas: Canvas) {
        const availableWidth = layout.toDevicePixels(canvas.getWidth());
        const availableHeight = layout.toDevicePixels(canvas.getHeight());
        const rect = createRect(
            layout.toDeviceIndependentPixels(Length.toDevicePixels(this.left)),
            layout.toDeviceIndependentPixels(Length.toDevicePixels(this.top)),
            layout.toDeviceIndependentPixels(PercentLength.toDevicePixels(this.width, 0, availableWidth)),
            layout.toDeviceIndependentPixels(PercentLength.toDevicePixels(this.height, 0, availableHeight))
        );
        // console.log('getRect', availableWidth, availableHeight, this.left, this.top, this.width, this.height, rect);
        return rect;
    }
}
