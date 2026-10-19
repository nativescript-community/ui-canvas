import { Application, Label, Page, StackLayout } from '@nativescript/core';
import { run, runView } from './bench';
import { smoke } from './smoke';

Application.run({
    create: () => {
        const page = new Page();
        const l = new Label();
        l.text = 'bench running…';
        const s = new StackLayout();
        s.addChild(l);
        page.content = s;
        (global as any).__benchContainer = s;
        return page;
    }
});
setTimeout(() => {
    try {
        smoke();
        run();
        runView((global as any).__benchContainer);
    } catch (e) {
        console.log('BENCH_ERROR|' + e + '|' + (e && (e as any).stack));
    }
}, 3000);
