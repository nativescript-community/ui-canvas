<!-- ⚠️ This README has been generated from the file(s) "blueprint.md" ⚠️-->
<!--  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      DO NOT EDIT THIS READEME DIRECTLY! Edit "bluesprint.md" instead.
      !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! -->
<h1 align="center">@nativescript-community/ui-drawingcanvas</h1>
<p align="center">
		<a href="https://npmcharts.com/compare/@nativescript-community/ui-drawingcanvas?minimal=true"><img alt="Downloads per month" src="https://img.shields.io/npm/dm/@nativescript-community/ui-drawingcanvas.svg" height="20"/></a>
<a href="https://www.npmjs.com/package/@nativescript-community/ui-drawingcanvas"><img alt="NPM Version" src="https://img.shields.io/npm/v/@nativescript-community/ui-drawingcanvas.svg" height="20"/></a>
	</p>

<p align="center">
  <b>Interactive drawing canvas plugin for NativeScript – draw shapes, images and freehand paths with multiple modes, layers, undo/redo and JSON serialization.</b></br>
  <sub><sub>
</p>

<br />



[](#table-of-contents)

## Table of Contents

* [Features](#features)
* [Installation](#installation)
* [Usage](#usage)
	* [NativeScript Core / TypeScript](#nativescript-core--typescript)
	* [Vue (NativeScript-Vue)](#vue-nativescript-vue)
* [Drawing Modes](#drawing-modes)
* [Undo / Redo](#undo--redo)
* [Layer Management](#layer-management)
* [JSON Serialization](#json-serialization)
* [Path Simplification](#path-simplification)
* [Custom Modes](#custom-modes)
* [Custom Shape Types](#custom-shape-types)
* [Events](#events)
	* [Examples:](#examples)
* [Demos and Development](#demos-and-development)
	* [Repo Setup](#repo-setup)
	* [Build](#build)
	* [Demos](#demos)
* [Contributing](#contributing)
	* [Update repo ](#update-repo-)
	* [Update readme ](#update-readme-)
	* [Update doc ](#update-doc-)
	* [Publish](#publish)
	* [modifying submodules](#modifying-submodules)
* [Questions](#questions)

An interactive drawing canvas plugin for NativeScript, built on top of `@nativescript-community/ui-canvas`.


[](#features)

## Features

- **Multiple drawing modes**: pen/freehand, rectangle, ellipse, arrow, image placement, select/transform, and move (pan)
- **Layer management**: access shapes as an ordered list of layers – reorder, remove, duplicate
- **Undo / Redo**: full history with configurable depth
- **Shape selection & transform**: resize, rotate and move any shape with on-canvas handles
- **Colour & style**: stroke colour, fill colour, stroke width and opacity per shape
- **JSON serialization**: export the entire canvas to a compact JSON string and re-import it later
- **Path simplification**: automatic Douglas-Peucker + Catmull-Rom smoothing for pen strokes (configurable, extensible)
- **Extensible**: register custom drawing modes and custom shape types



[](#installation)

## Installation
Run the following command from the root of your project:

`ns plugin add @nativescript-community/ui-drawingcanvas`


[](#usage)

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


[](#drawing-modes)

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


[](#undo--redo)

## Undo / Redo

```typescript
dc.undo();
dc.redo();
console.log(dc.canUndo, dc.canRedo);

// Configure undo history depth (default: 50)
dc.maxUndoDepth = 30;
```


[](#layer-management)

## Layer Management

```typescript
const layers = dc.layers;          // DrawableShape[]
dc.moveLayerUp(shape);
dc.moveLayerDown(shape);
dc.duplicateShape(shape);
dc.removeLayer(shape);
```


[](#json-serialization)

## JSON Serialization

```typescript
const json = dc.exportJSON();
// later …
dc.importJSON(json);
```


[](#path-simplification)

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


[](#custom-modes)

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


[](#custom-shape-types)

## Custom Shape Types

```typescript
import { CustomShape } from '@nativescript-community/ui-drawingcanvas';

// Register a factory so importJSON can recreate the shape
dc.registerShapeFactory('star', () => new StarShape());
```


[](#events)

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `shapeAdded` | `{ shape }` | Fired when a shape is committed |
| `selectionChange` | `{ shape }` | Fired when the selected shape changes in `select` mode |
| `modeChange` | `{ mode }` | Fired when the active mode changes |
| `historyChange` | `{ canUndo, canRedo }` | Fired after undo / redo stack changes |
| `pan` | `{ dx, dy }` | Fired by `move` mode on each gesture move |

### Examples:

- [Basic](demo-snippets/vue/DrawingCanvas.vue)
  - A basic Drawing example


[](#demos-and-development)

## Demos and Development


### Repo Setup

The repo uses submodules. If you did not clone with ` --recursive` then you need to call
```
git submodule update --init
```

The package manager used to install and link dependencies must be `pnpm` or `yarn`. `npm` wont work.

To develop and test:
if you use `yarn` then run `yarn`
if you use `pnpm` then run `pnpm i`

**Interactive Menu:**

To start the interactive menu, run `npm start` (or `yarn start` or `pnpm start`). This will list all of the commonly used scripts.

### Build

```bash
npm run build.all
```
WARNING: it seems `yarn build.all` wont always work (not finding binaries in `node_modules/.bin`) which is why the doc explicitly uses `npm run`

### Demos

```bash
npm run demo.[ng|react|svelte|vue].[ios|android]

npm run demo.svelte.ios # Example
```

Demo setup is a bit special in the sense that if you want to modify/add demos you dont work directly in `demo-[ng|react|svelte|vue]`
Instead you work in `demo-snippets/[ng|react|svelte|vue]`
You can start from the `install.ts` of each flavor to see how to register new demos 


[](#contributing)

## Contributing

### Update repo 

You can update the repo files quite easily

First update the submodules

```bash
npm run update
```

Then commit the changes
Then update common files

```bash
npm run sync
```
Then you can run `yarn|pnpm`, commit changed files if any

### Update readme 
```bash
npm run readme
```

### Update doc 
```bash
npm run doc
```

### Publish

The publishing is completely handled by `lerna` (you can add `-- --bump major` to force a major release)
Simply run 
```shell
npm run publish
```

### modifying submodules

The repo uses https:// for submodules which means you won't be able to push directly into the submodules.
One easy solution is t modify `~/.gitconfig` and add
```
[url "ssh://git@github.com/"]
	pushInsteadOf = https://github.com/
```


[](#questions)

## Questions

If you have any questions/issues/comments please feel free to create an issue or start a conversation in the [NativeScript Community Discord](https://nativescript.org/discord).