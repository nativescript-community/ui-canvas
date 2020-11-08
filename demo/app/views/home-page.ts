import { fromObject } from '@nativescript/core';
export function onLoaded(args) {
    const page = args.object;
    console.log('onLoaded');

    page.bindingContext = fromObject({
        examples: [
            { title: 'Simple', moduleName: 'examples/Simple' },
            { title: 'Animation', moduleName: 'examples/Animation' },
            { title: 'Shapes', moduleName: 'examples/Shapes' },
            { title: 'Image', moduleName: 'examples/Image' },
        ],
    });
}

export function goToExample(args) {
    const page = args.object.page;

    console.log('goToExample');
    const entry = page.bindingContext.examples[args.index];
    page.frame.navigate({
        moduleName: entry.moduleName,
        context: entry,
        animated: true,
    });
}
