# NativeScript Label widget
[![npm downloads](https://img.shields.io/npm/dm/@nativescript-community/ui-canvaslabel.svg)](https://www.npmjs.com/package/@nativescript-community/ui-canvaslabel)
[![npm downloads](https://img.shields.io/npm/dt/@nativescript-community/ui-canvaslabel.svg)](https://www.npmjs.com/package/@nativescript-community/ui-canvaslabel)
[![npm](https://img.shields.io/npm/v/@nativescript-community/ui-canvaslabel.svg)](https://www.npmjs.com/package/@nativescript-community/ui-canvaslabel)

A NativeScript Label widget. This widget takes a different approch from other label components. It is based on `nativescript-canvas` and allows drawing
multiple labels within one single widget.
It allows extreme complexity and customization.

## Installation
Run the following command from the root of your project:

`tns plugin add @nativescript-community/ui-canvaslabel`

This command automatically installs the necessary files, as well as stores @nativescript-community/ui-canvaslabel as a dependency in your project's package.json file.

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

## Performances

`CanvasLabel` is made to be real fast. It was designed principaly to be used within list views. It uses the technique of drawing the text directly instead of using heavy native text components.
That technique is used by many apps looking for the best performances. One of the best examples is Telegram.

## TODO / Limitations

* For now there is no accessibility support (but it should be possible)
* The label can't size itself. I will add some ways of doing that. But possibly not in the way you are used to.
* no ellipsize support yet. Will come ([this](https://github.com/lsjwzh/FastTextView/blob/5e440575539ab1f470d853b1e7462fe0251eb869/widget.FastTextView/src/main/java/android/text/EllipsisSpannedContainer.java) could be a solution)
* a lot of canvas features can be added like shadows, gradient ...
* transform supoort should be possible at least for groups and top spans.