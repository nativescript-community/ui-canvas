<template>
    <Page>
        <ActionBar title="Drawing Canvas Demo">
            <ActionItem text="Undo" ios.position="left" :isEnabled="canUndo" @tap="undo" />
            <ActionItem text="Redo" ios.position="left" :isEnabled="canRedo" @tap="redo" />
        </ActionBar>

        <!-- rows: toolbar | drawing surface | layer list -->
        <GridLayout rows="auto, *, auto">
            <!-- ── Top toolbar ── -->
            <ScrollView row="0" orientation="horizontal">
                <StackLayout orientation="horizontal" padding="8">
                    <Button v-for="m in modes" :key="m.id" :text="m.label" :class="currentMode === m.id ? 'mode-btn active' : 'mode-btn'" @tap="setMode(m.id)" />
                    <Button text="🗑 Clear" class="mode-btn danger" @tap="clearAll" />
                    <Button text="💾 Save" class="mode-btn" @tap="saveShapes" />
                    <Button text="📂 Restore" class="mode-btn" :isEnabled="hasSaved" @tap="restoreShapes" />
                </StackLayout>
            </ScrollView>

            <!-- ── Drawing surface: ZoomImage + DrawingCanvas overlay ── -->
            <GridLayout row="1" rows="*" columns="*">
                <!-- Background zoomable image -->
                <NSZoomImg
                    ref="zoomImg"
                    row="0"
                    col="0"
                    src="~/assets/images/test.jpg"
                    width="100%"
                    height="100%"
                    stretch="aspectFit"
                    @transformChanged="onImageViewTransform"
                    @finalImageSet="onImageLoaded"
                />

                <!-- Drawing canvas overlaid on top -->
                <DrawingCanvas
                    ref="dc"
                    row="0"
                    col="0"
                    :canvasScale="canvasScale"
                    :canvasTranslateX="canvasTranslateX"
                    :canvasTranslateY="canvasTranslateY"
                    backgroundColor="#ff000055"
                    :width="canvasWidth"
                    :height="canvasHeight"
                    horizontalAlignment="center"
                    verticalAlignment="center"
                    :callDrawBeforeShapes="true"
                    @draw="onDraw"
                    @selectiond="onShapeAdded"
                    @selectionChange="onSelectionChange"
                    @historyChange="onHistoryChange"
                />

                <!-- Colour strip (pen / shape drawing modes) -->
                <GridLayout v-if="showColorPicker" row="0" col="0" verticalAlignment="bottom" margin="16">
                    <StackLayout orientation="horizontal" backgroundColor="#fff" borderRadius="24" padding="8" shadow="3" horizontalAlignment="center">
                        <Label v-for="c in colors" :key="c" :backgroundColor="c" width="32" height="32" borderRadius="16" marginLeft="4" marginRight="4" @tap="setColor(c)" />
                    </StackLayout>
                </GridLayout>
            </GridLayout>

            <!-- ── Horizontal layer list ── -->
            <ScrollView row="2" orientation="horizontal" height="80" backgroundColor="#f5f5f5">
                <StackLayout orientation="horizontal" padding="8">
                    <GridLayout
                        v-for="(shape, idx) in layerItems"
                        :key="shape.id"
                        rows="*"
                        columns="*"
                        width="64"
                        height="64"
                        marginRight="8"
                        borderRadius="8"
                        :backgroundColor="selectedShapeId === shape.id ? '#1976D2' : '#e0e0e0'"
                        @tap="selectShapeFromList(shape)"
                    >
                        <!-- Shape type label -->
                        <Label row="0" col="0" :text="shapeEmoji(shape.shapeType)" fontSize="28" textAlignment="center" verticalAlignment="middle" />
                        <!-- Delete badge -->
                        <Label
                            row="0"
                            col="0"
                            text="✕"
                            fontSize="12"
                            color="white"
                            backgroundColor="#e53935"
                            width="20"
                            height="20"
                            borderRadius="10"
                            horizontalAlignment="right"
                            verticalAlignment="top"
                            margin="2"
                            @tap="deleteShape(shape)"
                        />
                    </GridLayout>

                    <!-- Empty state -->
                    <Label v-if="layerItems.length === 0" text="No shapes yet" color="#999" fontSize="13" verticalAlignment="middle" padding="8" />
                </StackLayout>
            </ScrollView>
        </GridLayout>
    </Page>
