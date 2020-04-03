import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { Subject } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { DareConfigService } from '@dare/services/config.service';
import { DareNavigationService } from '@dare/components/navigation/navigation.service';
import { DareSidebarService } from '@dare/components/sidebar/sidebar.service';
import { TranslateService } from '@ngx-translate/core';
import { Platform } from '@angular/cdk/platform';
import { takeUntil } from 'rxjs/operators';
import { DareSplashScreenService } from '@dare/services/splash-screen.service';
import { DareTranslationLoaderService } from '@dare/services/translation-loader.service';

import { navigation } from 'app/navigation/navigation';
import { locale as navigationEnglish } from 'app/navigation/i18n/en';
import { locale as navigationTurkish } from 'app/navigation/i18n/tr';

@Component({
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss']
})
export class ShellComponent implements OnInit, OnDestroy {
  dareConfig: any;
  navigation: any;

  private _unsubscribeAll: Subject<any>;

  constructor(
      @Inject(DOCUMENT) private document: any,
      private _dareConfigService: DareConfigService,
      private _dareNavigationService: DareNavigationService,
      private _dareSidebarService: DareSidebarService,
      private _dareSplashScreenService: DareSplashScreenService,
      private _dareTranslationLoaderService: DareTranslationLoaderService,
      private _translateService: TranslateService,
      private _platform: Platform
  ) {
      // Get default navigation
      this.navigation = navigation;

      // Register the navigation to the service
      this._dareNavigationService.register('main', this.navigation);

      // Set the main navigation as our current navigation
      this._dareNavigationService.setCurrentNavigation('main');

      // Add languages
      this._translateService.addLangs(['en', 'tr']);

      // Set the default language
      this._translateService.setDefaultLang('en');

      // Set the navigation translations
      this._dareTranslationLoaderService.loadTranslations(navigationEnglish, navigationTurkish);

      // Use a language
      this._translateService.use('en');

      /**
       * ----------------------------------------------------------------------------------------------------
       * ngxTranslate Fix Start
       * ----------------------------------------------------------------------------------------------------
       */

      /**
       * This is related to ngxTranslate module and below there is a temporary fix while we
       * are moving the multi language implementation over to the Angular's core language
       * service.
       **/

      // '.use' cannot be used here as ngxTranslate won't switch to a language that's already
      // been selected and there is no way to force it, so we overcome the issue by switching
      // the default language back and forth.
      /**
       setTimeout(() => {
          this._translateService.setDefaultLang('en');
          this._translateService.setDefaultLang('tr');
       });
       */

      /**
       * ----------------------------------------------------------------------------------------------------
       * ngxTranslate Fix End
       * ----------------------------------------------------------------------------------------------------
       */

      // Add is-mobile class to the body if the platform is mobile
      if (this._platform.ANDROID || this._platform.IOS) {
          this.document.body.classList.add('is-mobile');
      }

      // Set the private defaults
      this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
      // Subscribe to config changes
      this._dareConfigService.config
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe((config) => {

              this.dareConfig = config;

              // Boxed
              if (this.dareConfig.layout.width === 'boxed') {
                  this.document.body.classList.add('boxed');
              }
              else {
                  this.document.body.classList.remove('boxed');
              }

              // Color theme - Use normal for loop for IE11 compatibility
              for (let i = 0; i < this.document.body.classList.length; i++) {
                  const className = this.document.body.classList[i];

                  if (className.startsWith('theme-')) {
                      this.document.body.classList.remove(className);
                  }
              }

              this.document.body.classList.add(this.dareConfig.colorTheme);
          });
  }

  ngOnDestroy(): void {
      // Unsubscribe from all subscriptions
      this._unsubscribeAll.next();
      this._unsubscribeAll.complete();
  }

  toggleSidebarOpen(key): void {
      this._dareSidebarService.getSidebar(key).toggleOpen();
  }
}
