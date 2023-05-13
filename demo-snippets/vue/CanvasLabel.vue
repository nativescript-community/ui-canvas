<template>
    <Page>
        <StackLayout>
            <CollectionView width="100%" height="50%" rowHeight="80" ref="listView" :items="itemList" @itemTap="onItemTap" itemIdGenerator="index">
                <v-template>
                    <GridLayout margin="4" borderRightWidth="20" borderRightColor="white" backgroundColor="darkgray">
                        <Label color="blue" fontSize="38" verticalAlignment="middle" paddingLeft="20" fontStyle="italic" textWrap>
                            <Span :text="item.text1" fontWeight="bold" />
                            <Span :text="'\n' + item.text2" color="#ccc" fontSize="16" fontStyle="normal" />
                            <Span :text="item.text2" color="#eee" fontFamily="Lato-Regular" fontSize="16" fontStyle="normal" />
                        </Label>
                        <Label color="white" fontSize="12" verticalAlignment="bottom" paddingLeft="20" paddingBottom="1" textWrap>
                            <Span :text="item.icon1" fontSize="20" color="green" :fontFamily="mdiFontFamily" />
                            <Span :text="' ' + item.texticon1" verticalTextAlignment="center" />
                            <Span :text="'   ' + item.icon2" fontSize="20" color="red" :fontFamily="mdiFontFamily" />
                            <Span :text="' ' + item.texticon2" verticalTextAlignment="center" />
                            <Span :text="'   ' + item.icon3" fontSize="20" color="yellow" :fontFamily="mdiFontFamily" />
                            <Span :text="' ' + item.icon3" verticalTextAlignment="center" />
                        </Label>

                        <Label fontSize="12" verticalAlignment="middle" horizontalAlignment="center" textAlignment="right" paddingRight="20" color="brown" width="60" textWrap>
                            <span :text="item.icon1" fontSize="14" :fontFamily="mdiFontFamily" />
                            <Span :text="'\n' + item.texticon1" paddingRight="10" />
                        </Label>
                        <Label fontFamily="arial" :text="item.text4" color="red" fontSize="14" textAlignment="right" paddingRight="20" paddingTop="4"  verticalAlignment="center"/>
                    </GridLayout>
                </v-template>
            </CollectionView>
            <CollectionView width="100%" height="50%" rowHeight="80" ref="listView" :items="itemList" @itemTap="onItemTap" itemIdGenerator="index">
                <v-template>
                    <GridLayout>
                        <CanvasLabel id="canvaslabel" fontSize="10" color="white" backgroundColor="darkgray" margin="4" borderRightWidth="20" borderRightColor="white">
                            <!-- <Rectangle left="-20" width="20" height="100%" color="red" horizontalAlignment="right" /> -->
                            <CGroup id="group1" color="blue" fontSize="38" verticalAlignment="middle" paddingLeft="20" fontStyle="italic">
                                <CSpan id="text1" :text="item.text1" fontWeight="bold" />
                                <CSpan id="text2" :text="'\n' + item.text2" color="#ccc" fontSize="16" fontStyle="normal" />
                                <CSpan id="text3" :text="item.text2" color="#eee" fontFamily="Lato-Regular" fontSize="16" fontStyle="normal" />
                            </CGroup>
                            <!-- <Line id="line" :antiAlias="true" color="yellow" startX="10%" startY="34%" stopX="90%" stopY="90%" strokeCap="round" strokeJoin="round" strokeWidth="4" dash="1 10 0" /> -->
                            <!-- <CGroup backgroundColor="yellow" verticalTextAlignment="top" textAlignment="right">
                                <CSpan text="TOTO" fontSize="20" color="green" />
                            </CGroup> -->
                            <CGroup id="group2" fontSize="12" verticalAlignment="bottom" paddingLeft="20" paddingBottom="1">
                                <CSpan id="icon1" :text="item.icon1" fontSize="20" color="green" :fontFamily="mdiFontFamily" />
                                <CSpan id="texticon1" :text="' ' + item.texticon1" verticalTextAlignment="center" />
                                <CSpan id="icon2" :text="'   ' + item.icon2" fontSize="20" color="red" :fontFamily="mdiFontFamily" />
                                <CSpan id="texticon2" :text="' ' + item.texticon2" verticalTextAlignment="center" />
                                <CSpan id="icon3" :text="'   ' + item.icon3" fontSize="20" color="yellow" :fontFamily="mdiFontFamily" />
                                <CSpan id="icon3" :text="' ' + item.icon3" verticalTextAlignment="center" />
                            </CGroup>

                            <CGroup id="group3" fontSize="12" verticalAlignment="middle" horizontalAlignment="center" textAlignment="right" paddingRight="20" color="brown" width="60">
                                <CSpan id="icon12" :text="item.icon1" fontSize="14" :fontFamily="mdiFontFamily" />
                                <CSpan id="texticon12" :text="'\n' + item.texticon1" paddingRight="10" />
                            </CGroup>
                            <CSpan id="text4" fontFamily="arial" :text="item.text4" color="red" fontSize="14" textAlignment="right" paddingRight="20" paddingTop="4" verticalAlignment="center"/>
                            <!-- <CGroup id="group1" fontSize="12" verticalAlignment="bottom" paddingLeft="20" paddingBottom="1" color="white" verticalTextAlignment="top">
                                <CSpan id="span1" text="test1" margin="2" backgroundColor="green" borderRadius="4" verticalTextAlignment="super" />
                                <CSpan id="span2" text="testtest2" backgroundColor="red" borderRadius="4" fontSize="24" />
                                <CGroup id="group2" backgroundColor="green" borderRadius="4">
                                    <CSpan id="span3" text="mdi-access-point" fontSize="20" color="yellow" :fontFamily="mdiFontFamily" />
                                    <CSpan id="span4" text="test2" margin="2" />
                                </CGroup>
                            </CGroup> -->
                            <!-- <CGroup>
                                <CSpan fontSize="20" text="test1" margin="2" color="red" backgroundColor="green" borderRadius="10" @linkTap="onLinkTapped('test1')" />
                            </CGroup> -->
                            <!-- <CSpan
                                width="44"
                                height="44"
                                horizontalAlignment="right"
                                verticalAlignment="bottom"
                                textAlignment="center"
                                verticalTextAlignment="center"
                                text="mdi-access-point"
                                fontSize="20"
                                color="yellow"
                                :fontFamily="mdiFontFamily"
                                backgroundColor="blue"
                                borderRadius="4"
                                shadow="0 1 4 red"
                            /> -->
                        </CanvasLabel>
                    </GridLayout>
                </v-template>
            </CollectionView>
        </StackLayout>
    </Page>
