<template>
    <Page>
        <ActionBar title="Drawing Canvas Demo">
            <ActionItem ios.position="left" @tap="undo">
                <Button text="Undo" :isEnabled="canUndo" class="mode-btn" fontWeight="bold" padding="10" />
            </ActionItem>
            <ActionItem ios.position="left" @tap="redo">
                <Button text="Redo" :isEnabled="canRedo" class="mode-btn" fontWeight="bold" padding="10" />
            </ActionItem>
        </ActionBar>

        <!-- rows: toolbar | drawing surface | layer list -->
        <GridLayout rows="auto, auto, *, auto" android:marginBottom="42">
            <!-- ── Top toolbar ── -->
            <StackLayout orientation="horizontal" padding="8">
                <Button :text="'🗑\nClear'" class="mode-btn danger" @tap="clearAll" />
                <Button :text="'💾\nSave'" class="mode-btn" @tap="saveShapes" />
                <Button :text="'📂\nRestore'" class="mode-btn" :isEnabled="hasSaved" @tap="restoreShapes" />
                <Button :text="'📸\nExport'" class="mode-btn" @tap="exportImage" />
            </StackLayout>
            <WrapLayout row="1" orientation="horizontal" padding="8">
                <Button v-for="m in modes" :key="m.id" :text="m.label" :class="currentMode === m.id ? 'mode-btn active' : 'mode-btn'" @tap="setMode(m.id)" />
            </WrapLayout>

            <!-- ── Drawing surface: ZoomImage + DrawingCanvas overlay ── -->
            <GridLayout row="2" rows="*" columns="*">
                <!-- Background zoomable image -->
                <NSZoomImg
                    ref="zoomImg"
                    src="~/assets/images/test.jpg"
                    maxZoom="10"
                    stretch="aspectFit"
                    @transformChanged="onImageViewTransform"
                    @finalImageSet="onImageLoaded"
                    @layoutChanged="onLayoutChanged"
                />

                <!-- Drawing canvas overlaid on top -->
                <DrawingCanvas
                    ref="dc"
                    :canvasScale="canvasScale"
                    :canvasTranslateX="canvasTranslateX"
                    :canvasTranslateY="canvasTranslateY"
                    @draw="onDraw"
                    @shapeAdded="onShapeAdded"
                    @selectionChange="onSelectionChange"
                    @modeChange="onModeChange"
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
            <ScrollView row="3" orientation="horizontal" height="80" backgroundColor="#f5f5f5">
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
                    >
                        <!-- Shape type label -->
                        <Label row="0" col="0" :text="shapeEmoji(shape.shapeType)" fontSize="28" textAlignment="center" verticalAlignment="middle" @tap="selectShapeFromList(shape)" />
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
                            textAlignment="center"
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
import { ApplicationSettings, Button, Color, Frame, GridLayout, Image, ImageSource, ObservableArray, Page, Utils } from '@nativescript/core';
import { DrawableShape, DrawingCanvas } from '@nativescript-community/ui-drawingcanvas';
import { Canvas, Matrix } from '@nativescript-community/ui-canvas';
import { ImageInfo, Img } from '@nativescript-community/ui-image';
import { ZoomImg } from '@nativescript-community/ui-zoomimage';
import { Rect } from '@nativescript-community/ui-canvas';
import { RectF } from '@nativescript-community/ui-canvas';

const MODES = [
    { id: 'pen', label: '✏️\nPen' },
    { id: 'rectangle', label: '▭\nRect' },
    { id: 'ellipse', label: '⬭\nEllipse' },
    { id: 'arrow', label: '→\nArrow' },
    { id: 'text', label: '🔤\nText' },
    { id: 'select', label: '↖\nSelect' },
    { id: 'move', label: '✋\nMove' }
];

const COLORS = ['#000000', '#e53935', '#43a047', '#1e88e5', '#fb8c00', '#8e24aa', '#ffffff'];

