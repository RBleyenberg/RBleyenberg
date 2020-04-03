import { ChangeDetectorRef, Component, HostBinding, Input, OnDestroy, OnInit } from '@angular/core';
import { merge, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { DareNavigationItem } from '@dare/types';
import { DareNavigationService } from '@dare/components/navigation/navigation.service';

@Component({
    selector: 'dare-nav-vertical-group',
    templateUrl: './group.component.html',
    styleUrls: ['./group.component.scss']
})
export class DareNavVerticalGroupComponent implements OnInit, OnDestroy {
    @HostBinding('class')
    classes = 'nav-group nav-item';

    @Input()
    item: DareNavigationItem;

    private _unsubscribeAll: Subject<any>;

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _dareNavigationService: DareNavigationService
    ) {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    ngOnInit(): void {
        // Subscribe to navigation item
        merge(
            this._dareNavigationService.onNavigationItemAdded,
            this._dareNavigationService.onNavigationItemUpdated,
            this._dareNavigationService.onNavigationItemRemoved
        ).pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

}
