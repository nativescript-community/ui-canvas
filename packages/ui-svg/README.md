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

## Installation
Run the following command from the root of your project:

`ns plugin add @nativescript-community/ui-svg`


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