const SHAPE_EMOJI: Record<string, string> = {
    pen: '✏️',
    rect: '▭',
    ellipse: '⬭',
    arrow: '→',
    image: '🖼',
    text: '🔤',
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
    canvasTranslateX = 0;
    canvasTranslateY = 0;
    canvasScale = Utils.layout.toDeviceIndependentPixels(1);
    scaleTypeMatrix = new Matrix();
    selectedShapeId: string | null = null;

    imageInfo: ImageInfo;
    /** Mirror of dc.layers for the template (ObservableArray is reactive) */
    layerItems: ObservableArray<DrawableShape> = new ObservableArray();

    get showColorPicker(): boolean {
        return ['pen', 'rectangle', 'ellipse', 'arrow', 'text', 'select'].includes(this.currentMode);
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
        this.dc.setCurrentMatrix(matrix);
        this.dc.redraw();
    }
    getImageDisplayRect(draweeView: any, imageInfo) {
        if (__IOS__) {
            const cgRect = draweeView.getImageDisplayRect() as CGRect;
            const rect = new Rect(
                Utils.layout.toDevicePixels(cgRect.origin.x),
                Utils.layout.toDevicePixels(cgRect.origin.y),
                Utils.layout.toDevicePixels(cgRect.origin.x + cgRect.size.width),
                Utils.layout.toDevicePixels(cgRect.origin.y + cgRect.size.height)
            );
            // rect.set();
            return rect;
        }
        const hierarchy = draweeView.getHierarchy();
        const controller = draweeView.getZoomableController();

        // Get the transform matrix
        const matrix = controller.getTransform();

        const imageWidth = imageInfo.getWidth();
        const imageHeight = imageInfo.getHeight();

        const scaleType = hierarchy.getActualImageScaleType();

        const imageBounds = new RectF(0, 0, imageWidth, imageHeight);
        const viewBounds = new Rect(0, 0, draweeView.getWidth(), draweeView.getHeight());
        console.log('getImageDisplayRect', imageBounds, viewBounds, scaleType);
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
    updateImageDisplayRect() {
        const imageView = this.imageView.nativeViewProtected;
        if (!imageView || imageView.getWidth() === 0) {
            return;
        }
        const rect = this.getImageDisplayRect(imageView, this.imageInfo);
        if (rect) {
            console.log('getImageDisplayRect', rect);
            this.needsImageDisplayRect = false;
            // canvasScale was kept from the original implementation pending investigation.
            this.canvasTranslateX = Utils.layout.toDeviceIndependentPixels(rect.left);
            this.canvasTranslateY = Utils.layout.toDeviceIndependentPixels(rect.top);
        }
    }
    needsImageDisplayRect = true;
    onLayoutChanged(event) {
        if (this.needsImageDisplayRect && this.imageInfo) {
            this.updateImageDisplayRect();
        }
    }
    onImageLoaded(event) {
        try {
            this.imageInfo = event.imageInfo;
            this.needsImageDisplayRect = true;
            console.log('onImageLoaded', this.imageInfo.getWidth(), this.imageInfo.getHeight());
            this.updateImageDisplayRect();
        } catch (error) {
            console.error(error, error.stack);
        }
    }
    onDraw(_event: any) {}

    shapeEmoji(type: string): string {
        return SHAPE_EMOJI[type] ?? '◆';
    }

    setMode(modeId: string) {
        this.currentMode = modeId;
        this.dc.setMode(modeId as any);
    }

    setColor(hex: string) {
        if (this.currentMode === 'select' && this.selectedShapeId) {
            const shape = this.dc.getSelectedShape();
            if (shape) {
                this.dc.pushUndoSnapshot();
                shape.strokeColor = new Color(hex);
                if (this.dc.editingTextShape) {
                    this.dc.editingTextField.color = shape.strokeColor;
                }
                this.dc.redraw();
            }
        } else {
            this.dc.strokeColor = new Color(hex);
            this.dc.fillColor = null;
        }
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
    }

    restoreShapes() {
        const json = ApplicationSettings.getString(SAVED_SHAPES_KEY);
        if (json) {
            this.dc.importJSON(json);
        }
    }

    exportImage() {
        // Export the shapes drawn over the image at its natural displayed size.
        // The canvasMatrix maps canvas coordinates to screen pixels, so pass it
        // along with the displayed image dimensions (in dp) as the export target.
        const dc = this.dc;
        let wDp: number | undefined;
        let hDp: number | undefined;
        let rect: RectF | undefined;

        try {
            rect = this.getImageDisplayRect(this.imageView.nativeViewProtected, this.imageInfo);
            wDp = Utils.layout.toDeviceIndependentPixels(this.imageInfo.getWidth());
            hDp = Utils.layout.toDeviceIndependentPixels(this.imageInfo.getHeight());
        } catch (_e) {
            // Fallback: use canvas view size
        }

        const imageSource = dc.exportImage(wDp, hDp, rect, ImageSource.fromFileSync('~/assets/images/test.jpg'));
        if (!imageSource) {
            console.warn('DrawingCanvas: exportImage returned null');
            return;
        }

        // Show the exported image in a modal page
        const modalPage = new Page();
        const gridLayout = new GridLayout();
        gridLayout.backgroundColor = '#fff';
        gridLayout.paddingBottom = 40;

        const imgView = new ZoomImg();
        imgView.src = imageSource;

        imgView.backgroundColor = 'green';
        imgView.stretch = 'aspectFit';
        imgView.maxZoom = 10;
        // imgView.width = '100%' as any;
        // imgView.height = '100%' as any;
        gridLayout.addChild(imgView);

        const closeBtn = new Button();
        closeBtn.text = '✕ Close';
        closeBtn.color = new Color('#fff');
        closeBtn.backgroundColor = '#333';
        closeBtn.borderRadius = 20;
        closeBtn.padding = '8 16';
        closeBtn.horizontalAlignment = 'center';
        closeBtn.verticalAlignment = 'bottom';
        closeBtn.marginBottom = 20;
        closeBtn.on('tap', () => Frame.topmost().goBack());
        gridLayout.addChild(closeBtn);

        modalPage.content = gridLayout;
        Frame.topmost().navigate({ create: () => modalPage, animated: true });
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
    }
    onModeChange(args: any) {
        this.currentMode = args.mode;
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
    padding: 2;
    margin: 4;
    border-radius: 8;
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
