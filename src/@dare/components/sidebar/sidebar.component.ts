import {
    ChangeDetectorRef, Component, ElementRef, EventEmitter, HostBinding, HostListener, Input, OnDestroy, OnInit, Output, Renderer2, ViewEncapsulation
} from '@angular/core';
import { animate, AnimationBuilder, AnimationPlayer, style } from '@angular/animations';
import { MediaObserver } from '@angular/flex-layout';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { DareSidebarService } from './sidebar.service';
import { DareMatchMediaService } from '@dare/services/match-media.service';
import { DareConfigService } from '@dare/services/config.service';

@Component({
    selector: 'dare-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class DareSidebarComponent implements OnInit, OnDestroy {
    // Name
    @Input()
    name: string;

    // Key
    @Input()
    key: string;

    // Position
    @Input()
    position: 'left' | 'right';

    // Open
    @HostBinding('class.open')
    opened: boolean;

    // Locked Open
    @Input()
    lockedOpen: string;

    // isLockedOpen
    @HostBinding('class.locked-open')
    isLockedOpen: boolean;

    // Folded width
    @Input()
    foldedWidth: number;

    // Folded auto trigger on hover
    @Input()
    foldedAutoTriggerOnHover: boolean;

    // Folded unfolded
    @HostBinding('class.unfolded')
    unfolded: boolean;

    // Invisible overlay
    @Input()
    invisibleOverlay: boolean;

    // Folded changed
    @Output()
    foldedChanged: EventEmitter<boolean>;

    // Opened changed
    @Output()
    openedChanged: EventEmitter<boolean>;

    // Private
    private _folded: boolean;
    private _dareConfig: any;
    private _wasActive: boolean;
    private _wasFolded: boolean;
    private _backdrop: HTMLElement | null = null;
    private _player: AnimationPlayer;
    private _unsubscribeAll: Subject<any>;

    @HostBinding('class.animations-enabled')
    private _animationsEnabled: boolean;

    constructor(
        private _animationBuilder: AnimationBuilder,
        private _changeDetectorRef: ChangeDetectorRef,
        private _elementRef: ElementRef,
        private _dareConfigService: DareConfigService,
        private _dareMatchMediaService: DareMatchMediaService,
        private _dareSidebarService: DareSidebarService,
        private _mediaObserver: MediaObserver,
        private _renderer: Renderer2
    ) {
        // Set the defaults
        this.foldedAutoTriggerOnHover = true;
        this.foldedWidth = 64;
        this.foldedChanged = new EventEmitter();
        this.openedChanged = new EventEmitter();
        this.opened = false;
        this.position = 'left';
        this.invisibleOverlay = false;

        // Set the private defaults
        this._animationsEnabled = false;
        this._folded = false;
        this._unsubscribeAll = new Subject();
    }

    @Input()
    set folded(value: boolean) {
        // Set the folded
        this._folded = value;

        // Return if the sidebar is closed
        if (!this.opened) {
            return;
        }

        // Programmatically add/remove padding to the element
        // that comes after or before based on the position
        let sibling,
            styleRule;

        const styleValue = this.foldedWidth + 'px';

        // Get the sibling and set the style rule
        if (this.position === 'left') {
            sibling = this._elementRef.nativeElement.nextElementSibling;
            styleRule = 'padding-left';
        }
        else {
            sibling = this._elementRef.nativeElement.previousElementSibling;
            styleRule = 'padding-right';
        }

        // If there is no sibling, return...
        if (!sibling) {
            return;
        }

        // If folded...
        if (value) {
            // Fold the sidebar
            this.fold();

            // Set the folded width
            this._renderer.setStyle(this._elementRef.nativeElement, 'width', styleValue);
            this._renderer.setStyle(this._elementRef.nativeElement, 'min-width', styleValue);
            this._renderer.setStyle(this._elementRef.nativeElement, 'max-width', styleValue);

            // Set the style and class
            this._renderer.setStyle(sibling, styleRule, styleValue);
            this._renderer.addClass(this._elementRef.nativeElement, 'folded');
        }
        // If unfolded...
        else {
            // Unfold the sidebar
            this.unfold();

            // Remove the folded width
            this._renderer.removeStyle(this._elementRef.nativeElement, 'width');
            this._renderer.removeStyle(this._elementRef.nativeElement, 'min-width');
            this._renderer.removeStyle(this._elementRef.nativeElement, 'max-width');

            // Remove the style and class
            this._renderer.removeStyle(sibling, styleRule);
            this._renderer.removeClass(this._elementRef.nativeElement, 'folded');
        }

        // Emit the 'foldedChanged' event
        this.foldedChanged.emit(this.folded);
    }

    get folded(): boolean {
        return this._folded;
    }

    ngOnInit(): void {
        // Subscribe to config changes
        this._dareConfigService.config
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((config) => {
                this._dareConfig = config;
            });

        // Register the sidebar
        this._dareSidebarService.register(this.name, this);

        // Setup visibility
        this._setupVisibility();

        // Setup position
        this._setupPosition();

        // Setup lockedOpen
        this._setupLockedOpen();

        // Setup folded
        this._setupFolded();
    }

    ngOnDestroy(): void {
        // If the sidebar is folded, unfold it to revert modifications
        if (this.folded) {
            this.unfold();
        }

        // Unregister the sidebar
        this._dareSidebarService.unregister(this.name);

        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    private _setupVisibility(): void {
        // Remove the existing box-shadow
        this._renderer.setStyle(this._elementRef.nativeElement, 'box-shadow', 'none');

        // Make the sidebar invisible
        this._renderer.setStyle(this._elementRef.nativeElement, 'visibility', 'hidden');
    }

    private _setupPosition(): void {
        // Add the correct class name to the sidebar
        // element depending on the position attribute
        if (this.position === 'right') {
            this._renderer.addClass(this._elementRef.nativeElement, 'right-positioned');
        }
        else {
            this._renderer.addClass(this._elementRef.nativeElement, 'left-positioned');
        }
    }

    private _setupLockedOpen(): void {
        // Return if the lockedOpen wasn't set
        if (!this.lockedOpen) {
            // Return
            return;
        }

        // Set the wasActive for the first time
        this._wasActive = false;

        // Set the wasFolded
        this._wasFolded = this.folded;

        // Show the sidebar
        this._showSidebar();

        // Act on every media change
        this._dareMatchMediaService.onMediaChange
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {

                // Get the active status
                const isActive = this._mediaObserver.isActive(this.lockedOpen);

                // If the both status are the same, don't act
                if (this._wasActive === isActive) {
                    return;
                }

                // Activate the lockedOpen
                if (isActive) {
                    // Set the lockedOpen status
                    this.isLockedOpen = true;

                    // Show the sidebar
                    this._showSidebar();

                    // Force the the opened status to true
                    this.opened = true;

                    // Emit the 'openedChanged' event
                    this.openedChanged.emit(this.opened);

                    // If the sidebar was folded, forcefully fold it again
                    if (this._wasFolded) {
                        // Enable the animations
                        this._enableAnimations();

                        // Fold
                        this.folded = true;

                        // Mark for check
                        this._changeDetectorRef.markForCheck();
                    }

                    // Hide the backdrop if any exists
                    this._hideBackdrop();
                }
                // De-Activate the lockedOpen
                else {
                    // Set the lockedOpen status
                    this.isLockedOpen = false;

                    // Unfold the sidebar in case if it was folded
                    this.unfold();

                    // Force the the opened status to close
                    this.opened = false;

                    // Emit the 'openedChanged' event
                    this.openedChanged.emit(this.opened);

                    // Hide the sidebar
                    this._hideSidebar();
                }

                // Store the new active status
                this._wasActive = isActive;
            });
    }

    private _setupFolded(): void {
        // Return, if sidebar is not folded
        if (!this.folded) {
            return;
        }

        // Return if the sidebar is closed
        if (!this.opened) {
            return;
        }

        // Programmatically add/remove padding to the element
        // that comes after or before based on the position
        let sibling,
            styleRule;

        const styleValue = this.foldedWidth + 'px';

        // Get the sibling and set the style rule
        if (this.position === 'left') {
            sibling = this._elementRef.nativeElement.nextElementSibling;
            styleRule = 'padding-left';
        }
        else {
            sibling = this._elementRef.nativeElement.previousElementSibling;
            styleRule = 'padding-right';
        }

        // If there is no sibling, return...
        if (!sibling) {
            return;
        }

        // Fold the sidebar
        this.fold();

        // Set the folded width
        this._renderer.setStyle(this._elementRef.nativeElement, 'width', styleValue);
        this._renderer.setStyle(this._elementRef.nativeElement, 'min-width', styleValue);
        this._renderer.setStyle(this._elementRef.nativeElement, 'max-width', styleValue);

        // Set the style and class
        this._renderer.setStyle(sibling, styleRule, styleValue);
        this._renderer.addClass(this._elementRef.nativeElement, 'folded');
    }

    private _showBackdrop(): void {
        // Create the backdrop element
        this._backdrop = this._renderer.createElement('div');

        // Add a class to the backdrop element
        this._backdrop.classList.add('dare-sidebar-overlay');

        // Add a class depending on the invisibleOverlay option
        if (this.invisibleOverlay) {
            this._backdrop.classList.add('dare-sidebar-overlay-invisible');
        }

        // Append the backdrop to the parent of the sidebar
        this._renderer.appendChild(this._elementRef.nativeElement.parentElement, this._backdrop);

        // Create the enter animation and attach it to the player
        this._player =
            this._animationBuilder
                .build([
                    animate('300ms ease', style({ opacity: 1 }))
                ]).create(this._backdrop);

        // Play the animation
        this._player.play();

        // Add an event listener to the overlay
        this._backdrop.addEventListener('click', () => {
            this.close();
        }
        );

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    private _hideBackdrop(): void {
        if (!this._backdrop) {
            return;
        }

        // Create the leave animation and attach it to the player
        this._player =
            this._animationBuilder
                .build([
                    animate('300ms ease', style({ opacity: 0 }))
                ]).create(this._backdrop);

        // Play the animation
        this._player.play();

        // Once the animation is done...
        this._player.onDone(() => {

            // If the backdrop still exists...
            if (this._backdrop) {
                // Remove the backdrop
                this._backdrop.parentNode.removeChild(this._backdrop);
                this._backdrop = null;
            }
        });

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    private _showSidebar(): void {
        // Remove the box-shadow style
        this._renderer.removeStyle(this._elementRef.nativeElement, 'box-shadow');

        // Make the sidebar invisible
        this._renderer.removeStyle(this._elementRef.nativeElement, 'visibility');

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    private _hideSidebar(delay = true): void {
        const delayAmount = delay ? 300 : 0;

        // Add a delay so close animation can play
        setTimeout(() => {

            // Remove the box-shadow
            this._renderer.setStyle(this._elementRef.nativeElement, 'box-shadow', 'none');

            // Make the sidebar invisible
            this._renderer.setStyle(this._elementRef.nativeElement, 'visibility', 'hidden');
        }, delayAmount);

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    private _enableAnimations(): void {
        // Return if animations already enabled
        if (this._animationsEnabled) {
            return;
        }

        // Enable the animations
        this._animationsEnabled = true;

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    open(): void {
        if (this.opened || this.isLockedOpen) {
            return;
        }

        // Enable the animations
        this._enableAnimations();

        // Show the sidebar
        this._showSidebar();

        // Show the backdrop
        this._showBackdrop();

        // Set the opened status
        this.opened = true;

        // Emit the 'openedChanged' event
        this.openedChanged.emit(this.opened);

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    close(): void {
        if (!this.opened || this.isLockedOpen) {
            return;
        }

        // Enable the animations
        this._enableAnimations();

        // Hide the backdrop
        this._hideBackdrop();

        // Set the opened status
        this.opened = false;

        // Emit the 'openedChanged' event
        this.openedChanged.emit(this.opened);

        // Hide the sidebar
        this._hideSidebar();

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    toggleOpen(): void {
        if (this.opened) {
            this.close();
        }
        else {
            this.open();
        }
    }

    @HostListener('mouseenter')
    onMouseEnter(): void {
        // Only work if the auto trigger is enabled
        if (!this.foldedAutoTriggerOnHover) {
            return;
        }

        this.unfoldTemporarily();
    }

    @HostListener('mouseleave')
    onMouseLeave(): void {
        // Only work if the auto trigger is enabled
        if (!this.foldedAutoTriggerOnHover) {
            return;
        }

        this.foldTemporarily();
    }

    fold(): void {
        // Only work if the sidebar is not folded
        if (this.folded) {
            return;
        }

        // Enable the animations
        this._enableAnimations();

        // Fold
        this.folded = true;

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    unfold(): void {
        // Only work if the sidebar is folded
        if (!this.folded) {
            return;
        }

        // Enable the animations
        this._enableAnimations();

        // Unfold
        this.folded = false;

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    toggleFold(): void {
        if (this.folded) {
            this.unfold();
        }
        else {
            this.fold();
        }
    }

    foldTemporarily(): void {
        // Only work if the sidebar is folded
        if (!this.folded) {
            return;
        }

        // Enable the animations
        this._enableAnimations();

        // Fold the sidebar back
        this.unfolded = false;

        // Set the folded width
        const styleValue = this.foldedWidth + 'px';

        this._renderer.setStyle(this._elementRef.nativeElement, 'width', styleValue);
        this._renderer.setStyle(this._elementRef.nativeElement, 'min-width', styleValue);
        this._renderer.setStyle(this._elementRef.nativeElement, 'max-width', styleValue);

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    unfoldTemporarily(): void {
        // Only work if the sidebar is folded
        if (!this.folded) {
            return;
        }

        // Enable the animations
        this._enableAnimations();

        // Unfold the sidebar temporarily
        this.unfolded = true;

        // Remove the folded width
        this._renderer.removeStyle(this._elementRef.nativeElement, 'width');
        this._renderer.removeStyle(this._elementRef.nativeElement, 'min-width');
        this._renderer.removeStyle(this._elementRef.nativeElement, 'max-width');

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }
}
