<template>
    <Page>
        <ActionBar title="Image Demo" />

        <GridLayout rows="auto,auto">
            <SVGView blendingMode="lighten" height="30%" src="~/assets/svgs/Ghostscript_Tiger.svg" stretch="aspectFit" backgroundColor="transparent" @tap="onTap" />
            <!-- <CollectionView row="1" rowHeight="180" ref="listView" :items="itemList" @itemTap="onItemTap" itemIdGenerator="index"> -->
                <!-- <v-template> -->
                    <!-- <GridLayout> -->
                        <CanvasSVG @tap="refreshCanvas" row="1" height="180">
                            <Rectangle left="0" width="50" height="100%" color="red" horizontalAlignment="left" />

                            <Line id="line" :antiAlias="true" color="yellow" startX="10%" startY="34%" stopX="90%" stopY="90%" strokeCap="round" strokeJoin="round" strokeWidth="4" dash="1 10 0" />
                            <CSVG cache="false" horizontalAlignment="center" src="~/assets/svgs/MenuButton.svg" width="10" height="30" stretch="aspectFit" />
                            <CSVG horizontalAlignment="left" :src="svgString" height="100%" stretch="aspectFit" />
                        </CanvasSVG>
                    <!-- </GridLayout> -->
                <!-- </v-template> -->
            <!-- </CollectionView> -->
        </GridLayout>
    </Page>
</template>

<script lang="ts">
import { CanvasView } from '@nativescript-community/ui-canvas';
import Vue from 'nativescript-vue';
import { Component } from 'vue-property-decorator';

@Component
export default class Image extends Vue {
    itemList = new Array(1000).fill(null).map((v, i) => ({
        index: i
    }));
    svgString = `<svg xmlns='http://www.w3.org/2000/svg' viewBox="0 0 100 300">
          <circle cx="50" cy="50" r="40" stroke="black" stroke-width="3" fill="red" />
        </svg>`;
    refreshCanvas(event) {
        (event.object as CanvasView).redraw();
    }
    onItemTap({ index, item }) {
        console.log(`Tapped on ${index} ${item.title}`);
    }
    onTap(e) {
        e.object.src = '~/assets/svgs/MenuButton.svg';
    }
    logEvent(e) {
        console.log('logEvent', e.eventName, e.extraData);
    }
}
</script>