</template>

<script lang="ts">
import Vue from 'nativescript-vue';
import { Component } from 'vue-property-decorator';
import { ApplicationSettings, Color, ObservableArray, Utils } from '@nativescript/core';
import { DrawableShape, DrawingCanvas } from '@nativescript-community/ui-drawingcanvas';
import { Canvas, Matrix } from '@nativescript-community/ui-canvas';
import { Img } from '@nativescript-community/ui-image';
import { Rect } from '@nativescript-community/ui-canvas';
import { RectF } from '@nativescript-community/ui-canvas';

const MODES = [
    { id: 'pen', label: '✏️ Pen' },
    { id: 'rectangle', label: '▭ Rect' },
    { id: 'ellipse', label: '⬭ Ellipse' },
    { id: 'arrow', label: '→ Arrow' },
    { id: 'select', label: '↖ Select' },
    { id: 'move', label: '✋ Move' }
];

const COLORS = ['#000000', '#e53935', '#43a047', '#1e88e5', '#fb8c00', '#8e24aa', '#ffffff'];

const SHAPE_EMOJI: Record<string, string> = {
    pen: '✏️',
    rect: '▭',
    ellipse: '⬭',
    arrow: '→',
    image: '🖼',
    custom: '⬡'
};

const SAVED_SHAPES_KEY = 'drawingcanvas_saved_shapes';

@Component
export default class DrawingCanvasDemo extends Vue {
    modes = MODES;
    colors = COLORS;
    currentMode = 'pen';
    canUndo = false;
    canRedo = false;
    hasSaved = false;
    canvasWidth = '100%';
    canvasHeight = '100%';
    currentMatrix = new Matrix();
    canvasTranslateX = 0;
    canvasTranslateY = 0;
    canvasScale = Utils.layout.toDeviceIndependentPixels(1);
    scaleTypeMatrix = new Matrix();
    selectedShapeId: string | null = null;
    /** Mirror of dc.layers for the template (ObservableArray is reactive) */
    layerItems: ObservableArray<DrawableShape> = new ObservableArray();

    get showColorPicker(): boolean {
        return ['pen', 'rectangle', 'ellipse', 'arrow'].includes(this.currentMode);
    }

    get dc(): DrawingCanvas {
        return (this.$refs.dc as any).nativeView as DrawingCanvas;
    }

    get imageView(): Img {
        return (this.$refs.zoomImg as any).nativeView as Img;
    }

    mounted() {
        this.hasSaved = !!ApplicationSettings.getString(SAVED_SHAPES_KEY);
        const dc = this.dc;
        dc.strokeColor = new Color('#000000');
        dc.strokeWidth = 3;
        dc.simplificationOptions = { enabled: true, epsilon: 2, smoothing: true };
        // Keep layerItems in sync with dc.layers (same ObservableArray reference)
        this.layerItems = dc.layers;
    }

