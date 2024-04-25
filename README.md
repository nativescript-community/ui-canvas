<!-- ⚠️ This README has been generated from the file(s) "blueprint.md" ⚠️-->This monorepo contains multiple packages:<br><br><details>
<summary><b>ui-canvas</b></summary>
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


[](#installation)

## Installation
Run the following command from the root of your project:

`ns plugin add @nativescript-community/ui-canvas`

### Usage

The nativescript Canvas is based on the [Android Canvas](https://developer.android.com/reference/android/graphics/Canvas) class.
The android API is actually a direct subclass with some Additions


[](#plain-nativescript)


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


[](#questions)

## Questions

If you have any questions/issues/comments please feel free to create an issue or start a conversation in the [NativeScript Community Discord](https://nativescript.org/discord).

</details><details>
<summary><b>ui-canvaslabel</b></summary>
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
<h1 align="center">@nativescript-community/ui-canvaslabel</h1>
<p align="center">
		<a href="https://npmcharts.com/compare/@nativescript-community/ui-canvaslabel?minimal=true"><img alt="Downloads per month" src="https://img.shields.io/npm/dm/@nativescript-community/ui-canvaslabel.svg" height="20"/></a>
<a href="https://www.npmjs.com/package/@nativescript-community/ui-canvaslabel"><img alt="NPM Version" src="https://img.shields.io/npm/v/@nativescript-community/ui-canvaslabel.svg" height="20"/></a>
	</p>

<p align="center">
  <b>Alternative to the built-in NativeScript Label but uses canvas which allows extreme complexity and customization.</b></br>
  <sub><sub>
</p>

<br />



[](#table-of-contents)


[](#table-of-contents)

## Table of Contents

* [Installation](#installation)
* [Configuration](#configuration)
* [Performances](#performances)
* [TODO / Limitations](#todo--limitations)
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

A NativeScript Label widget. This widget takes a different approch from other label components. It is based on `nativescript-canvas` and allows drawing
multiple labels within one single widget.
It allows extreme complexity and customization.


[](#installation)


[](#installation)

## Installation
Run the following command from the root of your project:

`ns plugin add @nativescript-community/ui-canvaslabel`


[](#configuration)


[](#configuration)

## Configuration
It works almost like a normal label.
You can create spans, just like with the {N} labels. However there is a big difference with the {N} component.
`CSpan` do not support css class and never will! It was actually made on purpose to make to make the component much more efficient.

For now `CanvasLabel` do not auto size itself. I will add some way of doing it in the future but in a sense it defies the purpose of this component.

The `CanvasLabel` component supports most labels properties:
`color`, `fontSize`,`fontFamily`,`fontStyle`, `fontWeight`,`textAlignment`. Those can be defined through css.

Now with `CanvasLabel` you don't set the text directly. Instead you create `CSpan` or `CGroup`

Here is a complex Vue layout as an example
```html
<CanvasLabel id="canvaslabel" fontSize="10" color="white" backgroundColor="darkgray">
    <CGroup fontSize="18" verticalAlignment="middle" paddingLeft="20">
        <CSpan :text="item.text1" fontWeight="bold" />
        <CSpan :text="'\n' + item.text2" color="#ccc" fontSize="16" />
    </CGroup>

    <CGroup fontSize="12" verticalAlignment="bottom" paddingLeft="20" paddingBottom="1">
        <CSpan :text="item.icon1" fontSize="20" color="green" :fontFamily="mdiFontFamily" />
        <CSpan :text="' ' + item.texticon1" verticalTextAlignment="center" />
        <CSpan :text="'   ' + item.icon2" fontSize="20" color="red" :fontFamily="mdiFontFamily" />
        <CSpan :text="' ' + item.texticon2" verticalTextAlignment="center" />
        <CSpan :text="'   ' + item.icon3" fontSize="20" color="yellow" :fontFamily="mdiFontFamily" />
        <CSpan :text="' ' + item.texticon3" verticalTextAlignment="center" />
    </CGroup>

    <CGroup fontSize="12" verticalAlignment="middle" horizontalAlignment="center" textAlignment="right" paddingRight="20" color="brown" width="60">
        <CSpan :text="item.icon1" fontSize="14" :fontFamily="mdiFontFamily" />
        <CSpan :text="'\n' + item.texticon1" paddingRight="10" />
    </CGroup>
    <CSpan :text="item.text4" color="lightgray" fontSize="14" textAlignment="right" paddingRight="20" paddingTop="4" />
</CanvasLabel>
```

For full example / doc look at the vue demo and the typings.


[](#performances)


[](#performances)

## Performances

`CanvasLabel` is made to be real fast. It was designed principaly to be used within list views. It uses the technique of drawing the text directly instead of using heavy native text components.
That technique is used by many apps looking for the best performances. One of the best examples is Telegram.


[](#todo--limitations)


[](#todo--limitations)

## TODO / Limitations

* For now there is no accessibility support (but it should be possible)
* The label can't size itself. I will add some ways of doing that. But possibly not in the way you are used to.
* no ellipsize support yet. Will come ([this](https://github.com/lsjwzh/FastTextView/blob/5e440575539ab1f470d853b1e7462fe0251eb869/widget.FastTextView/src/main/java/android/text/EllipsisSpannedContainer.java) could be a solution)
* a lot of canvas features can be added like shadows, gradient ...
* transform supoort should be possible at least for groups and top spans.

### Examples:

- [Basic](demo-snippets/vue/CanvasLabel.vue)
  - A basic SVG example


[](#demos-and-development)


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


[](#questions)

## Questions

If you have any questions/issues/comments please feel free to create an issue or start a conversation in the [NativeScript Community Discord](https://nativescript.org/discord).
</details><details>
<summary><b>ui-svg</b></summary>
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
<h1 align="center">@nativescript-community/ui-svg</h1>
<p align="center">
		<a href="https://npmcharts.com/compare/@nativescript-community/ui-svg?minimal=true"><img alt="Downloads per month" src="https://img.shields.io/npm/dm/@nativescript-community/ui-svg.svg" height="20"/></a>
<a href="https://www.npmjs.com/package/@nativescript-community/ui-svg"><img alt="NPM Version" src="https://img.shields.io/npm/v/@nativescript-community/ui-svg.svg" height="20"/></a>
	</p>

<p align="center">
  <b>Adds support for SVGs in your NativeScript apps.</b></br>
  <sub><sub>
</p>

<br />



[](#table-of-contents)


[](#table-of-contents)

## Table of Contents

* [Installation](#installation)
* [Configuration](#configuration)
	* [NativeScript + Vue](#nativescript--vue)
	* [NativeScript + Svelte](#nativescript--svelte)
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


[](#installation)

## Installation
Run the following command from the root of your project:

`ns plugin add @nativescript-community/ui-svg`


[](#configuration)


[](#configuration)

## Configuration

For now only `vue` (and core) is supported.

### NativeScript + Vue

```ts
import CanvasSVG from '@nativescript-community/ui-svg/vue';
Vue.use(CanvasSVG);
```

It works in 3 ways!.

`CanvasSVG` extending `Canvas`

```html
<CanvasSVG>
    <CSVG horizontalAlignment="left" src="~/assets/svgs/Ghostscript_Tiger.svg" height="100%" stretch="aspectFit" />
</CanvasSVG>
```

or `SVGView` which is a basic svg view with support for auto sizing

```html
<SVGView height="30%" src="~/assets/svgs/Ghostscript_Tiger.svg" stretch="aspectFit" backgroundColor="red" />
```

Or within and Canvas View extending `CanvasView` like `CanvasLabel`

```html
<CanvasLabel>
 <CGroup fontSize="18" verticalAlignment="middle" paddingLeft="20">
        <CSpan text="test" fontWeight="bold" />
        <CSpan text="test2" color="#ccc" fontSize="16" />
    </CGroup>
    <CSVG horizontalAlignment="left" src="~/assets/svgs/Ghostscript_Tiger.svg" height="10" stretch="aspectFit" />
</CanvasSVG>
```

### NativeScript + Svelte

```ts
// app/app.ts
import { registerNativeViewElement } from 'svelte-native/dom';
registerNativeViewElement('svgView', () => require('@nativescript-community/ui-svg').SVGView);
```

```svelte
<!-- app/components/Foo.svelte -->
<svgView src="~/assets/foo.svg" aspectFit="stretch" />
```

### Examples:

- [Basic](demo-snippets/vue/SVG.vue)
  - A basic SVG example


[](#demos-and-development)


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


[](#questions)

## Questions

If you have any questions/issues/comments please feel free to create an issue or start a conversation in the [NativeScript Community Discord](https://nativescript.org/discord).

</details>

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