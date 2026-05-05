import { Color, Observable, ObservableArray, TouchGestureEventData } from '@nativescript/core';
import { Canvas, Matrix } from '@nativescript-community/ui-canvas';
import { CanvasView } from '@nativescript-community/ui-canvas';
import { DrawableShape, ShapeJSON } from './shapes/DrawableShape';
import { DrawingMode } from './modes/DrawingMode';
import PenMode from './modes/PenMode';
import SelectMode from './modes/SelectMode';
import MoveMode from './modes/MoveMode';
import RectangleMode from './modes/RectangleMode';
import EllipseMode from './modes/EllipseMode';
import ArrowMode from './modes/ArrowMode';
import ImageMode from './modes/ImageMode';

// Shape factories for JSON deserialization
import PenShape from './shapes/PenShape';
import RectShape from './shapes/RectShape';
import EllipseShape from './shapes/EllipseShape';
import ArrowShape from './shapes/ArrowShape';
import ImageShape from './shapes/ImageShape';
import CustomShape from './shapes/CustomShape';

/** Mode name type including built-in and any custom mode registered by the app */
export type DrawingModeName = 'pen' | 'select' | 'move' | 'rectangle' | 'ellipse' | 'arrow' | 'image' | string;

export interface SimplificationOptions {
    /** Enable path simplification (default: true) */
    enabled?: boolean;
    /** Douglas-Peucker epsilon in dp (default: 2) */
    epsilon?: number;
    /** Apply Catmull-Rom smoothing after simplification (default: true) */
    smoothing?: boolean;
    /** Number of interpolation segments per control point (default: 8) */
    splineSegments?: number;
    /** Catmull-Rom alpha: 0=uniform, 0.5=centripetal, 1=chordal (default: 0.5) */
    splineAlpha?: number;
}

/** Shape factory function registered for custom shape types */
export type ShapeFactory = () => DrawableShape;

/** Snapshot used for undo/redo */
interface Snapshot {
    layers: ShapeJSON[];
}

/**
 * DrawingCanvas – a CanvasView-based view that provides interactive drawing with
 * multiple modes, layers, undo/redo, selection & transform, and JSON serialization.
 *
 * Usage:
 *   const dc = new DrawingCanvas();
 *   dc.setMode('pen');
 *   dc.strokeColor = new Color('red');
 */
export class DrawingCanvas extends CanvasView {
    // -----------------------------------------------------------------------
    // Configurable properties
    // -----------------------------------------------------------------------

    /** Current stroke colour */
    strokeColor: Color | null = new Color('#000000');
    /** Current fill colour */
    fillColor: Color | null = null;
    /** Current stroke width in dp */
    strokeWidth: number = 2;
    /** Global opacity for newly created shapes (0-1) */
    shapeOpacity: number = 1;

    /** Handle size for selection overlay in dp */
    handleSize: number = 10;

    /** Maximum number of undo snapshots to retain (default: 50) */
    maxUndoDepth: number = 50;

    /**
     * Global canvas scale factor applied when drawing (useful for zoom integration).
     * Touch coordinates are inverse-transformed automatically.
     */
    canvasScale: number = 1;

    /** Global canvas X translation applied when drawing (useful for pan integration) */
    canvasTranslateX: number = 0;

    /** Global canvas Y translation applied when drawing (useful for pan integration) */
    canvasTranslateY: number = 0;

    /** Global canvas Matrix applied when drawing (useful for zoom integration) */
    _canvasMatrix: Matrix;

    set canvasMatrix(matrix) {
        this._canvasMatrix = matrix;
    }
    get canvasMatrix() {
        return this._canvasMatrix;
    }

    /** Simplification options for pen strokes */
    simplificationOptions: SimplificationOptions = { enabled: true, epsilon: 2, smoothing: true };

    // -----------------------------------------------------------------------
    // Internal state
    // -----------------------------------------------------------------------

    /** All drawable layers, bottom-to-top order (ObservableArray for data-binding) */
    readonly layers: ObservableArray<DrawableShape> = new ObservableArray<DrawableShape>();

    private _mode: DrawingMode;
    private _modes: Map<string, DrawingMode> = new Map();
    private _undoStack: Snapshot[] = [];
    private _redoStack: Snapshot[] = [];
    private _shapeFactories: Map<string, ShapeFactory> = new Map();

