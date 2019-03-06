import { Canvas, createRect } from '../canvas';
import { booleanProperty, lengthProperty, numberProperty, percentLengthProperty } from './shape';
import { Length, PercentLength, zeroLength } from 'tns-core-modules/ui/styling/style-properties';
import Rectangle from './rectangle';

export default class Arc extends Rectangle {
    drawOnCanvas(canvas: Canvas) {
        // console.log('Arc', 'drawOnCanvas');
        canvas.drawArc(this.getRect(canvas), this.startAngle, this.sweepAngle, this.useCenter, this.paint);
    }
    @numberProperty startAngle: number = 0;
    @numberProperty sweepAngle: number = 0;
    @booleanProperty useCenter = false;
}
