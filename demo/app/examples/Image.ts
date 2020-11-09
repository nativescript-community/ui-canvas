import { ImageSource, Screen } from '@nativescript/core';
import { Folder, knownFolders, path } from '@nativescript/core/file-system';
import { Canvas, Paint, Style, createRect } from '@nativescript-community/ui-canvas';

const iconLocalFile: ImageSource = ImageSource.fromFileSync(path.join(knownFolders.currentApp().path, 'images/test.jpg'));

export function onNavigatedTo(args) {
    const page = args.object;
    page.bindingContext = args.context;
}

export function onDraw(args) {
    const canvas: Canvas = args.canvas;

    // const deviceScale = screen.mainScreen.scale;
    // canvas.scale(deviceScale, deviceScale); // always scale to device density to work with dp
    console.log('onDraw canvas:', canvas.getWidth(), canvas.getHeight());

    canvas.drawBitmap(iconLocalFile, null, createRect(0, 50, 200, 300), null);
}

export function onNavigationButtonTap(args) {
    args.object.page.frame.goBack();
}
