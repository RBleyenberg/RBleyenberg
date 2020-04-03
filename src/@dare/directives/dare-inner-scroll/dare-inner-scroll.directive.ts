import { Directive, ElementRef, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { DareMatchMediaService } from '@dare/services/match-media.service';

@Directive({
    selector: '.inner-scroll'
})
export class DareInnerScrollDirective implements OnInit, OnDestroy {
    private _parent: any;
    private _grandParent: any;
    private _unsubscribeAll: Subject<any>;

    constructor(
        private _elementRef: ElementRef,
        private _dareMediaMatchService: DareMatchMediaService,
        private _renderer: Renderer2
    ) {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    ngOnInit(): void {
        // Get the parent
        this._parent = this._renderer.parentNode(this._elementRef.nativeElement);

        // Return, if there is no parent
        if (!this._parent) {
            return;
        }

        // Get the grand parent
        this._grandParent = this._renderer.parentNode(this._parent);

        // Register to the media query changes
        this._dareMediaMatchService.onMediaChange
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((alias) => {

                if (alias === 'xs') {
                    this._removeClass();
                }
                else {
                    this._addClass();
                }
            });
    }

    ngOnDestroy(): void {
        // Return, if there is no parent
        if (!this._parent) {
            return;
        }

        // Remove the class
        this._removeClass();

        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    private _addClass(): void {
        // Add the inner-scroll class
        this._renderer.addClass(this._grandParent, 'inner-scroll');
    }

    private _removeClass(): void {

        // Remove the inner-scroll class
        this._renderer.removeClass(this._grandParent, 'inner-scroll');
    }
}
