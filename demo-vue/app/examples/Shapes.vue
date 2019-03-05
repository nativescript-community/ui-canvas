<template>
    <Page>

        <StackLayout>
            <CanvasView width="100%" height="100%">
                <Shapes>
                    <Rectangle color="red" left="10" top="10" width="50"  height="50" />
                </Shapes>
            </CanvasView>
        </StackLayout>
    </Page>
</template>

<script lang="ts">
import * as frameModule from 'tns-core-modules/ui/frame';
import Vue from 'nativescript-vue';
import { Component } from 'vue-property-decorator';
import { createRect, Paint, Style } from 'nativescript-canvas';
import { Color } from 'tns-core-modules/color/color';

@Component
export default class Simple extends Vue {
    static title: 'Shapes Example';
    onBack() {
        frameModule.topmost().goBack();
    }
}
</script>
