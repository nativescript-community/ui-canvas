<template>
    <Page>
        <StackLayout>
            <canvaslabel backgroundColor="red" rippleColor="green" borderRadius="10" paddingTop="0" height="80" widht="80">
            <CGroup verticalAlignment="middle" textAlignment="center">
                <cspan :fontFamily="mdiFontFamily" text="mdi-cellphone-screenshot" fontSize="30" />
                <cspan :text="'\n' + 'share screenshot'" fontSize="12" />
            </CGroup>
        </canvaslabel>
            <canvaslabel backgroundColor="yellow" rippleColor="green" borderRadius="10" paddingTop="0" height="80" width="80" lineBreak="middle">
            <CGroup>
                <cspan text="this is a tesxt to test lineBreak" fontSize="12" />
                <cspan :text="'\n' + 'another piece of text which is going to be ellipsized'" fontSize="16" />
            </CGroup>
        </canvaslabel>
            <label backgroundColor="green" rippleColor="green" borderRadius="10" paddingTop="0" height="80" width="80" lineBreak="end" >
                <span text="this is a tesxt to test lineBreak" fontSize="12" />
                <span :text="'\n' + 'another piece of text which is going to be ellipsized'" fontSize="16" />
        </label>
            <HTMLLabel backgroundColor="blue" rippleColor="green" borderRadius="10" paddingTop="0" height="80" width="80" lineBreak="end" maxLines="4">
                <span text="this is a tesxt to test lineBreak" fontSize="12" />
                <span :text="'\n' + 'another piece of text which is going to be ellipsized'" fontSize="16" />
        </HTMLLabel>
            
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