</template>

<script lang="ts">
import { stringify } from 'querystring';
const icons = [
    'mdi-numeric',
    'mdi-hat-fedora',
    'mdi-home-floor-g',
    'mdi-account-key',
    'mdi-ticket-confirmation',
    'mdi-rotate-orbit',
    'mdi-access-point',
    'mdi-arrow-right-bold-circle-outline',
    'mdi-crosshairs-gps',
    'mdi-jabber',
    'mdi-onepassword'
];

const randomLanguage = ['javascript', 'typescript', 'go', 'c++'];
export default {
    data() {
        const items = new Array(1000).fill(null).map((v, i) => ({
            index: i,
            // icon1: icons[Math.round(Math.random() * (icons.length - 1))],
            icon1: '1',
            icon2: 'mdi-access-point',
            icon3: '3',
            texticon1: randomLanguage[Math.round(Math.random() * (randomLanguage.length - 1))] + ` ${i}`,
            texticon2: randomLanguage[Math.round(Math.random() * (randomLanguage.length - 1))] + ` ${i}`,
            texticon3: randomLanguage[Math.round(Math.random() * (randomLanguage.length - 1))] + ` ${i}`,
            text1: `test asd g ${i}`,
            text2: 'asddg',
            text3: `icon ${i}`,
            text4: i % 3 === 0 ? 'test' : ''
        }));
        // console.log('items', JSON.stringify(items));

        return {
            mdiFontFamily: 'materialdesignicons-webfont,Material Design Icons',
            itemList: items,
            item:null
        };
    },
    methods: {
        onLinkTapped(text) {
            console.log('onLinkTapped', text);
        },
        onItemTap({ index, item }) {
            console.log(`Tapped on ${index} ${item.title}`);
        },
        logEvent(e) {
            console.log('logEvent', e.eventName, e.extraData);
        }
        // itemIdGenerator(item, i) {
        //   return item.index;
        // }
    }
};
</script>

<style scoped>
ActionBar {
    background-color: #53ba82;
    color: #ffffff;
}

.message {
    vertical-align: center;
    text-align: center;
    font-size: 20;
    color: #333333;
}
</style>
