import { Directive, Input, OnInit, HostListener, OnDestroy, HostBinding } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { MediaObserver } from '@angular/flex-layout';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { DareMatchMediaService } from '@dare/services/match-media.service';
import { DareMatSidenavHelperService } from '@dare/directives/dare-mat-sidenav/dare-mat-sidenav.service';

@Directive({
    selector: '[dareMatSidenavHelper]'
})
export class DareMatSidenavHelperDirective implements OnInit, OnDestroy {
    @HostBinding('class.mat-is-locked-open')
    isLockedOpen: boolean;

    @Input()
    dareMatSidenavHelper: string;

    @Input()
    matIsLockedOpen: string;

    private _unsubscribeAll: Subject<any>;

    constructor(
        private _dareMatchMediaService: DareMatchMediaService,
        private _dareMatSidenavHelperService: DareMatSidenavHelperService,
        private _matSidenav: MatSidenav,
        private _mediaObserver: MediaObserver
    ) {
        // Set the defaults
        this.isLockedOpen = true;

        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    ngOnInit(): void {
        // Register the sidenav to the service
        this._dareMatSidenavHelperService.setSidenav(this.dareMatSidenavHelper, this._matSidenav);

        if (this.matIsLockedOpen && this._mediaObserver.isActive(this.matIsLockedOpen)) {
            this.isLockedOpen = true;
            this._matSidenav.mode = 'side';
            this._matSidenav.toggle(true);
        }
        else {
            this.isLockedOpen = false;
            this._matSidenav.mode = 'over';
            this._matSidenav.toggle(false);
        }

        this._dareMatchMediaService.onMediaChange
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                if (this.matIsLockedOpen && this._mediaObserver.isActive(this.matIsLockedOpen)) {
                    this.isLockedOpen = true;
                    this._matSidenav.mode = 'side';
                    this._matSidenav.toggle(true);
                }
                else {
                    this.isLockedOpen = false;
                    this._matSidenav.mode = 'over';
                    this._matSidenav.toggle(false);
                }
            });
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
}

@Directive({
    selector: '[dareMatSidenavToggler]'
})
export class DareMatSidenavTogglerDirective {
    @Input()
    dareMatSidenavToggler: string;

    constructor(
        private _dareMatSidenavHelperService: DareMatSidenavHelperService) {
    }

    @HostListener('click')
    onClick(): void {
        this._dareMatSidenavHelperService.getSidenav(this.dareMatSidenavToggler).toggle();
    }
}
