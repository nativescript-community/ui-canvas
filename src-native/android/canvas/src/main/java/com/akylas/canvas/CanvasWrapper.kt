package com.akylas.canvas

import android.graphics.*
import android.graphics.Canvas
import android.graphics.Matrix

interface ICanvas {

    fun isHardwareAccelerated(): Boolean
    fun setBitmap(bitmap: Bitmap)
    fun isOpaque(): Boolean

    fun getWidth(): Int

    fun getHeight(): Int

    fun getDensity(): Int

    fun setDensity(density: Int)

    fun getMaximumBitmapWidth(): Int

    fun getMaximumBitmapHeight(): Int

    fun save(): Int


    @Deprecated("")
    fun save(saveFlags: Int): Int


    @Deprecated("")
    fun saveLayer(bounds: RectF, paint: Paint, saveFlags: Int): Int

    fun saveLayer(bounds: RectF, paint: Paint): Int

    @Deprecated("")
    fun saveLayer(left: Float, top: Float, right: Float, bottom: Float, paint: Paint, saveFlags: Int): Int

    fun saveLayer(left: Float, top: Float, right: Float, bottom: Float, paint: Paint): Int


    @Deprecated("")
    fun saveLayerAlpha(bounds: RectF, alpha: Int, saveFlags: Int): Int

    fun saveLayerAlpha(bounds: RectF, alpha: Int): Int


    @Deprecated("")
    fun saveLayerAlpha(left: Float, top: Float, right: Float, bottom: Float, alpha: Int, saveFlags: Int): Int

    fun saveLayerAlpha(left: Float, top: Float, right: Float, bottom: Float, alpha: Int): Int

    fun restore()

    fun getSaveCount(): Int

    fun restoreToCount(saveCount: Int)

    fun translate(dx: Float, dy: Float)

    fun scale(sx: Float, sy: Float)

    fun scale(sx: Float, sy: Float, px: Float, py: Float)

    fun rotate(degrees: Float)

    fun rotate(degrees: Float, px: Float, py: Float)

    fun skew(sx: Float, sy: Float)

    fun concat(matrix: Matrix)

    fun setMatrix(matrix: Matrix)

    @Deprecated("")
    fun getMatrix(ctm: Matrix)


    @Deprecated("")
    fun getMatrix(): Matrix


    @Deprecated("")
    fun clipRect(rect: RectF, op: Region.Op): Boolean

    @Deprecated("")
    fun clipRect(rect: Rect, op: Region.Op): Boolean

    fun clipRect(rect: RectF): Boolean

    fun clipOutRect(rect: RectF): Boolean

    fun clipRect(rect: Rect): Boolean
    fun clipOutRect(rect: Rect): Boolean

    @Deprecated("")
    fun clipRect(left: Float, top: Float, right: Float, bottom: Float, op: Region.Op): Boolean

    fun clipRect(left: Float, top: Float, right: Float, bottom: Float): Boolean

    fun clipOutRect(left: Float, top: Float, right: Float, bottom: Float): Boolean

    fun clipRect(left: Int, top: Int, right: Int, bottom: Int): Boolean
    fun clipOutRect(left: Int, top: Int, right: Int, bottom: Int): Boolean


    @Deprecated("")
    fun clipPath(path: Path, op: Region.Op): Boolean

    fun clipPath(path: Path): Boolean
    fun clipOutPath(path: Path): Boolean

    fun getDrawFilter(): DrawFilter

    fun setDrawFilter(filter: DrawFilter)

    fun quickReject(rect: RectF, type: Canvas.EdgeType): Boolean

    fun quickReject(path: Path, type: Canvas.EdgeType): Boolean

    fun quickReject(left: Float, top: Float, right: Float, bottom: Float, type: Canvas.EdgeType): Boolean
    fun getClipBounds(bounds: Rect): Boolean

    fun getClipBounds(): Rect

    fun drawPicture(picture: Picture)

    fun drawPicture(picture: Picture, dst: RectF)

    fun drawPicture(picture: Picture, dst: Rect)

    fun drawArc(oval: RectF, startAngle: Float, sweepAngle: Float, useCenter: Boolean, paint: Paint)

