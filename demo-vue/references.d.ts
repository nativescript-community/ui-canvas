/// <reference path="../src/references.d.ts" />
/// <reference path="../references.d.ts" />

// typings/custom.d.ts
declare module 'nativescript-worker-loader!*' {
    const content: any;
    export = content;
}

declare module '*.vue' {
    import Vue from 'vue';
    export default Vue;
}