    constructor() {
        super();

        // Register built-in modes
        this._registerBuiltinModes();
        // Register built-in shape factories
        this._registerBuiltinFactories();

        // Default mode
        this._mode = this._modes.get('pen')!;
        this._mode.activate();

        // Listen to touch events
        this.on('touch', this._handleTouch.bind(this));
    }

    // -----------------------------------------------------------------------
    // Mode management
    // -----------------------------------------------------------------------

    /** Get the current active mode name */
    get modeName(): string {
        return this._mode.name;
    }

    /** Switch to a built-in or registered mode */
    setMode(name: DrawingModeName): void {
        if (this._mode.name === name) return;
        const mode = this._modes.get(name);
        if (!mode) {
            throw new Error(`DrawingCanvas: unknown mode '${name}'. Register it with registerMode() first.`);
        }
        const oldMode = this._mode;
        this._mode.deactivate();
        console.log('setMode', mode.name, oldMode.name);
        if (mode.name === 'move') {
            this.isUserInteractionEnabled = false;
        } else if (oldMode.name === 'move') {
            this.isUserInteractionEnabled = true;
        }
        this._mode = mode;
        this._mode.activate();
        this.notify({ eventName: 'modeChange', object: this, mode: name });
        this.redraw();
    }

    /** Register a custom drawing mode */
    registerMode(mode: DrawingMode): void {
        this._modes.set(mode.name, mode);
    }

    /**
     * Programmatically select a shape: switches to 'select' mode and marks the shape as selected.
     * Fires a 'selectionChange' event.
     */
    selectShape(shape: DrawableShape | null): void {
        // Ensure we are in select mode
        if (this._mode.name !== 'select') {
            this.setMode('select');
        }
        const selectMode = this._modes.get('select') as SelectMode;
        selectMode.setSelectedShape(shape);
        this.notify({ eventName: 'selectionChange', object: this, shape });
        this.redraw();
    }

    // -----------------------------------------------------------------------
    // Layer management
    // -----------------------------------------------------------------------

    /** Add a shape to the top of the layer stack */
    addLayer(shape: DrawableShape): void {
        this.layers.push(shape);
        shape.on(Observable.propertyChangeEvent, this._onShapeChanged, this);
        this.redraw();
    }

    /** Remove a shape (undoable) */
    removeLayer(shape: DrawableShape): void {
        this.pushUndoSnapshot();
        this._removeLayerInternal(shape);
    }

    /** Remove without pushing an undo snapshot (used internally by restore/importJSON) */
    private _removeLayerInternal(shape: DrawableShape): void {
        const idx = this.layers.indexOf(shape);
        if (idx !== -1) {
            shape.off(Observable.propertyChangeEvent, this._onShapeChanged, this);
            this.layers.splice(idx, 1);
            this.redraw();
        }
    }

    /** Duplicate a shape and add it slightly offset */
    duplicateShape(shape: DrawableShape): DrawableShape {
        const json = shape.toJSON();
        const copy = this._createShapeFromJSON(json);
        if (copy) {
            copy.x += 10;
            copy.y += 10;
            this.pushUndoSnapshot();
            this.addLayer(copy);
        }
        return copy;
    }

    /** Move a shape to a specific index in the layer stack */
    moveShapeToIndex(shape: DrawableShape, index: number): void {
        const current = this.layers.indexOf(shape);
        if (current === -1) return;
        this.layers.splice(current, 1);
        this.layers.splice(Math.max(0, Math.min(index, this.layers.length)), 0, shape);
        this.redraw();
    }

    /** Move a layer up by one */
    moveLayerUp(shape: DrawableShape): void {
        const idx = this.layers.indexOf(shape);
        if (idx < this.layers.length - 1) {
            this.moveShapeToIndex(shape, idx + 1);
        }
    }

    /** Move a layer down by one */
    moveLayerDown(shape: DrawableShape): void {
        const idx = this.layers.indexOf(shape);
        if (idx > 0) {
            this.moveShapeToIndex(shape, idx - 1);
        }
    }

    // -----------------------------------------------------------------------
    // Undo / Redo
    // -----------------------------------------------------------------------

    /** Whether undo is available */
    get canUndo(): boolean {
        return this._undoStack.length > 0;
    }

