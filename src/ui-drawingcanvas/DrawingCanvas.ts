import { Color, ImageSource, Observable, ObservableArray, TextField, TextView, TouchGestureEventData, Utils } from '@nativescript/core';
import { Canvas, Matrix, Paint, Rect, RectF, createImage } from '@nativescript-community/ui-canvas';
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
import TextMode from './modes/TextMode';

// Shape factories for JSON deserialization
import PenShape from './shapes/PenShape';
import RectShape from './shapes/RectShape';
import EllipseShape from './shapes/EllipseShape';
import ArrowShape from './shapes/ArrowShape';
import ImageShape from './shapes/ImageShape';
import CustomShape from './shapes/CustomShape';
import TextShape from './shapes/TextShape';

/** Mode name type including built-in and any custom mode registered by the app */
export type DrawingModeName = 'pen' | 'select' | 'move' | 'rectangle' | 'ellipse' | 'arrow' | 'image' | 'text' | string;

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
    date: number;
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

    /** Handle hit-test radius in dp */
    handleTouchRadius = 25;

    /** Minimum dimension when resizing a shape in dp */
    minShapeSize = 40;

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

    /**
     * The effective display scale computed each frame in onDraw (canvasScale × matrix scale).
     * Used by drawShapeSelectionOverlay to keep handle sizes constant on screen.
     */
    _currentDisplayScale: number = undefined;

    /** Shared TextField used for TextShape editing (created lazily) */
    private _textField: TextView | null = null;
    /** The TextShape currently being edited, or null */
    private _editingTextShape: TextShape | null = null;
    /** Text value captured before editing begins (for undo) */
    private _editingTextSnapshot: string | null = null;

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
        if (name === 'move') {
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
            this._mode.onLayerRemoved(shape, idx);
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

    setCurrentMatrix(matrix: Matrix) {
        if (!this._canvasMatrix) {
            this._canvasMatrix = new Matrix();
        }
        this._canvasMatrix.set(matrix);
        let displayScale = this.canvasScale;
        // Approximate scale from the matrix components.
        // For a standard 2D affine matrix laid out as:
        //   [ vals[0]  vals[1]  vals[2] ]   (scaleX / cosθ, skewX / -sinθ, translateX)
        //   [ vals[3]  vals[4]  vals[5] ]   (skewY / sinθ,  scaleY / cosθ,  translateY)
        // The scale magnitude along X is sqrt(vals[0]^2 + vals[3]^2).
        const vals = Array.create('float', 9);
        this._canvasMatrix.getValues(vals);
        const matScaleX = Math.sqrt(vals[0] * vals[0] + vals[3] * vals[3]);
        if (isFinite(matScaleX) && matScaleX > 0) displayScale *= matScaleX;

        this._currentDisplayScale = displayScale;
    }

    onDraw(canvas: Canvas): void {
        const hasScale = this.canvasScale !== 1;
        const hasTranslate = this.canvasTranslateX !== 0 || this.canvasTranslateY !== 0;
        const hasCanvasMatrix = this.canvasMatrix && !this.canvasMatrix.isIdentity();
        const hasTransform = hasScale || hasTranslate || hasCanvasMatrix;

        this._currentDisplayScale = this._currentDisplayScale ?? this.canvasScale;

        if (hasTransform) {
            canvas.save();
            if (hasScale) {
                canvas.scale(this.canvasScale, this.canvasScale);
            }

            if (hasCanvasMatrix) {
                canvas.concat(this.canvasMatrix);
            }

            if (hasTranslate) {
                canvas.translate(this.canvasTranslateX / this.canvasScale, this.canvasTranslateY / this.canvasScale);
            }
        }
        if (this.callDrawBeforeShapes) {
            this.notify({ eventName: 'draw', object: this, canvas: this.augmentedCanvas });
        }

        // Draw all committed layers
        for (const shape of this.layers) {
            if (!shape.visible) continue;
            if (this._editingTextShape && this._editingTextShape.id === shape.id) {
                continue;
            }
            canvas.save();
            if (shape.rotation !== 0) {
                const b = shape.getBounds();
                const cx = (b.left + b.right) / 2;
                const cy = (b.top + b.bottom) / 2;
                canvas.rotate(shape.rotation, cx, cy);
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
        const modes: DrawingMode[] = [
            new PenMode(this),
            new SelectMode(this),
            new MoveMode(this),
            new RectangleMode(this),
            new EllipseMode(this),
            new ArrowMode(this),
            new ImageMode(this),
            new TextMode(this)
        ];
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
        this._shapeFactories.set('text', () => new TextShape());
    }

    matrixMapPointArray: any;
    /**
     * Cached inverse of `_canvasMatrix` used to transform touch coordinates from
     * screen space back to canvas space in `_handleTouch`. Re-computed on each touch
     * down since the matrix may change between gestures.
     */
    private _inverseMatrixCache: Matrix | null = null;

    private _handleTouch(args: TouchGestureEventData): void {
        const rawX = args.getX();
        const rawY = args.getY();

        // Correct inverse of the draw transform: scale(cs) → concat(M) → translate(tx/cs, ty/cs)
        // Inverse order: S⁻¹ first, then M⁻¹, then T⁻¹.

        // Step 1: undo canvasScale
        let px = rawX / this.canvasScale;
        let py = rawY / this.canvasScale;

        // Step 2: undo canvasMatrix (apply M⁻¹ to the un-scaled point)
        const hasCanvasMatrix = this.canvasMatrix && !this.canvasMatrix.isIdentity();
        if (hasCanvasMatrix) {
            if (!this.matrixMapPointArray) {
                this.matrixMapPointArray = Array.create('float', 2);
            }
            if (!this._inverseMatrixCache) {
                this._inverseMatrixCache = new Matrix();
            }
            if (this._canvasMatrix.invert(this._inverseMatrixCache)) {
                this.matrixMapPointArray[0] = px;
                this.matrixMapPointArray[1] = py;
                this._inverseMatrixCache.mapPoints(this.matrixMapPointArray);
                px = this.matrixMapPointArray[0];
                py = this.matrixMapPointArray[1];
            }
            // If invert fails (degenerate matrix), keep the un-matrix-mapped point.
        }

        // Step 3: undo canvasTranslate (subtract the canvas-space offset applied in onDraw)
        if (this.canvasTranslateX !== 0 || this.canvasTranslateY !== 0) {
            px -= this.canvasTranslateX / this.canvasScale;
            py -= this.canvasTranslateY / this.canvasScale;
        }

        const point = { x: px, y: py };

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

    // -----------------------------------------------------------------------
    // Customizable selection overlay
    // -----------------------------------------------------------------------

    /**
     * Draw the selection overlay for the given shape.
     * Override this method to customise the selection overlay appearance across all shapes,
     * or let individual shapes override their own `drawSelectionOverlay()` for per-shape customisation.
     */
    drawShapeSelectionOverlay(canvas: Canvas, shape: DrawableShape): void {
        shape.drawSelectionOverlay(canvas, this.handleSize, this._currentDisplayScale);
    }

    // -----------------------------------------------------------------------
    // Text editing
    // -----------------------------------------------------------------------

    /**
     * Open the shared TextField over the given TextShape so the user can type.
     * If the same shape is already being edited, the TextField is just repositioned
     * (no keyboard flicker). Pass `touchPoint` (in canvas coords) to position the
     * text cursor at the tap location; omit to leave the cursor where the platform puts it.
     */
    beginTextEdit(shape: TextShape, touchPoint?: { x: number; y: number } | null): void {
        // If we are already editing this shape, just reposition the overlay without
        // restarting the keyboard session.
        if (this._editingTextShape === shape) {
            this._positionTextField(shape);
            if (touchPoint) {
                // Defer cursor move slightly so the native layout has settled after repositioning.
                setTimeout(() => this._setTextCursorAtPoint(shape, touchPoint), 50);
            }
            return;
        }

        if (this._editingTextShape) {
            this.endTextEdit();
        }
        this._editingTextSnapshot = shape.text;
        this._editingTextShape = shape;
        // NOTE: undo snapshot is pushed in endTextEdit only if text actually changed.

        const tf = this._getOrCreateTextField();
        tf.text = shape.text;

        // Position over the shape's bounds (in screen dp, accounting for zoom)
        this._positionTextField(shape);

        if (!tf.parent) {
            this.addChild(tf);
            // disable scroll container
            if (__ANDROID__) {
                tf.nativeTextViewProtected.setVerticalScrollBarEnabled(false);
                tf.nativeTextViewProtected.setMovementMethod(null);
                tf.nativeTextViewProtected.setScrollContainer(false);
            }
        }

        // Listen for text changes
        tf.off('textChange');
        tf.on('textChange', (args: any) => {
            if (this._editingTextShape) {
                this._editingTextShape.text = args.value ?? tf.text;
                if (this._editingTextShape.resizeIfNeeded()) {
                    this._positionTextField(this._editingTextShape);
                }
                this.redraw();
            }
        });

        // Focus the field after a short delay so the soft keyboard has time to appear,
        // then position the cursor (Android needs the EditText to be focused first).
        setTimeout(() => {
            try {
                tf.focus();
                if (touchPoint) {
                    this._setTextCursorAtPoint(shape, touchPoint);
                }
            } catch (_e) {
                /* keyboard focus failure is non-fatal */
            }
        }, 100);

        this.redraw();
    }

    /**
     * Place the text cursor in the shared TextField at the position corresponding
     * to `touchPoint` (canvas-space coordinates) inside `shape`.
     * On Android this uses StaticLayout hit-testing; silently skipped on iOS.
     */
    private _setTextCursorAtPoint(shape: TextShape, touchPoint: { x: number; y: number }): void {
        const tf = this._textField;
        if (!tf || !shape.text) return;
        try {
            const b = shape.getBounds();
            const localX = touchPoint.x - b.left;
            const localY = touchPoint.y - b.top;
            const layout = shape.getStaticLayout(b);
            const line = layout.getLineForVertical(localY);
            const offset = layout.getOffsetForHorizontal(line, localX);
            // setSelection is an Android (EditText) API; wrapped in try-catch so it's a no-op on iOS.
            const nativeView = (tf as any).nativeViewProtected;
            if (nativeView?.setSelection) {
                nativeView.setSelection(offset);
            }
        } catch (_e) {
            /* Cursor positioning is non-fatal; platform may not support the API */
        }
    }

    /** Re-position the shared TextField to match the currently edited TextShape's screen bounds.
     *  Called from SelectMode during resize/move so the TextField follows the shape live. */
    updateTextEditLayout(): void {
        if (this._editingTextShape) {
            this._positionTextField(this._editingTextShape);
        }
    }

    /**
     * Commit the TextField content to the shape and hide the TextField.
     * An undo snapshot is pushed only if the text actually changed.
     */
    endTextEdit(): void {
        if (!this._editingTextShape || !this._textField) return;
        const shape = this._editingTextShape;
        const newText = this._textField.text ?? '';

        // Push an undo snapshot only when the text actually changed
        if (this._editingTextSnapshot?.length && newText !== this._editingTextSnapshot) {
            shape.text = this._editingTextSnapshot;
            this.pushUndoSnapshot();
            shape.text = newText;
        }

        this._editingTextShape = null;
        this._editingTextSnapshot = null;

        try {
            this._textField.off('textChange');
            this._textField.dismissSoftInput();
        } catch (_e) {
            /* dismissSoftInput failure is non-fatal */
        }

        try {
            if (this._textField.parent) {
                (this._textField.parent as any).removeChild(this._textField);
            }
        } catch (_e) {
            /* removeChild failure is non-fatal */
        }

        this.redraw();
    }

    private _getOrCreateTextField(): TextView {
        if (!this._textField) {
            const tf = new TextView();
            tf.backgroundColor = 'transparent';
            tf.borderColor = 'transparent';
            tf.borderWidth = 0;
            tf.padding = 0;
            tf.autocorrect = false;
            tf.autocapitalizationType = 'none';
            this._textField = tf;
        }
        return this._textField;
    }

    private _positionTextField(shape: TextShape): void {
        const tf = this._textField;
        const b = shape.getBounds();
        const displayScale = this._currentDisplayScale ?? this.canvasScale;

        // Forward transform mirrors onDraw: scale(cs) → concat(M) → translate(tx/cs, ty/cs)
        // So: shape_point → T(tx/cs,ty/cs) → M → Scale(cs) → screen

        // Step 1: apply translate offset in canvas space (before M and scale)
        let cx = b.left + this.canvasTranslateX / this.canvasScale;
        let cy = b.top + this.canvasTranslateY / this.canvasScale;

        // Step 2: apply canvasMatrix
        if (this._canvasMatrix && !this._canvasMatrix.isIdentity()) {
            try {
                const arr = Array.create('float', 2);
                arr[0] = cx;
                arr[1] = cy;
                this._canvasMatrix.mapPoints(arr);
                cx = arr[0];
                cy = arr[1];
            } catch (_e) {}
        }

        // Step 3: apply canvasScale
        const screenX = cx * this.canvasScale;
        const screenY = cy * this.canvasScale;
        const screenW = (b.right - b.left) * displayScale;
        const screenH = (b.bottom - b.top) * displayScale;

        tf.marginLeft = screenX;
        tf.marginTop = screenY;
        tf.width = Math.max(40, screenW);
        tf.height = Math.max(20, screenH);
        tf.fontSize = shape.fontSize * displayScale;
        if (shape.fontFamily) tf.fontFamily = shape.fontFamily;
        tf.fontWeight = shape.bold ? 'bold' : 'normal';
        tf.fontStyle = shape.italic ? 'italic' : 'normal';
        tf.rotate = shape.rotation;
        tf.horizontalAlignment = 'left';
        tf.verticalAlignment = 'top';
    }

    // -----------------------------------------------------------------------
    // Image export
    // -----------------------------------------------------------------------

    /**
     * Export the current canvas layers as an off-screen bitmap.
     *
     * @param targetWidthDp  - width of the output image in dp (defaults to the DrawingCanvas width)
     * @param targetHeightDp - height of the output image in dp (defaults to the DrawingCanvas height)
     * @param transform      - optional Matrix to apply when rendering shapes (e.g. the canvasMatrix
     *                         that maps canvas coordinates to the image coordinate space)
     * @returns ImageSource   containing the rendered bitmap, or null on error
     */
    exportImage(targetWidthDp: number, targetHeightDp: number, rect: RectF, backgroundImageSource?: ImageSource): ImageSource | null {
        try {
            const density = Utils.layout.getDisplayDensity();
            const wDp = targetWidthDp ?? Utils.layout.toDeviceIndependentPixels(this.getMeasuredWidth());
            const hDp = targetHeightDp ?? Utils.layout.toDeviceIndependentPixels(this.getMeasuredHeight());
            const wPx = Utils.layout.toDevicePixels(wDp);
            const hPx = Utils.layout.toDevicePixels(hDp);
            const scale = wPx / rect.width();

            if (wPx <= 0 || hPx <= 0) return null;

            // Create an off-screen ImageSource and a Canvas backed by it
            const offCanvas = new Canvas(wPx, hPx);
            offCanvas.drawColor('#ff0000');
            if (backgroundImageSource) {
                offCanvas.drawBitmap(backgroundImageSource, new Rect(0, 0, backgroundImageSource.width, backgroundImageSource.height), new Rect(0, 0, wPx, hPx), new Paint());
            }
            // Scale from dp to px, then offset so the image-rect origin maps to (0,0)
            offCanvas.scale(scale, scale);
            // offCanvas.translate(-rect.left, -rect.top);

            // Draw all visible layers
            for (const shape of this.layers) {
                if (!shape.visible) continue;
                offCanvas.save();
                if (shape.rotation !== 0) {
                    const b = shape.getBounds();
                    const cx = (b.left + b.right) / 2;
                    const cy = (b.top + b.bottom) / 2;
                    offCanvas.rotate(shape.rotation, cx, cy);
                }
                shape.draw(offCanvas);
                offCanvas.restore();
            }

            const image = offCanvas.getImage();
            offCanvas.release();
            return new ImageSource(image);
        } catch (err) {
            console.error('DrawingCanvas.exportImage failed:', err);
            return null;
        }
    }

    private _captureSnapshot(): Snapshot {
        const date = Date.now();
        return { layers: [...this.layers.map((s) => s.toJSON())], date };
    }

    private _restoreSnapshot(snap: Snapshot): void {
        // Detach all current listeners and clear the ObservableArray
        for (let i = 0; i < this.layers.length; i++) {
            this.layers.getItem(i).off(Observable.propertyChangeEvent, this._onShapeChanged, this);
        }
        this.layers.splice(0, this.layers.length);
        const layers = snap.layers.map((s) => {
            const shape = this._createShapeFromJSON(s);
            shape.on(Observable.propertyChangeEvent, this._onShapeChanged, this);
            return shape;
        });
        this.layers.splice(0, this.layers.length, ...layers);
        this._mode.onSnapShotRestored();
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