    fun drawArc(left: Float, top: Float, right: Float, bottom: Float, startAngle: Float, sweepAngle: Float, useCenter: Boolean, paint: Paint)
    fun drawARGB(a: Int, r: Int, g: Int, b: Int)

    fun drawBitmap(bitmap: Bitmap, left: Float, top: Float, paint: Paint)

    fun drawBitmap(bitmap: Bitmap, src: Rect, dst: RectF, paint: Paint)

    fun drawBitmap(bitmap: Bitmap, src: Rect, dst: Rect, paint: Paint)

    @Deprecated("")
    fun drawBitmap(colors: IntArray, offset: Int, stride: Int, x: Float, y: Float, width: Int, height: Int, hasAlpha: Boolean, paint: Paint)

    @Deprecated("")
    fun drawBitmap(colors: IntArray, offset: Int, stride: Int, x: Int, y: Int, width: Int, height: Int, hasAlpha: Boolean, paint: Paint)

    fun drawBitmap(bitmap: Bitmap, matrix: Matrix, paint: Paint)

    fun drawBitmapMesh(bitmap: Bitmap, meshWidth: Int, meshHeight: Int, verts: FloatArray, vertOffset: Int, colors: IntArray, colorOffset: Int, paint: Paint)
    fun drawCircle(cx: Float, cy: Float, radius: Float, paint: Paint)

    fun drawColor(color: Int)
    fun drawColor(color: Int, mode: PorterDuff.Mode)

    fun drawLine(startX: Float, startY: Float, stopX: Float, stopY: Float, paint: Paint)
    fun drawLines(pts: FloatArray, offset: Int, count: Int, paint: Paint)

    fun drawLines(pts: FloatArray, paint: Paint)

    fun drawOval(oval: RectF, paint: Paint)

    fun drawOval(left: Float, top: Float, right: Float, bottom: Float, paint: Paint)
    fun drawPaint(paint: Paint)

    fun drawPath(path: Path, paint: Paint)

    fun drawPoint(x: Float, y: Float, paint: Paint)

    fun drawPoints(pts: FloatArray, offset: Int, count: Int, paint: Paint)

    fun drawPoints(pts: FloatArray, paint: Paint)

    @Deprecated("")
    fun drawPosText(text: CharArray, index: Int, count: Int, pos: FloatArray, paint: Paint)

    @Deprecated("")
    fun drawPosText(text: String, pos: FloatArray, paint: Paint)

    fun drawRect(rect: RectF, paint: Paint)
    fun drawRect(r: Rect, paint: Paint)
    fun drawRect(left: Float, top: Float, right: Float, bottom: Float, paint: Paint)
    fun drawRGB(r: Int, g: Int, b: Int)

    fun drawRoundRect(rect: RectF, rx: Float, ry: Float, paint: Paint)
    fun drawRoundRect(left: Float, top: Float, right: Float, bottom: Float, rx: Float, ry: Float, paint: Paint)
    fun drawText(text: CharArray, index: Int, count: Int, x: Float, y: Float, paint: Paint)

    fun drawText(text: String, x: Float, y: Float, paint: Paint)

    fun drawText(text: String, start: Int, end: Int, x: Float, y: Float, paint: Paint)

    fun drawText(text: CharSequence, start: Int, end: Int, x: Float, y: Float, paint: Paint)

    fun drawTextOnPath(text: CharArray, index: Int, count: Int, path: Path, hOffset: Float, vOffset: Float, paint: Paint)
    fun drawTextOnPath(text: String, path: Path, hOffset: Float, vOffset: Float, paint: Paint)
    fun drawTextRun(text: CharArray, index: Int, count: Int, contextIndex: Int, contextCount: Int, x: Float, y: Float, isRtl: Boolean, paint: Paint)

    fun drawTextRun(text: CharSequence, start: Int, end: Int, contextStart: Int, contextEnd: Int, x: Float, y: Float, isRtl: Boolean, paint: Paint)

    fun drawVertices(mode: Canvas.VertexMode, vertexCount: Int, verts: FloatArray, vertOffset: Int, texs: FloatArray, texOffset: Int, colors: IntArray, colorOffset: Int, indices: ShortArray, indexOffset: Int, indexCount: Int, paint: Paint)
}

open class CanvasWrapper(canvas: ICanvas) : ICanvas by canvas {
}
