{{ load:../../tools/readme/edit-warning.md }}
{{ template:title }}
{{ template:badges }}
{{ template:description }}

{{ template:toc }}

## Installation
Run the following command from the root of your project:

`ns plugin add {{ pkg.name }}`

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

## NativeScript + Svelte

```ts
// app/app.ts
registerNativeViewElement('canvasView', () => require('@nativescript-community/ui-canvas').CanvasView);
```

```svelte
// app/components/Foo.svelte
<stackLayout>
    <canvasView width="300" height="300" on:draw={draw} />
</stackLayout>
```

## Draw Method 

```ts
import type { Canvas } from '@nativescript-community/ui-canvas';
import { Paint, createRect } from '@nativescript-community/ui-canvas';
import { Color } from '@nativescript/core';

function draw(event: { canvas: Canvas }) {
    const canvas = event.canvas;
    const paint = new Paint();
    paint.setColor(new Color('black'));
    paint.strokeWidth = 10;
    canvas.drawRect(createRect(0, 0, 200, 100), paint);
}
```

### Examples:

- [Simple](demo-snippets/vue/Simple.vue)
  - A basic example
- [Image](demo-snippets/vue/Image.vue)
  - An example drawing an image
- [Shapes](demo-snippets/vue/Shapes.vue)
  - An example drawing shapes using template
- [Animation](demo-snippets/vue/Animation.vue)
  - An example of animating a shape
- [Complex](demo-snippets/vue/Complex.vue)
  - An example of animating a shape

{{ load:../../tools/readme/demos-and-development.md }}
{{ load:../../tools/readme/questions.md }}
