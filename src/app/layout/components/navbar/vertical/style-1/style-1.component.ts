import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { delay, filter, take, takeUntil } from 'rxjs/operators';

import { DareConfigService } from '@dare/services/config.service';
import { DareNavigationService } from '@dare/components/navigation/navigation.service';
import { DarePerfectScrollbarDirective } from '@dare/directives/dare-perfect-scrollbar/dare-perfect-scrollbar.directive';
import { DareSidebarService } from '@dare/components/sidebar/sidebar.service';

@Component({
    selector: 'navbar-vertical-style-1',
    templateUrl: './style-1.component.html',
    styleUrls: ['./style-1.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class NavbarVerticalStyle1Component implements OnInit, OnDestroy {
    dareConfig: any;
    navigation: any;

    private _darePerfectScrollbar: DarePerfectScrollbarDirective;
    private _unsubscribeAll: Subject<any>;

    constructor(
        private _dareConfigService: DareConfigService,
        private _dareNavigationService: DareNavigationService,
        private _dareSidebarService: DareSidebarService,
        private _router: Router
    ) {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    // Directive
    @ViewChild(DarePerfectScrollbarDirective, { static: true })
    set directive(theDirective: DarePerfectScrollbarDirective) {
        if (!theDirective) {
            return;
        }

        this._darePerfectScrollbar = theDirective;

        // Update the scrollbar on collapsable item toggle
        this._dareNavigationService.onItemCollapseToggled
            .pipe(
                delay(500),
                takeUntil(this._unsubscribeAll)
            )
            .subscribe(() => {
                this._darePerfectScrollbar.update();
            });

        // Scroll to the active item position
        this._router.events
            .pipe(
                filter((event) => event instanceof NavigationEnd),
                take(1)
            )
            .subscribe(() => {
                setTimeout(() => {
                    this._darePerfectScrollbar.scrollToElement('navbar .nav-link.active', -120);
                });
            }
            );
    }

    ngOnInit(): void {
        this._router.events
            .pipe(
                filter((event) => event instanceof NavigationEnd),
                takeUntil(this._unsubscribeAll)
            )
            .subscribe(() => {
                if (this._dareSidebarService.getSidebar('navbar')) {
                    this._dareSidebarService.getSidebar('navbar').close();
                }
            }
            );

        // Subscribe to the config changes
        this._dareConfigService.config
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((config) => {
                this.dareConfig = config;
            });

        // Get current navigation
        this._dareNavigationService.onNavigationChanged
            .pipe(
                filter(value => value !== null),
                takeUntil(this._unsubscribeAll)
            )
            .subscribe(() => {
                this.navigation = this._dareNavigationService.getCurrentNavigation();
            });
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    toggleSidebarOpened(): void {
        this._dareSidebarService.getSidebar('navbar').toggleOpen();
    }

    toggleSidebarFolded(): void {
        this._dareSidebarService.getSidebar('navbar').toggleFold();
    }
}
