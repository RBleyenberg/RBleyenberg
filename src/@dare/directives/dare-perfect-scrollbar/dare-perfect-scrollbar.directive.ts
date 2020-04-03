import { AfterViewInit, Directive, ElementRef, HostListener, Input, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Platform } from '@angular/cdk/platform';
import { fromEvent, Subject } from 'rxjs';
import { debounceTime, filter, takeUntil } from 'rxjs/operators';
import PerfectScrollbar from 'perfect-scrollbar';
import * as _ from 'lodash';
import { DarePerfectScrollbarGeometry, DarePerfectScrollbarPosition } from '@dare/directives/dare-perfect-scrollbar/dare-perfect-scrollbar.interfaces';
import { DareConfigService } from '@dare/services/config.service';

@Directive({
    selector: '[darePerfectScrollbar]'
})
export class DarePerfectScrollbarDirective implements OnInit, AfterViewInit, OnDestroy {
    isInitialized: boolean;
    isMobile: boolean;
    ps: PerfectScrollbar | any;

    private _animation: number | null;
    private _enabled: boolean | '';
    private _debouncedUpdate: any;
    private _options: any;
    private _unsubscribeAll: Subject<any>;

    constructor(
        public elementRef: ElementRef,
        private _dareConfigService: DareConfigService,
        private _platform: Platform,
        private _router: Router
    ) {
        // Set the defaults
        this.isInitialized = false;
        this.isMobile = false;

        // Set the private defaults
        this._animation = null;
        this._enabled = false;
        this._debouncedUpdate = _.debounce(this.update, 150);
        this._options = {
            updateOnRouteChange: false
        };
        this._unsubscribeAll = new Subject();
    }

    @Input()
    set darePerfectScrollbarOptions(value) {
        // Merge the options
        this._options = _.merge({}, this._options, value);

        // Destroy and re-init the PerfectScrollbar to update its options
        setTimeout(() => {
            this._destroy();
        });

        setTimeout(() => {
            this._init();
        });
    }

    get darePerfectScrollbarOptions(): any {
        // Return the options
        return this._options;
    }

    @Input('darePerfectScrollbar')
    set enabled(value: boolean | '') {
        // If nothing is provided with the directive (empty string),
        // we will take that as a true
        if (value === '') {
            value = true;
        }

        // Return, if both values are the same
        if (this.enabled === value) {
            return;
        }

        // Store the value
        this._enabled = value;

        // If enabled...
        if (this.enabled) {
            // Init the directive
            this._init();
        }
        else {
            // Otherwise destroy it
            this._destroy();
        }
    }

    get enabled(): boolean | '' {
        // Return the enabled status
        return this._enabled;
    }

    ngOnInit(): void {
        // Subscribe to window resize event
        fromEvent(window, 'resize')
            .pipe(
                takeUntil(this._unsubscribeAll),
                debounceTime(150)
            )
            .subscribe(() => {

                // Update the PerfectScrollbar
                this.update();
            });
    }

    ngAfterViewInit(): void {
        // Check if scrollbars enabled or not from the main config
        this._dareConfigService.config
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(
                (settings) => {
                    this.enabled = settings.customScrollbars;
                }
            );

        // Scroll to the top on every route change
        if (this.darePerfectScrollbarOptions.updateOnRouteChange) {
            this._router.events
                .pipe(
                    takeUntil(this._unsubscribeAll),
                    filter(event => event instanceof NavigationEnd)
                )
                .subscribe(() => {
                    setTimeout(() => {
                        this.scrollToTop();
                        this.update();
                    }, 0);
                });
        }
    }

