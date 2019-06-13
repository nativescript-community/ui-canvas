import { Canvas, Cap, Paint, Path, RadialGradient, Rect, Style, TileMode } from 'nativescript-canvas';
import { Color } from 'tns-core-modules/color/color';
import { Folder, knownFolders, path } from 'tns-core-modules/file-system/file-system';
import { fromFile, ImageSource } from 'tns-core-modules/image-source/image-source';
import { isIOS } from 'tns-core-modules/ui/page/page';
import { FormattedString, Span } from 'tns-core-modules/text/formatted-string';
import { Label } from 'tns-core-modules/ui/label';

function isOnUiThread() {
    if (isIOS) {
        return NSOperationQueue.currentQueue === NSOperationQueue.mainQueue;
    } else {
        return android.os.Looper.myLooper() === android.os.Looper.getMainLooper();
    }
}

function createRect(x, y, w, h) {
    return new Rect(x, y, x + w, y + h);
}

export function drawOnImage(scale = 3, canvas?) {
    const folder: Folder = knownFolders.currentApp();

    const iconLocalFile: ImageSource = fromFile(path.join(folder.path, 'images/test.jpg'));
    if (!canvas) {
        const folderPath: string = path.join(folder.path, 'images/test.jpg');
        const imageFromLocalFile: ImageSource = fromFile(folderPath);
        canvas = new Canvas(imageFromLocalFile);
    }
    const bgPaint = new Paint();
    bgPaint.setColor(new Color('yellow'));
    bgPaint.strokeWidth = 10;

    const textPaint = new Paint();
    textPaint.color = new Color('red');
    textPaint.setStrokeWidth(3);
    textPaint.setTextSize(150);

    const width = canvas.getWidth();
    const height = canvas.getHeight();

    console.log('drawOnImage', isOnUiThread(), scale, width, height);

    const hW = width / 2;
    const hH = height / 2;

    const x = 0;
    const y = 0;

    canvas.scale(scale, scale);
    // rect
    canvas.save();
    canvas.translate(10, 10);
    canvas.drawRect(createRect(0, 0, 200, 100), bgPaint);
    bgPaint.setStyle(Style.STROKE);
    canvas.drawRect(createRect(0, 120, 200, 100), bgPaint);
    canvas.restore();

    // roundedrect
    canvas.save();
    canvas.translate(250, 10);
    bgPaint.setStyle(Style.FILL);
    bgPaint.setShadowLayer(30, 0, 2, 'blue');
    canvas.drawRoundRect(createRect(0, 0, 200, 100), 30, 30, bgPaint);
    bgPaint.clearShadowLayer();
    bgPaint.setStyle(Style.STROKE);
    canvas.drawRoundRect(createRect(0, 120, 200, 100), 30, 30, bgPaint);
    canvas.restore();

    canvas.save();

    canvas.translate(500, 10);
    bgPaint.color = 'blue';
    bgPaint.setStyle(Style.FILL);
    canvas.drawCircle(0, 50, 50, bgPaint);
    bgPaint.setStyle(Style.STROKE);
    canvas.drawCircle(120, 50, 50, bgPaint);
    canvas.restore();

    canvas.save();
    canvas.translate(700, 10);
    bgPaint.color = 'yellow';
    bgPaint.setStyle(Style.STROKE);
    bgPaint.setStrokeCap(Cap.ROUND);
    canvas.drawArc(createRect(0, 0, 100, 100), 90, 90, false, bgPaint);
    bgPaint.setStyle(Style.FILL);
    canvas.drawArc(createRect(100, 0, 100, 100), 90, 90, true, bgPaint);
    canvas.restore();

    // text
    canvas.save();
    canvas.translate(10, 250);
    canvas.drawText('Filled Text', 0, 150, textPaint);

    textPaint.setStyle(Style.STROKE);
    textPaint.setShadowLayer(30, 0, 2, 'blue');
    canvas.drawText('Stroke Text', 0, 300, textPaint);
    textPaint.clearShadowLayer();
    canvas.restore();

    // image
    canvas.save();
    canvas.translate(10, 600);
    // canvas.drawBitmap(iconLocalFile, 0, 0, null);
    canvas.drawBitmap(iconLocalFile, null, createRect(150, 0, 200, 300), null);
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

    canvas.drawPath(customPath, bgPaint);
    bgPaint.setStyle(Style.STROKE);
    canvas.translate(200, 0);
    canvas.drawPath(customPath, bgPaint);
    canvas.restore();

    // draw text along path
    customPath.reset();
    customPath.addArc(createRect(0, 0, 300, 300), 90, 180);
    canvas.save();
    canvas.translate(300, 600);
    textPaint.color = 'blue';
    textPaint.textSize = 30;
    textPaint.style = Style.STROKE;
    canvas.drawPath(customPath, bgPaint);
    canvas.drawTextOnPath('text on path', customPath, 0, 0, textPaint);
    canvas.restore();

    // render {N} view
    canvas.save();
    canvas.translate(100, 700);
    const label = new Label();
    label.backgroundColor = 'brown';
    label.color = new Color('yellow');
    label.textWrap = true;
    const formattedString = new FormattedString();
    const firstSpan = new Span();

    firstSpan.fontSize = 15;
    firstSpan.text =
        'Aliquip ex aliquip quis nisi ullamco esse pariatur commodo est amet aute aliquip quis dolor. Excepteur commodo elit consequat ut laborum ea elit cupidatat culpa cupidatat. Id commodo eu magna eu pariatur enim minim mollit. Ea cupidatat aute est Lorem do quis anim non consectetur elit minim occaecat veniam. Esse ex et nisi aute commodo. Nulla irure fugiat aliquip aliquip commodo enim pariatur labore.';
    formattedString.spans.push(firstSpan);
    label.formattedText = formattedString;
    canvas.drawView(label, createRect(0, 0, 100, 300));
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
