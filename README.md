[![npm](https://img.shields.io/npm/v/@nativescript-community/ui-canvas.svg)](https://www.npmjs.com/package/@nativescript-community/ui-canvas)
[![npm](https://img.shields.io/npm/dt/@nativescript-community/ui-canvas.svg?label=npm%20downloads)](https://www.npmjs.com/package/@nativescript-community/ui-canvas)
[![GitHub forks](https://img.shields.io/github/forks/nativescript-community/ui-canvas.svg)](https://github.com/nativescript-community/ui-canvas/network)
[![GitHub stars](https://img.shields.io/github/stars/nativescript-community/ui-canvas.svg)](https://github.com/nativescript-community/ui-canvas/stargazers)

## Installation

* `tns plugin add @nativescript-community/ui-canvas`

Be sure to run a new build after adding plugins to avoid any issues.

---


### Migration 

#### 2.x => 3.x

The `Shapes` component was removed, simply put your shapes directly under the `CanvasView`


### Usage

The nativescript Canvas is based on the [Android Canvas](https://developer.android.com/reference/android/graphics/Canvas) class.
The android API is actually a direct subclass with some Additions

## Plain NativeScript

<span style="color:red">IMPORTANT: </span>_Make sure you include `xmlns:cv="@nativescript-community/ui-canvas"` on the Page element_

### XML

```XML
<Page xmlns:cv="@nativescript-community/ui-canvas">
    <StackLayout horizontalAlignment="center">
        <cv:CanvasView width="100" height="100" draw="draw"/>
   </StackLayout>
</Page>
```

## NativeScript + Angular

```typescript
import { registerElement } from 'nativescript-angular/element-registry';
import { CanvasView } from '@nativescript-community/ui-canvas';
registerElement('CanvasView', () => CanvasView);
```

```html
<CanvasView width="100" height="100" (draw)="draw($event)></CanvasView>
```

## NativeScript + Vue

```javascript
import Vue from 'nativescript-vue';
import CanvasPlugin from '@nativescript-community/ui-canvas/vue';

Vue.use(CanvasPlugin);
```

```html
<CanvasView  width="100" height="100" @draw="draw"/>
```

##draw Method 
```typescript
function draw(event: { canvas: Canvas }) {
    const paint = new Paint();
    paint.setColor(new Color('black'));
    paint.strokeWidth = 10;
    canvas.drawRect(createRect(0, 0, 200, 100), paint);
}
```