    ngOnDestroy(): void {
        this._destroy();

        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    _init(): void {
        // Return, if already initialized
        if (this.isInitialized) {
            return;
        }

        // Check if is mobile
        if (this._platform.ANDROID || this._platform.IOS) {
            this.isMobile = true;
        }

        // Return if it's mobile
        if (this.isMobile) {
            // Return...
            return;
        }

        // Set as initialized
        this.isInitialized = true;

        // Initialize the perfect-scrollbar
        this.ps = new PerfectScrollbar(this.elementRef.nativeElement, {
            ...this.darePerfectScrollbarOptions
        });

        // Unbind 'keydown' events of PerfectScrollbar since it causes an extremely
        // high CPU usage on Angular Material inputs.
        // Loop through all the event elements of this PerfectScrollbar instance
        this.ps.event.eventElements.forEach((eventElement) => {

            // If we hit to the element with a 'keydown' event...
            if (typeof eventElement.handlers['keydown'] !== 'undefined') {
                // Unbind it
                eventElement.element.removeEventListener('keydown', eventElement.handlers['keydown'][0]);
            }
        });
    }

    _destroy(): void {
        if (!this.isInitialized || !this.ps) {
            return;
        }

        // Destroy the perfect-scrollbar
        this.ps.destroy();

        // Clean up
        this.ps = null;
        this.isInitialized = false;
    }

    @HostListener('window:resize')
    _updateOnResize(): void {
        this._debouncedUpdate();
    }

    @HostListener('document:click', ['$event'])
    documentClick(event: Event): void {
        if (!this.isInitialized || !this.ps) {
            return;
        }

        // Update the scrollbar on document click..
        // This isn't the most elegant solution but there is no other way
        // of knowing when the contents of the scrollable container changes.
        // Therefore, we update scrollbars on every document click.
        this.ps.update();
    }

    update(): void {
        if (!this.isInitialized) {
            return;
        }

        // Update the perfect-scrollbar
        this.ps.update();
    }

    destroy(): void {
        this.ngOnDestroy();
    }

    geometry(prefix: string = 'scroll'): DarePerfectScrollbarGeometry {
        return new DarePerfectScrollbarGeometry(
            this.elementRef.nativeElement[prefix + 'Left'],
            this.elementRef.nativeElement[prefix + 'Top'],
            this.elementRef.nativeElement[prefix + 'Width'],
            this.elementRef.nativeElement[prefix + 'Height']
        );
    }

    position(absolute: boolean = false): DarePerfectScrollbarPosition {
        if (!absolute && this.ps) {
            return new DarePerfectScrollbarPosition(
                this.ps.reach.x || 0,
                this.ps.reach.y || 0
            );
        }
        else {
            return new DarePerfectScrollbarPosition(
                this.elementRef.nativeElement.scrollLeft,
                this.elementRef.nativeElement.scrollTop
            );
        }
    }

    scrollTo(x: number, y?: number, speed?: number): void {
        if (y == null && speed == null) {
            this.animateScrolling('scrollTop', x, speed);
        }
        else {
            if (x != null) {
                this.animateScrolling('scrollLeft', x, speed);
            }

            if (y != null) {
                this.animateScrolling('scrollTop', y, speed);
            }
        }
    }

    scrollToX(x: number, speed?: number): void {
        this.animateScrolling('scrollLeft', x, speed);
    }

    scrollToY(y: number, speed?: number): void {
        this.animateScrolling('scrollTop', y, speed);
    }

    scrollToTop(offset?: number, speed?: number): void {
        this.animateScrolling('scrollTop', (offset || 0), speed);
    }

    scrollToLeft(offset?: number, speed?: number): void {
        this.animateScrolling('scrollLeft', (offset || 0), speed);
    }

    scrollToRight(offset?: number, speed?: number): void {
        const left = this.elementRef.nativeElement.scrollWidth - this.elementRef.nativeElement.clientWidth;
        this.animateScrolling('scrollLeft', left - (offset || 0), speed);
    }

    scrollToBottom(offset?: number, speed?: number): void {
        const top = this.elementRef.nativeElement.scrollHeight - this.elementRef.nativeElement.clientHeight;
        this.animateScrolling('scrollTop', top - (offset || 0), speed);
    }

    scrollToElement(qs: string, offset?: number, speed?: number): void {
        const element = this.elementRef.nativeElement.querySelector(qs);

        if (!element) {
            return;
        }

        const elementPos = element.getBoundingClientRect();
        const scrollerPos = this.elementRef.nativeElement.getBoundingClientRect();

        if (this.elementRef.nativeElement.classList.contains('ps--active-x')) {
            const currentPos = this.elementRef.nativeElement['scrollLeft'];
            const position = elementPos.left - scrollerPos.left + currentPos;

            this.animateScrolling('scrollLeft', position + (offset || 0), speed);
        }

        if (this.elementRef.nativeElement.classList.contains('ps--active-y')) {
            const currentPos = this.elementRef.nativeElement['scrollTop'];
            const position = elementPos.top - scrollerPos.top + currentPos;

            this.animateScrolling('scrollTop', position + (offset || 0), speed);
        }
    }

    animateScrolling(target: string, value: number, speed?: number): void {
        if (this._animation) {
            window.cancelAnimationFrame(this._animation);
            this._animation = null;
        }

        if (!speed || typeof window === 'undefined') {
            this.elementRef.nativeElement[target] = value;
        }
        else if (value !== this.elementRef.nativeElement[target]) {
            let newValue = 0;
            let scrollCount = 0;

            let oldTimestamp = performance.now();
            let oldValue = this.elementRef.nativeElement[target];

            const cosParameter = (oldValue - value) / 2;

            const step = (newTimestamp: number) => {
                scrollCount += Math.PI / (speed / (newTimestamp - oldTimestamp));
                newValue = Math.round(value + cosParameter + cosParameter * Math.cos(scrollCount));

                // Only continue animation if scroll position has not changed
                if (this.elementRef.nativeElement[target] === oldValue) {
                    if (scrollCount >= Math.PI) {
                        this.animateScrolling(target, value, 0);
                    }
                    else {
                        this.elementRef.nativeElement[target] = newValue;

                        // On a zoomed out page the resulting offset may differ
                        oldValue = this.elementRef.nativeElement[target];
                        oldTimestamp = newTimestamp;

                        this._animation = window.requestAnimationFrame(step);
                    }
                }
            };

            window.requestAnimationFrame(step);
        }
    }
}
