import { Canvas, Path } from '@nativescript-community/ui-canvas';
import BaseCustomShape from '@nativescript-community/ui-drawingcanvas/shapes/BaseCustomShape';
import { BoundingBox, Point } from './DrawableShape';

/**
 * CustomShape allows drawing arbitrary paths defined by a list of SVG-like commands.
 * It is designed to be the base for application-specific shapes.
 */
export interface PathCommand {
    cmd: 'M' | 'L' | 'C' | 'Q' | 'Z';
    args: number[];
}

export default class CustomShape extends BaseCustomShape {
    commands: PathCommand[] = [];

    get shapeType(): string {
        return 'custom';
    }

    setCommands(commands: PathCommand[]): void {
        this.commands = commands;
        this._bounds = null;
    }

    _getRawBounds(): { minX: number; minY: number; maxX: number; maxY: number } {
        const pts = this._collectPoints();
        if (pts.length === 0) {
            return;
        }
        let minX = pts[0].x;
        let minY = pts[0].y;
        let maxX = pts[0].x;
        let maxY = pts[0].y;
        for (const p of pts) {
            if (p.x < minX) minX = p.x;
            if (p.y < minY) minY = p.y;
            if (p.x > maxX) maxX = p.x;
            if (p.y > maxY) maxY = p.y;
        }
        const pad = (this.strokeWidth ?? 2) / 2;
        return { minX: minX - pad, minY: minY - pad, maxX: maxX + pad, maxY: maxY + pad };
    }

    _draw(canvas: Canvas): void {
        if (this.commands.length === 0) return;
        const path = this._buildPath();

        if (this.fillColor) {
            this.applyPaint(true);
            canvas.drawPath(path, this._paint);
        }
        if (this.strokeColor) {
            this.applyPaint(false);
            canvas.drawPath(path, this._paint);
        }
    }

    private _buildPath(): Path {
        const path = new Path();
        for (const cmd of this.commands) {
            switch (cmd.cmd) {
                case 'M':
                    path.moveTo(cmd.args[0] + this.x, cmd.args[1] + this.y);
                    break;
                case 'L':
                    path.lineTo(cmd.args[0] + this.x, cmd.args[1] + this.y);
                    break;
                case 'C':
                    path.cubicTo(cmd.args[0] + this.x, cmd.args[1] + this.y, cmd.args[2] + this.x, cmd.args[3] + this.y, cmd.args[4] + this.x, cmd.args[5] + this.y);
                    break;
                case 'Q':
                    path.quadTo(cmd.args[0] + this.x, cmd.args[1] + this.y, cmd.args[2] + this.x, cmd.args[3] + this.y);
                    break;
                case 'Z':
                    path.close();
                    break;
            }
        }
        return path;
    }

    private _collectPoints(): Point[] {
        const pts: Point[] = [];
        for (const cmd of this.commands) {
            for (let i = 0; i < cmd.args.length - 1; i += 2) {
                pts.push({ x: cmd.args[i] + this.x, y: cmd.args[i + 1] + this.y });
            }
        }
        return pts;
    }

    protected toJSONData(): Record<string, any> {
        return { cmds: this.commands };
    }

    protected fromJSONData(data: any): void {
        this.commands = data.cmds ?? [];
        this._bounds = null;
    }
}