    /** Whether redo is available */
    get canRedo(): boolean {
        return this._redoStack.length > 0;
    }

    /** Take a snapshot of the current layers and push to undo stack */
    pushUndoSnapshot(): void {
        const snapshot = this._captureSnapshot();
        this._undoStack.push(snapshot);
        if (this._undoStack.length > this.maxUndoDepth) {
            this._undoStack.shift();
        }
        this._redoStack = [];
        this.notify({ eventName: 'historyChange', object: this, canUndo: this.canUndo, canRedo: this.canRedo });
    }

    undo(): void {
        if (!this.canUndo) return;
        const current = this._captureSnapshot();
        this._redoStack.push(current);
        const snap = this._undoStack.pop();
        this._restoreSnapshot(snap);
        this.notify({ eventName: 'historyChange', object: this, canUndo: this.canUndo, canRedo: this.canRedo });
    }

    redo(): void {
        if (!this.canRedo) return;
        const current = this._captureSnapshot();
        this._undoStack.push(current);
        const snap = this._redoStack.pop();
        this._restoreSnapshot(snap);
        this.notify({ eventName: 'historyChange', object: this, canUndo: this.canUndo, canRedo: this.canRedo });
    }

    // -----------------------------------------------------------------------
    // JSON import / export
    // -----------------------------------------------------------------------

    /** Export all layers as a compact JSON string */
    exportJSON(): string {
        const data = this.layers.map((s) => s.toJSON());
        return JSON.stringify(data);
    }

    /** Import layers from a JSON string, replacing current layers */
    importJSON(json: string): void {
        this.pushUndoSnapshot();
        const data: ShapeJSON[] = JSON.parse(json);
        // Remove all existing layers (bypass public removeLayer to avoid multiple undo snapshots)
        for (const s of this.layers.slice()) {
            this._removeLayerInternal(s);
        }
        for (const item of data) {
            const shape = this._createShapeFromJSON(item);
            if (shape) this.addLayer(shape);
        }
        this.redraw();
    }

    /** Register a custom shape factory for a given type string */
    registerShapeFactory(type: string, factory: ShapeFactory): void {
        this._shapeFactories.set(type, factory);
    }

    // -----------------------------------------------------------------------
    // Shape property changes
    // -----------------------------------------------------------------------

    /** Change the stroke colour of a specific shape (or all selected shapes) */
    setShapeStrokeColor(shape: DrawableShape, color: Color): void {
        this.pushUndoSnapshot();
        shape.strokeColor = color;
        this.redraw();
    }

    /** Change the fill colour of a specific shape */
    setShapeFillColor(shape: DrawableShape, color: Color | null): void {
        this.pushUndoSnapshot();
        shape.fillColor = color;
        this.redraw();
    }

    /** Change the stroke width of a specific shape */
    setShapeStrokeWidth(shape: DrawableShape, width: number): void {
        this.pushUndoSnapshot();
        shape.strokeWidth = width;
        this.redraw();
    }

    // -----------------------------------------------------------------------
    // Internal: committing shapes from modes
    // -----------------------------------------------------------------------

    /** Called by drawing modes to commit a finished shape to the layers */
    commitShape(shape: DrawableShape): void {
        this.pushUndoSnapshot();
        this.addLayer(shape);
        this.notify({ eventName: 'shapeAdded', object: this, shape });
    }

    // -----------------------------------------------------------------------
    // Drawing
    // -----------------------------------------------------------------------
    augmentedCanvas: Canvas;
    callDrawBeforeShapes: boolean;