    onImageViewTransform(event: any) {
        const matrix = event.android as android.graphics.Matrix;
        // const zoomPanMatrix = new Matrix();
        // const inverseScaleType = new Matrix();
        // if (!matrix.isIdentity() &&  this.scaleTypeMatrix.invert(inverseScaleType)) {
        // zoomPanMatrix.set(inverseScaleType);
        // zoomPanMatrix.postConcat(matrix);
        // } else {
        //     zoomPanMatrix.set(matrix);

        // }
        // Recombine: ScaleType * ZoomPan
        this.currentMatrix.set(matrix);

        // this.currentMatrix.postConcat(zoomPanMatrix);
        // this.currentMatrix.postTranslate(0, -200);
        this.dc.redraw();
        console.log('onImageViewTransform', event.android, this.scaleTypeMatrix, this.currentMatrix);
    }
    getImageDisplayRect(draweeView: any, imageInfo) {
        const hierarchy = draweeView.getHierarchy();
        const controller = draweeView.getZoomableController();
        console.log('getImageDisplayRect', controller.getTransform);

        // Get the transform matrix
        const matrix = controller.getTransform();
        console.log('getImageDisplayRect1', matrix);

        const imageWidth = imageInfo.getWidth();
        const imageHeight = imageInfo.getHeight();

        const scaleType = hierarchy.getActualImageScaleType();

        const imageBounds = new RectF(0, 0, imageWidth, imageHeight);
        const viewBounds = new Rect(0, 0, draweeView.getWidth(), draweeView.getHeight());
        console.log('imageBounds', imageBounds);

        // Calculate the matrix that the ScaleType applies
        scaleType.getTransform(
            this.scaleTypeMatrix,
            viewBounds,
            imageWidth,
            imageHeight,
            0.5, // focusX
            0.5 // focusY
        );
        // Apply to get display rect
        this.scaleTypeMatrix.mapRect(imageBounds);
        return imageBounds;
    }
    onImageLoaded(event) {
        console.log('onImageLoaded1');
        try {
            const rect = this.getImageDisplayRect(this.imageView.nativeViewProtected, event.imageInfo);
            // this.canvasWidth = Utils.layout.toDeviceIndependentPixels(rect.width());
            // this.canvasHeight = Utils.layout.toDeviceIndependentPixels(rect.height());
            console.log('onImageLoaded', this.scaleTypeMatrix, rect);
            this.canvasTranslateX = Utils.layout.toDeviceIndependentPixels(rect.left) * this.canvasScale * this.canvasScale * this.canvasScale * this.canvasScale;
            this.canvasTranslateY = Utils.layout.toDeviceIndependentPixels(rect.top) * this.canvasScale * this.canvasScale * this.canvasScale * this.canvasScale;
        } catch (error) {
            console.error(error, error.stack);
        }
    }
    onDraw(event: any) {
        const canvas = event.canvas as Canvas;
        // console.log('onDraw', this.currentMatrix);
        if (this.currentMatrix) {
            try {
                // if (!this.currentMatrix.isIdentity()) {
                //     const scale = Utils.layout.toDeviceIndependentPixels(1);
                //     console.log('scale', scale);
                //     // canvas.scale(scale, scale)
                //     // this.currentMatrix.postScale(scale, scale);
                // }
                canvas.concat(this.currentMatrix);
            } catch (error) {
                console.error(error, error.stack);
            }
        }
    }

    shapeEmoji(type: string): string {
        return SHAPE_EMOJI[type] ?? '◆';
    }

    setMode(modeId: string) {
        this.currentMode = modeId;
        this.dc.setMode(modeId as any);
    }

    setColor(hex: string) {
        this.dc.strokeColor = new Color(hex);
        this.dc.fillColor = null;
    }

    undo() {
        this.dc.undo();
    }

    redo() {
        this.dc.redo();
    }

    clearAll() {
        this.dc.importJSON('[]');
        this.selectedShapeId = null;
    }

    saveShapes() {
        const json = this.dc.exportJSON();
        ApplicationSettings.setString(SAVED_SHAPES_KEY, json);
        this.hasSaved = true;
        console.log('Saved shapes JSON:', json);
    }

    restoreShapes() {
        const json = ApplicationSettings.getString(SAVED_SHAPES_KEY);
        if (json) {
            this.dc.importJSON(json);
            console.log('Restored shapes from saved JSON');
        }
    }

    selectShapeFromList(shape: DrawableShape) {
        this.selectedShapeId = shape.id;
        this.dc.selectShape(shape);
        // Reflect mode change in toolbar
        this.currentMode = 'select';
    }

    deleteShape(shape: DrawableShape) {
        if (this.selectedShapeId === shape.id) {
            this.selectedShapeId = null;
        }
        this.dc.removeLayer(shape);
    }

    onShapeAdded(args: any) {
        console.log('Shape added:', args.shape?.shapeType);
    }

    onSelectionChange(args: any) {
        this.selectedShapeId = args.shape?.id ?? null;
        this.currentMode = 'select';
        console.log('Selection changed:', args.shape?.shapeType ?? 'none');
    }

    onHistoryChange(args: any) {
        this.canUndo = args.canUndo;
        this.canRedo = args.canRedo;
    }
}
</script>

<style scoped>
.mode-btn {
    font-size: 13;
    padding: 6 12;
    margin: 0 4;
    border-radius: 16;
    background-color: #eeeeee;
    color: #333333;
}
.mode-btn.active {
    background-color: #1976d2;
    color: #ffffff;
}
.mode-btn.danger {
    background-color: #ffcdd2;
    color: #c62828;
}
</style>
