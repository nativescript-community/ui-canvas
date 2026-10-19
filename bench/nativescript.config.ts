import { NativeScriptConfig } from '@nativescript/core';

export default {
  id: 'org.nativescript.benchapp',
  appPath: 'app',
  appResourcesPath: 'App_Resources',
  cli: { packageManager: 'npm' },
  android: {
    v8Flags: '--expose_gc',
    markingMode: 'none'
  }
} as NativeScriptConfig;