    onDraw(canvas: Canvas): void {
        const hasScale = this.canvasScale !== 1;
        const hasTranslate = this.canvasTranslateX !== 0 || this.canvasTranslateY !== 0;
        const hasCanvasMatrix = this.canvasMatrix && !this.canvasMatrix.isIdentity();
        const hasTransform = hasScale || hasTranslate || hasCanvasMatrix;
        if (hasTransform) {
            canvas.save();
            if (hasTranslate) {
                canvas.translate(this.canvasTranslateX, this.canvasTranslateY);
            }
            if (hasScale) {
                canvas.scale(this.canvasScale, this.canvasScale);
            }
            if (hasCanvasMatrix) {
                canvas.concat(this.canvasMatrix);
            }
        }
        if (this.callDrawBeforeShapes) {
            this.notify({ eventName: 'draw', object: this, canvas: this.augmentedCanvas });
        }

        // Draw all committed layers
        for (const shape of this.layers) {
            if (!shape.visible) continue;
            canvas.save();
            if (shape.rotation !== 0) {
                const b = shape.getBounds();
                const cx = (b.left + b.right) / 2;
                const cy = (b.top + b.bottom) / 2;
                canvas.rotate(shape.rotation, cx, cy);
            }
            if (shape.scaleX !== 1 || shape.scaleY !== 1) {
                canvas.scale(shape.scaleX, shape.scaleY);
            }
            shape.draw(canvas);
            canvas.restore();
        }

        // Draw mode overlay (in-progress shape, handles, etc.)
        this._mode.drawOverlay(canvas);

        if (hasTransform) {
            canvas.restore();
        }

        // Fire draw event for external listeners (consistent with CanvasView behaviour)
        if (!this.callDrawBeforeShapes) {
            this.notify({ eventName: 'draw', object: this, canvas: this.augmentedCanvas });
        }
    }

    // -----------------------------------------------------------------------
    // Private helpers
    // -----------------------------------------------------------------------

    private _registerBuiltinModes(): void {
        const modes: DrawingMode[] = [new PenMode(this), new SelectMode(this), new MoveMode(this), new RectangleMode(this), new EllipseMode(this), new ArrowMode(this), new ImageMode(this)];
        for (const m of modes) {
            this._modes.set(m.name, m);
        }
    }

    private _registerBuiltinFactories(): void {
        this._shapeFactories.set('pen', () => new PenShape());
        this._shapeFactories.set('rect', () => new RectShape());
        this._shapeFactories.set('ellipse', () => new EllipseShape());
        this._shapeFactories.set('arrow', () => new ArrowShape());
        this._shapeFactories.set('image', () => new ImageShape());
        this._shapeFactories.set('custom', () => new CustomShape());
    }

    matrixMapPointArray: any
    private _handleTouch(args: TouchGestureEventData): void {
        // Inverse-transform touch coordinates to account for canvasScale / canvasTranslate
        const rawX = args.getX();
        const rawY = args.getY();
        const point = {
            x: (rawX - this.canvasTranslateX) / this.canvasScale,
            y: (rawY - this.canvasTranslateY) / this.canvasScale
        };
        const hasCanvasMatrix = this.canvasMatrix && !this.canvasMatrix.isIdentity();
        if (hasCanvasMatrix) {
            if (!this.matrixMapPointArray) {
                this.matrixMapPointArray = Array.create('float', 2);
            }
            this.matrixMapPointArray[0] = point.x;
            this.matrixMapPointArray[1] = point.y;
            this._canvasMatrix.mapPoints(this.matrixMapPointArray);
            point.x = this.matrixMapPointArray[0];
            point.y = this.matrixMapPointArray[1];
        }

        switch (args.action) {
            case 'down':
                this._mode.onTouchStart(point, args);
                break;
            case 'move':
                this._mode.onTouchMove(point, args);
                break;
            case 'up':
                this._mode.onTouchEnd(point, args);
                break;
            case 'cancel':
                this._mode.onTouchCancel(point, args);
                break;
        }
    }

    private _onShapeChanged(): void {
        this.redraw();
    }

    private _captureSnapshot(): Snapshot {
        return { layers: [...this.layers.map((s) => s.toJSON())] };
    }

    private _restoreSnapshot(snap: Snapshot): void {
        // Detach all current listeners and clear the ObservableArray
        for (let i = 0; i < this.layers.length; i++) {
            this.layers.getItem(i).off(Observable.propertyChangeEvent, this._onShapeChanged, this);
        }
        this.layers.splice(0, this.layers.length);

        for (const item of snap.layers) {
            const shape = this._createShapeFromJSON(item);
            if (shape) {
                this.layers.push(shape);
                shape.on(Observable.propertyChangeEvent, this._onShapeChanged, this);
            }
        }
        this.redraw();
    }

    private _createShapeFromJSON(data: ShapeJSON): DrawableShape | null {
        const factory = this._shapeFactories.get(data.type);
        if (!factory) {
            console.warn(`DrawingCanvas: no factory for shape type '${data.type}'`);
            return null;
        }
        const shape = factory();
        shape.fromJSON(data);
        return shape;
    }
}
