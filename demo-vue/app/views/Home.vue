<template>
    <Page ref="page" class="page">
        <ActionBar title="Canvas Demo" />
        <StackLayout>
            <ListView ref="listView" for="example in examples" rowHeight="50" @itemTap="goToExample">
                <v-template name="default">
                    <StackLayout padding="10" class="item" orientation="horizontal">
                        <Label :text="example.name" fontSize="17" verticalAlignment="center" />
                    </StackLayout>
                </v-template>
            </ListView>
        </StackLayout>
    </Page>
</template>

<script lang="ts">
import { getExamples } from '../examples';
import Vue from 'nativescript-vue';
import { Component } from 'vue-property-decorator';

@Component
export default class Home extends Vue {
    examples = getExamples();
    goToExample({ item }) {
        console.log('goToExample', item.name);
        this.$navigateTo(item.component);
    }
}
</script>