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
<h1 align="center">@nativescript-community/ui-canvas</h1>
<p align="center">
		<a href="https://npmcharts.com/compare/@nativescript-community/ui-canvas?minimal=true"><img alt="Downloads per month" src="https://img.shields.io/npm/dm/@nativescript-community/ui-canvas.svg" height="20"/></a>
<a href="https://www.npmjs.com/package/@nativescript-community/ui-canvas"><img alt="NPM Version" src="https://img.shields.io/npm/v/@nativescript-community/ui-canvas.svg" height="20"/></a>
	</p>

<p align="center">
  <b>Implement Canvas into your NativeScript apps.</b></br>
  <sub><sub>
</p>

<br />



[](#table-of-contents)

## Table of Contents

* [Installation](#installation)
	* [Usage](#usage)
* [Plain NativeScript](#plain-nativescript)
	* [XML](#xml)
* [NativeScript + Angular](#nativescript--angular)
* [NativeScript + Vue](#nativescript--vue)
* [NativeScript + Svelte](#nativescript--svelte)
* [Draw Method ](#draw-method-)
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


[](#installation)

## Installation
Run the following command from the root of your project:

`ns plugin add @nativescript-community/ui-canvas`

### Usage

The nativescript Canvas is based on the [Android Canvas](https://developer.android.com/reference/android/graphics/Canvas) class.
The android API is actually a direct subclass with some Additions


[](#plain-nativescript)

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


[](#nativescript--angular)

## NativeScript + Angular

```typescript
import { registerElement } from 'nativescript-angular/element-registry';
import { CanvasView } from '@nativescript-community/ui-canvas';
registerElement('CanvasView', () => CanvasView);
```

```html
<CanvasView width="100" height="100" (draw)="draw($event)></CanvasView>
```


[](#nativescript--vue)

## NativeScript + Vue

```javascript
import Vue from 'nativescript-vue';
import CanvasPlugin from '@nativescript-community/ui-canvas/vue';

Vue.use(CanvasPlugin);
```

```html
<CanvasView  width="100" height="100" @draw="draw"/>
```


[](#nativescript--svelte)

## NativeScript + Svelte

```ts
// app/app.ts
import { registerNativeViewElement } from 'svelte-native/dom';
registerNativeViewElement('canvasView', () => require('@nativescript-community/ui-canvas').CanvasView);
```

```svelte
<!-- app/components/Foo.svelte -->
<stackLayout>
    <canvasView width="300" height="300" on:draw={draw} />
</stackLayout>
```


[](#draw-method-)

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
