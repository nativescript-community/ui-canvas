import { Length, PercentLength, zeroLength } from '@nativescript/core/ui/styling/style-properties';
import { layout } from '@nativescript/core/utils/utils';
import { Canvas, Rect, RectF, createRectF } from '../canvas';
import Shape, { lengthProperty, percentLengthProperty } from './shape';

export { Rect, RectF };
export default class Rectangle extends Shape {
    drawOnCanvas(canvas: Canvas) {
        // console.log('Rectangle', 'drawOnCanvas');
        canvas.drawRect(this.getRect(canvas), this.paint);
    }
    @percentLengthProperty width: PercentLength;
    @percentLengthProperty height: PercentLength;
    @lengthProperty left: Length = zeroLength;
    @lengthProperty top: Length = zeroLength;

    // getRect(canvas: Canvas) {
    //     const availableWidth = layout.toDevicePixels(canvas.getWidth());
    //     const availableHeight = layout.toDevicePixels(canvas.getHeight());
    //     const rect = createRect(
    //         layout.toDeviceIndependentPixels(Length.toDevicePixels(this.left)),
    //         layout.toDeviceIndependentPixels(Length.toDevicePixels(this.top)),
    //         layout.toDeviceIndependentPixels(PercentLength.toDevicePixels(this.width, 0, availableWidth)),
    //         layout.toDeviceIndependentPixels(PercentLength.toDevicePixels(this.height, 0, availableHeight))
    //     );
    //     // console.log('getRect', availableWidth, availableHeight, this.left, this.top, this.width, this.height, rect);
    //     return rect;
    // }
    getRect(canvas: Canvas) {
        const availableWidth = layout.toDevicePixels(canvas.getWidth());
        const availableHeight = layout.toDevicePixels(canvas.getHeight());
        const rect = createRectF(
            layout.toDeviceIndependentPixels(Length.toDevicePixels(this.left)),
            layout.toDeviceIndependentPixels(Length.toDevicePixels(this.top)),
            layout.toDeviceIndependentPixels(PercentLength.toDevicePixels(this.width, 0, availableWidth)),
            layout.toDeviceIndependentPixels(PercentLength.toDevicePixels(this.height, 0, availableHeight))
        );
        // console.log('getRect', availableWidth, availableHeight, this.left, this.top, this.width, this.height, rect);
        return rect;
    }
}
