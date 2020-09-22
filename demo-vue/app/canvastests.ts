import { Align, Canvas, Cap, DashPathEffect, LinearGradient, Paint, Path, RadialGradient, Rect, RectF, Style, TileMode, createRect, createRectF } from '@nativescript-community/ui-canvas';
import { Color } from '@nativescript/core/color';
import { Folder, knownFolders, path } from '@nativescript/core/file-system';
import { ImageSource } from '@nativescript/core/image-source';
import { Button } from '@nativescript/core/ui/button';
import { FormattedString } from '@nativescript/core/text/formatted-string';
import { Span } from '@nativescript/core/text/span';
import { Label, Utils } from '@nativescript/core';

function isOnUiThread() {
    if (global.isIOS) {
        return NSOperationQueue.currentQueue === NSOperationQueue.mainQueue;
    } else {
        return android.os.Looper.myLooper() === android.os.Looper.getMainLooper();
    }
}

export function drawOnImage(scale = 3, canvas?: Canvas) {
    const folder: Folder = knownFolders.currentApp();

    const iconLocalFile: ImageSource = ImageSource.fromFileSync(path.join(folder.path, 'images/test.jpg'));
    if (!canvas) {
        const folderPath: string = path.join(folder.path, 'images/test.jpg');
        const imageFromLocalFile: ImageSource = ImageSource.fromFileSync(folderPath);
        canvas = new Canvas(imageFromLocalFile);
    }

    const bgPaint = new Paint();

    bgPaint.setColor(new Color('yellow'));
    bgPaint.setAntiAlias(true);
    bgPaint.strokeWidth = 10;

    const textPaint = new Paint();
    // textPaint.setAntiAlias(true);
    textPaint.color = new Color('red');
    textPaint.setStrokeWidth(3);
    textPaint.setAntiAlias(true);

    const width = canvas.getWidth();
    const height = canvas.getHeight();

    console.log('drawOnImage', isOnUiThread(), scale, width, height);
    const padding = 10;
    const w = width - 4 * padding;
    const h = height - 4 * padding;

    const hW = w / 2;
    const hH = h / 2;
    textPaint.setTextSize(hH / 2);

    const x = 0;
    const y = 0;

    canvas.scale(scale, scale);
    // rect
    canvas.save();
    canvas.translate(padding, padding);
    canvas.drawRect(createRect(0, 0, hW, hH / 2), bgPaint);
    bgPaint.setStyle(Style.STROKE);
    canvas.drawRect(createRect(0, hH / 2 + 2 * padding, hW, hH / 2), bgPaint);
    canvas.restore();

    // roundedrect
    canvas.save();
    canvas.translate(hW + 3 * padding, padding);

    bgPaint.setStyle(Style.FILL);
    bgPaint.setShader(new LinearGradient(0, 0, 0, hH / 2, 'red' as any, 'green' as any, TileMode.CLAMP));
    canvas.drawRoundRect(createRectF(0, 0, hW, hH / 2), 30, 30, bgPaint);
    bgPaint.setShader(null);
    bgPaint.setStyle(Style.STROKE);
    bgPaint.setShadowLayer(4, 0, 2, 'blue');
    bgPaint.setPathEffect(new DashPathEffect([6, 4], 0));
    canvas.drawRoundRect(0, hH / 2 + 2 * padding, hW, hH / 2 + hH / 2 + 2 * padding, 30, 30, bgPaint);
    bgPaint.clearShadowLayer();
    bgPaint.setPathEffect(null);

    const paintLine = new Paint();
    paintLine.setStrokeWidth(10);
    // paintLine.setStyle(Style.STROKE);
    canvas.drawLine(0, 0, 100, 10, paintLine);
    canvas.restore();

    canvas.save();

    canvas.translate(500, padding);
    bgPaint.color = 'blue';
    bgPaint.setStyle(Style.FILL);
    canvas.drawCircle(0, 50, 50, bgPaint);
    bgPaint.setStyle(Style.STROKE);
    canvas.drawCircle(120, 50, 50, bgPaint);
    canvas.restore();

    canvas.save();
    canvas.translate(700, padding);
    bgPaint.color = 'yellow';
    bgPaint.setStyle(Style.STROKE);
    bgPaint.setStrokeCap(Cap.ROUND);
    canvas.drawArc(createRectF(0, 0, 100, 100), 90, 90, false, bgPaint);
    bgPaint.setStyle(Style.FILL);
    canvas.drawArc(createRectF(100, 0, 100, 100), 90, 90, true, bgPaint);
    canvas.restore();

    // text
    canvas.save();
    bgPaint.color = 'black';
    bgPaint.setStrokeWidth(5);
    canvas.translate(padding, hH / 2 + padding);
    canvas.drawText('Filled Text', 0, 0, textPaint);

    textPaint.setStyle(Style.STROKE);
    textPaint.setTextAlign(Align.RIGHT);
    // textPaint.setShadowLayer(30, 0, 2, 'blue');
    paintLine.setPathEffect(new DashPathEffect([6, 4], 0));
    canvas.drawLines([width - padding - 100, 100, width - padding, 100], paintLine);
    // textPaint.setFontFamily('Open Sans,OpenSans-Regular');
    canvas.drawText('Stroke Text', width - padding, 100, textPaint);
    // textPaint.clearShadowLayer();
    canvas.restore();
    textPaint.setTextAlign(Align.LEFT);

    // image
    canvas.save();
    canvas.translate(10, 600);
    // canvas.drawBitmap(iconLocalFile, 0, 0, null);
    canvas.drawBitmap(iconLocalFile, null, createRect(150, 0, 200, 300), null);
    canvas.restore();

    // arc path
    canvas.save();
    canvas.translate(300, 120);
    bgPaint.color = 'orange';
    const arcPath = new Path();

    arcPath.arcTo(new RectF(18.0, 25.640625, 282.0, 289.64062), 536.2781166253037, 93.72188337469629);
    arcPath.lineTo(150, 157.640625);
    arcPath.close();
    canvas.drawPath(arcPath, bgPaint);

    canvas.restore();

    // custom path
    canvas.save();
    canvas.translate(500, 120);
    bgPaint.color = 'green';
    const customPath = new Path();
    let mid = 100;
    const min = 200;
    const fat = min / 17;
    const half = min / 2;
    const rad = half - fat;
    mid = mid - half;
    // top left
    customPath.moveTo(mid + half * 0.5, half * 0.84);
    // top right
    customPath.lineTo(mid + half * 1.5, half * 0.84);
    // bottom left
    customPath.lineTo(mid + half * 0.68, half * 1.45);
    // top tip
    customPath.lineTo(mid + half * 1.0, half * 0.5);
    // bottom right
    customPath.lineTo(mid + half * 1.32, half * 1.45);
    // top left
    customPath.lineTo(mid + half * 0.5, half * 0.84);
    customPath.close();

    bgPaint.setShadowLayer(30, 0, 2, 'red');
    canvas.drawPath(customPath, bgPaint);
    bgPaint.clearShadowLayer();
    bgPaint.setStyle(Style.STROKE);
    canvas.translate(200, 0);
    canvas.drawPath(customPath, bgPaint);
    canvas.restore();

    // draw text along path
    customPath.reset();
    customPath.addArc(createRectF(0, 0, 300, 300), 90, 180);
    canvas.save();
    canvas.translate(300, 100);
    textPaint.color = 'green';

    textPaint.textSize = 65;
    textPaint.style = Style.FILL;
    bgPaint.color = 'blue';
    canvas.drawPath(customPath, bgPaint);
    canvas.drawTextOnPath('text on path', customPath, 0, 0, textPaint);
    canvas.restore();

    canvas.save();
    canvas.translate(30, 200);
    const fontMetrics = textPaint.getFontMetrics();
    console.log('fontMetrics', fontMetrics.descent - fontMetrics.ascent, fontMetrics.ascent, fontMetrics.bottom, fontMetrics.descent, fontMetrics.leading, fontMetrics.top);
    const rect = new Rect(0, 0, 0, 0);
    textPaint.getTextBounds('A', 0, 1, rect);
    console.log('textBounds', rect.top, rect.left, rect.width(), rect.height());
    canvas.drawRect(rect, bgPaint);
    canvas.drawText('A', 0, 0, textPaint);

    // console.log('getTextBounds', rect.width(), rect.height());
    // textPaint.getTextBounds('a', 0, 1, rect);
    // console.log('getTextBounds2', rect.width(), rect.height());
    // const tpath = new Path();
    // const rectf = new RectF(0, 0, 0, 0);
    // textPaint.getTextPath('A', 0, 1, 0.0, 0.0, tpath);
    // tpath.computeBounds(rectf, true);
    // console.log('computeBounds', rectf.width(), rectf.height());
    canvas.restore();

    canvas.save();
    canvas.translate(30, 280);

    // console.log('getTextBounds', rect.width(), rect.height());
    // textPaint.getTextBounds('a', 0, 1, rect);
    // console.log('getTextBounds2', rect.width(), rect.height());
    const tpath = new Path();
    const rectf = new RectF(0, 0, 0, 0);
    textPaint.getTextPath('A', 0, 1, 0.0, 0.0, tpath);
    tpath.computeBounds(rectf, true);
    canvas.drawRect(rectf, bgPaint);
    canvas.drawPath(tpath, textPaint);
    // console.log('computeBounds', rectf.width(), rectf.height());
    canvas.restore();

    // render {N} view
    canvas.save();
    canvas.translate(padding, 5 * padding + hH);
    const label = new Label();
    label.backgroundColor = 'brown';
    label.color = new Color('yellow');
    label.textWrap = true;
    // const formattedString = new FormattedString();
    // const firstSpan = new Span();

    label.fontSize = Utils.layout.toDeviceIndependentPixels(105 * scale);
    // label.text = 'test';
    label.text =
        'Aliquip ex aliquip quis nisi ullamco esse pariatur commodo est amet aute aliquip quis dolor. Excepteur commodo elit consequat ut laborum ea elit cupidatat culpa cupidatat. Id commodo eu magna eu pariatur enim minim mollit. Ea cupidatat aute est Lorem do quis anim non consectetur elit minim occaecat veniam. Esse ex et nisi aute commodo. Nulla irure fugiat aliquip aliquip commodo enim pariatur labore.';
    // formattedString.spans.push(firstSpan);
    // label.formattedText = formattedString;
    canvas.drawView(label, createRect(0, 0, hW, hH / 2));
    canvas.restore();

    canvas.save();
    canvas.translate(300, 700);
    const gradient = new RadialGradient(0, 0, 50, 'red' as any, 'green' as any, TileMode.CLAMP);
    const p = new Paint();
    p.setDither(true);
    p.setShader(gradient);
    canvas.drawCircle(0, 0, 50, p);
    canvas.restore();

    return canvas.getImage();
}
