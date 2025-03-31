import { HostListener, Input, Component } from '@angular/core';

@Component({ template: '' })
export abstract class OnResize {

    @Input() isMobile!: boolean;
    @Input() isMobileTwo!: boolean;

    constructor() {
        this.onResize();
    }

    @HostListener("window:resize", [])
    onResize() {
        const width = window.innerWidth;
        this.isMobile = width < 992;
        this.isMobileTwo = width < 620;
    }
}