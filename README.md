[![npm](https://img.shields.io/npm/v/nativescript-canvas.svg)](https://www.npmjs.com/package/nativescript-canvas)
[![npm](https://img.shields.io/npm/dt/nativescript-canvas.svg?label=npm%20downloads)](https://www.npmjs.com/package/nativescript-canvas)
[![GitHub forks](https://img.shields.io/github/forks/Akylas/nativescript-canvas.svg)](https://github.com/Akylas/nativescript-canvas/network)
[![GitHub stars](https://img.shields.io/github/stars/Akylas/nativescript-canvas.svg)](https://github.com/Akylas/nativescript-canvas/stargazers)

## Installation

* `tns plugin add nativescript-canvas`

Be sure to run a new build after adding plugins to avoid any issues.

---


### Usage

The nativescript Canvas is based on the [Android Canvas](https://developer.android.com/reference/android/graphics/Canvas) class.
The android API is actually a direct subclass with some Additions

## Plain NativeScript

<span style="color:red">IMPORTANT: </span>_Make sure you include `xmlns:mdc="nativescript-canvas"` on the Page element_

### XML

```XML
<Page xmlns:cv="nativescript-canvas">
    <StackLayout horizontalAlignment="center">
        <cv:CanvasView width="100" height="100"/>
   </StackLayout>
</Page>
```

## NativeScript + Angular

```typescript
import { registerElement } from 'nativescript-angular/element-registry';
import { CanvasView } from 'nativescript-canvas';
registerElement('CanvasView', () => CanvasView);
```

```html
<CanvasView width="100" height="100"></MDCCardView>
```

## NativeScript + Vue

```javascript
import Vue from 'nativescript-vue';
import CardViewPlugin from 'nativescript-canvas/vue';

Vue.use(CardViewPlugin);
```

```html
<CanvasView  width="100" height="100"/>
```
