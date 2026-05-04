<template>
    <Page>
        <ActionBar title="Drawing Canvas Demo">
            <ActionItem text="Undo" ios.position="left" @tap="undo" :isEnabled="canUndo" />
            <ActionItem text="Redo" ios.position="left" @tap="redo" :isEnabled="canRedo" />
        </ActionBar>
        <GridLayout rows="auto, *">
            <!-- Toolbar -->
            <ScrollView row="0" orientation="horizontal">
                <StackLayout orientation="horizontal" padding="8">
                    <Button
                        v-for="m in modes"
                        :key="m.id"
                        :text="m.label"
                        :class="currentMode === m.id ? 'mode-btn active' : 'mode-btn'"
                        @tap="setMode(m.id)"
                    />
                    <Button text="Clear" class="mode-btn" @tap="clearAll" />
                    <Button text="Export" class="mode-btn" @tap="exportJSON" />
                </StackLayout>
            </ScrollView>

            <!-- Drawing surface -->
            <DrawingCanvas
                row="1"
                ref="dc"
                width="100%"
                height="100%"
                backgroundColor="white"
                @shapeAdded="onShapeAdded"
                @selectionChange="onSelectionChange"
                @historyChange="onHistoryChange"
            />

            <!-- Colour strip (shown in pen / rectangle / ellipse / arrow modes) -->
            <GridLayout
                v-if="showColorPicker"
                row="1"
                verticalAlignment="bottom"
                margin="16"
                columns="auto"
            >
                <StackLayout orientation="horizontal" backgroundColor="#fff" borderRadius="24" padding="8" shadow="3">
                    <Label
                        v-for="c in colors"
                        :key="c"
                        :backgroundColor="c"
                        width="32"
                        height="32"
                        borderRadius="16"
                        marginLeft="4"
                        marginRight="4"
                        @tap="setColor(c)"
                    />
                </StackLayout>
            </GridLayout>
        </GridLayout>
    </Page>
</template>

<script lang="ts">
import Vue from 'nativescript-vue';
import { Component } from 'vue-property-decorator';
import { Color } from '@nativescript/core';
import { DrawingCanvas } from '@nativescript-community/ui-drawingcanvas';

const MODES = [
    { id: 'pen', label: '✏️ Pen' },
    { id: 'rectangle', label: '▭ Rect' },
    { id: 'ellipse', label: '⬭ Ellipse' },
    { id: 'arrow', label: '→ Arrow' },
    { id: 'select', label: '↖ Select' },
    { id: 'move', label: '✋ Move' }
];

const COLORS = ['#000000', '#e53935', '#43a047', '#1e88e5', '#fb8c00', '#8e24aa', '#ffffff'];

@Component
export default class DrawingCanvasDemo extends Vue {
    modes = MODES;
    colors = COLORS;
    currentMode = 'pen';
    canUndo = false;
    canRedo = false;

    get showColorPicker(): boolean {
        return ['pen', 'rectangle', 'ellipse', 'arrow'].includes(this.currentMode);
    }

    get dc(): DrawingCanvas {
        return (this.$refs.dc as any).nativeView as DrawingCanvas;
    }

    mounted() {
        const dc = this.dc;
        dc.strokeColor = new Color('#000000');
        dc.strokeWidth = 3;
        dc.simplificationOptions = { enabled: true, epsilon: 2, smoothing: true };
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
        this.dc.pushUndoSnapshot();
        const layers = this.dc.layers.slice();
        for (const s of layers) {
            this.dc.removeLayer(s);
        }
    }

    exportJSON() {
        const json = this.dc.exportJSON();
        console.log('Exported JSON:', json);
        // In a real app you would save / share this string
    }

    onShapeAdded(args: any) {
        console.log('Shape added:', args.shape?.shapeType);
    }

    onSelectionChange(args: any) {
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
</style>
