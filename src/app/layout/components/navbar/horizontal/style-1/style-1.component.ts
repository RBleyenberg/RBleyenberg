import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { DareConfigService } from '@dare/services/config.service';
import { DareNavigationService } from '@dare/components/navigation/navigation.service';
import { DareSidebarService } from '@dare/components/sidebar/sidebar.service';

@Component({
    selector: 'navbar-horizontal-style-1',
    templateUrl: './style-1.component.html',
    styleUrls: ['./style-1.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class NavbarHorizontalStyle1Component implements OnInit, OnDestroy {
    dareConfig: any;
    navigation: any;

    private _unsubscribeAll: Subject<any>;

    constructor(
        private _dareConfigService: DareConfigService,
        private _dareNavigationService: DareNavigationService,
        private _dareSidebarService: DareSidebarService
    ) {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    ngOnInit(): void {
        // Get current navigation
        this._dareNavigationService.onNavigationChanged
            .pipe(
                filter(value => value !== null),
                takeUntil(this._unsubscribeAll)
            )
            .subscribe(() => {
                this.navigation = this._dareNavigationService.getCurrentNavigation();
            });

        // Subscribe to the config changes
        this._dareConfigService.config
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((config) => {
                this.dareConfig = config;
            });
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
}
