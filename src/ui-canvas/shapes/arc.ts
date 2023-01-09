import { Canvas } from '..';
import Rectangle from './rectangle';
import { booleanProperty, numberProperty } from './shape';

export default class Arc extends Rectangle {
    drawOnCanvas(canvas: Canvas) {
        canvas.drawArc(this.getRect(canvas), this.startAngle, this.sweepAngle, this.useCenter, this.paint);
    }
    @numberProperty startAngle: number = 0;
    @numberProperty sweepAngle: number = 0;
    @booleanProperty useCenter = false;
}
