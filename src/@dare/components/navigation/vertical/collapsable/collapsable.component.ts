import { ChangeDetectorRef, Component, HostBinding, Input, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { merge, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { DareNavigationItem } from '@dare/types';
import { dareAnimations } from '@dare/animations';
import { DareNavigationService } from '@dare/components/navigation/navigation.service';

@Component({
    selector: 'dare-nav-vertical-collapsable',
    templateUrl: './collapsable.component.html',
    styleUrls: ['./collapsable.component.scss'],
    animations: dareAnimations
})
export class DareNavVerticalCollapsableComponent implements OnInit, OnDestroy {
    @Input()
    item: DareNavigationItem;

    @HostBinding('class')
    classes = 'nav-collapsable nav-item';

    @HostBinding('class.open')
    public isOpen = false;

    private _unsubscribeAll: Subject<any>;

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _dareNavigationService: DareNavigationService,
        private _router: Router
    ) {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    ngOnInit(): void {
        // Listen for router events
        this._router.events
            .pipe(
                filter(event => event instanceof NavigationEnd),
                takeUntil(this._unsubscribeAll)
            )
            .subscribe((event: NavigationEnd) => {

                // Check if the url can be found in
                // one of the children of this item
                if (this.isUrlInChildren(this.item, event.urlAfterRedirects)) {
                    this.expand();
                }
                else {
                    this.collapse();
                }
            });

        // Listen for collapsing of any navigation item
        this._dareNavigationService.onItemCollapsed
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(
                (clickedItem) => {
                    if (clickedItem && clickedItem.children) {
                        // Check if the clicked item is one
                        // of the children of this item
                        if (this.isChildrenOf(this.item, clickedItem)) {
                            return;
                        }

                        // Check if the url can be found in
                        // one of the children of this item
                        if (this.isUrlInChildren(this.item, this._router.url)) {
                            return;
                        }

                        // If the clicked item is not this item, collapse...
                        if (this.item !== clickedItem) {
                            this.collapse();
                        }
                    }
                }
            );

        // Check if the url can be found in
        // one of the children of this item
        if (this.isUrlInChildren(this.item, this._router.url)) {
            this.expand();
        }
        else {
            this.collapse();
        }

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

    toggleOpen(ev): void {
        ev.preventDefault();

        this.isOpen = !this.isOpen;

        // Navigation collapse toggled...
        this._dareNavigationService.onItemCollapsed.next(this.item);
        this._dareNavigationService.onItemCollapseToggled.next();
    }

    expand(): void {
        if (this.isOpen) {
            return;
        }

        this.isOpen = true;

        // Mark for check
        this._changeDetectorRef.markForCheck();

        this._dareNavigationService.onItemCollapseToggled.next();
    }

    collapse(): void {
        if (!this.isOpen) {
            return;
        }

        this.isOpen = false;

        // Mark for check
        this._changeDetectorRef.markForCheck();

        this._dareNavigationService.onItemCollapseToggled.next();
    }

    isChildrenOf(parent, item): boolean {
        if (!parent.children) {
            return false;
        }

        if (parent.children.indexOf(item) !== -1) {
            return true;
        }

        for (const children of parent.children) {
            if (children.children) {
                return this.isChildrenOf(children, item);
            }
        }
    }

    isUrlInChildren(parent, url): boolean {
        if (!parent.children) {
            return false;
        }

        for (let i = 0; i < parent.children.length; i++) {
            if (parent.children[i].children) {
                if (this.isUrlInChildren(parent.children[i], url)) {
                    return true;
                }
            }

            if (parent.children[i].url === url || url.includes(parent.children[i].url)) {
                return true;
            }
        }

        return false;
    }

}
