import { Color, Screen, fromObject } from '@nativescript/core';
import { Canvas, Paint, Style, createRect } from '@nativescript-community/ui-canvas';
import TWEEN from '@nativescript-community/tween';

export function onNavigatedTo(args) {
    const page = args.object;

    page.bindingContext = fromObject({
        title: args.context.title,
        shapeColor: 'blue',
        // TODO: Implement shape data binding for NativeScript Core
        // antiAlias: true,
        // hardwareAccelerated: false,
        // shapeLeft: 10,
        // sweepAngle: 0,
        // arcWidth: Math.min(Screen.mainScreen.widthDIPs, Screen.mainScreen.heightDIPs) - 40,
        //density: Screen.mainScreen.scale,
    });
}

export function changeColor(args) {
    const page = args.object.page;
    const vm = page.bindingContext;

    const view = page.getViewById('canvas');
    const rect = view.shapes.getItem(0);

    vm.shapeColor = (vm.shapeColor === 'blue' ? 'yellow' : 'blue');
    rect.fillColor = vm.shapeColor;
}

export function animateRectSize(args) {
    const page = args.object.page;
    const view = page.getViewById('canvas');
    const rect = view.shapes.getItem(0);
    new TWEEN.Tween({ value: 10 })
        .to({ value: 40 }, 5000)
        .easing(TWEEN.Easing.Quadratic.Out)
        .onUpdate(obj => {
            rect.left = obj.value;
            rect.width = rect.left + '%';
        })
        .start(0);
}

export function animateArc(args) {
    const page = args.object.page;
    const view = page.getViewById('canvas');
    const arc = view.shapes.getItem(1);
    new TWEEN.Tween({ value: 0 })
        .to({ value: 360 }, 5000)
        .onUpdate(obj => {
            arc.sweepAngle = obj.value;
        })
        .start(0);
}

export function onCanvasViewLoaded(args) {
    const view = args.object;
    view.density = Screen.mainScreen.scale;
    const arc = view.shapes.getItem(1);

    const arcWidth = Math.min(Screen.mainScreen.widthDIPs, Screen.mainScreen.heightDIPs) - 40;

    arc.width = arcWidth;
    arc.height = arcWidth;
    arc.sweepAngle = 0;
}

export function onDraw(args) {
}

export function onSliderLoaded(args) {
    const slider = args.object;
    slider.value = Screen.mainScreen.scale;
    slider.on('valueChange', onValueChange);
}

export function onValueChange(args) {
    const view = args.object;
    const canvasView = view.page.getViewById('canvas');

    switch (view.id) {
        case 'density':
            canvasView.density = view.value;
            break;
        case 'anti-alias':
            const arc = canvasView.shapes.getItem(1);
            const text1 = canvasView.shapes.getItem(2);
            const text2 = canvasView.shapes.getItem(3);
            const text3 = canvasView.shapes.getItem(4);

            arc.antiAlias = text1.antiAlias = text2.antiAlias = text3.antiAlias = (view.checked ? true : false);
            break;
        case 'hardware-accelerated':
            canvasView.hardwareAccelerated = view.checked ? true : false;
            break;
    }
}

export function onNavigationButtonTap(args) {
    args.object.page.frame.goBack();
}
