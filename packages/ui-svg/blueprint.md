{{ load:../../tools/readme/edit-warning.md }}
{{ template:title }}
{{ template:badges }}
{{ template:description }}

{{ template:toc }}

## Installation
Run the following command from the root of your project:

`ns plugin add {{ pkg.name }}`

## Configuration

For now only `vue` (and core) is supported.

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

### Examples:

- [Basic](demo-snippets/vue/SVG.vue)
  - A basic SVG example

{{ load:../../tools/readme/demos-and-development.md }}
{{ load:../../tools/readme/questions.md }}