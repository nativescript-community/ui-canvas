# @nativescript-community/ui-drawingcanvas

An interactive drawing canvas plugin for NativeScript, built on top of `@nativescript-community/ui-canvas`.

## Features

- **Multiple drawing modes**: pen/freehand, rectangle, ellipse, arrow, image placement, select/transform, and move (pan)
- **Layer management**: access shapes as an ordered list of layers – reorder, remove, duplicate
- **Undo / Redo**: full history with configurable depth
- **Shape selection & transform**: resize, rotate and move any shape with on-canvas handles
- **Colour & style**: stroke colour, fill colour, stroke width and opacity per shape
- **JSON serialization**: export the entire canvas to a compact JSON string and re-import it later
- **Path simplification**: automatic Douglas-Peucker + Catmull-Rom smoothing for pen strokes (configurable, extensible)
- **Extensible**: register custom drawing modes and custom shape types

## Installation

```bash
ns plugin add @nativescript-community/ui-drawingcanvas
```

> **Peer dependency**: `@nativescript-community/ui-canvas` must also be installed.

## Usage

### NativeScript Core / TypeScript

```typescript
import { DrawingCanvas } from '@nativescript-community/ui-drawingcanvas';

const dc = new DrawingCanvas();
dc.strokeColor = new Color('red');
dc.strokeWidth = 3;
dc.setMode('pen');          // 'pen' | 'select' | 'move' | 'rectangle' | 'ellipse' | 'arrow' | 'image'
```

### Vue (NativeScript-Vue)

```typescript
// app.ts / main.ts
import DrawingCanvasPlugin from '@nativescript-community/ui-drawingcanvas/vue';
Vue.use(DrawingCanvasPlugin);
```

```html
<DrawingCanvas ref="dc" width="100%" height="100%" />
```

## Drawing Modes

| Mode | Description |
|------|-------------|
| `pen` | Freehand stroke |
| `rectangle` | Tap-drag to draw a rectangle |
| `ellipse` | Tap-drag to draw an ellipse / circle |
| `arrow` | Tap-drag to draw an arrow |
| `image` | Tap to place an image (set `imageSource` on the `ImageMode` first) |
| `select` | Tap to select shapes; drag handles to resize / rotate; drag body to move |
| `move` | Pan gesture (emits `pan` event with `dx`/`dy`) |

## Undo / Redo

```typescript
dc.undo();
dc.redo();
console.log(dc.canUndo, dc.canRedo);

// Configure undo history depth (default: 50)
dc.maxUndoDepth = 30;
```

## Layer Management

```typescript
const layers = dc.layers;          // DrawableShape[]
dc.moveLayerUp(shape);
dc.moveLayerDown(shape);
dc.duplicateShape(shape);
dc.removeLayer(shape);
```

## JSON Serialization

```typescript
const json = dc.exportJSON();
// later …
dc.importJSON(json);
```

## Path Simplification

```typescript
dc.simplificationOptions = {
    enabled: true,
    epsilon: 2,           // Douglas-Peucker tolerance in dp
    smoothing: true,      // apply Catmull-Rom spline
    splineSegments: 8,
    splineAlpha: 0.5      // 0=uniform, 0.5=centripetal (recommended)
};
```

## Custom Modes

```typescript
import { DrawingMode } from '@nativescript-community/ui-drawingcanvas';

class MyMode extends DrawingMode {
    readonly name = 'mymode';
    onTouchEnd(point) {
        // … create and commit a shape
        this.canvas.commitShape(myShape);
    }
}
dc.registerMode(new MyMode(dc));
dc.setMode('mymode');
```

## Custom Shape Types

```typescript
import { CustomShape } from '@nativescript-community/ui-drawingcanvas';

// Register a factory so importJSON can recreate the shape
dc.registerShapeFactory('star', () => new StarShape());
```

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `shapeAdded` | `{ shape }` | Fired when a shape is committed |
| `selectionChange` | `{ shape }` | Fired when the selected shape changes in `select` mode |
| `modeChange` | `{ mode }` | Fired when the active mode changes |
| `historyChange` | `{ canUndo, canRedo }` | Fired after undo / redo stack changes |
| `pan` | `{ dx, dy }` | Fired by `move` mode on each gesture move |

## License

Apache-2.0
