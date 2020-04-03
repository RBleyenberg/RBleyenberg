import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../material.module';
import { ShellComponent } from './shell/shell.component';
import { DareModule } from '@dare/dare.module';
import { dareConfig } from 'app/dare-config';
import { DareProgressBarModule, DareSidebarModule, DareThemeOptionsModule } from '@dare/components';
import { DareSharedModule } from '@dare/shared.module';
import { SampleModule } from 'app/main/sample/sample.module';
import { ItemModule } from 'app/main/items/items.module';
import { LayoutModule } from 'app/layout/layout.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    MaterialModule,
    RouterModule,

    TranslateModule.forRoot(),

    // Dare modules
    DareModule.forRoot(dareConfig),
    DareProgressBarModule,
    DareSharedModule,
    DareSidebarModule,
    DareThemeOptionsModule,

    // App modules
    LayoutModule,
    SampleModule,
    ItemModule
  ],
  declarations: [ShellComponent]
})
export class CoreModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: CoreModule
    };
  }

  constructor(
    @Optional()
    @SkipSelf()
    parentModule?: CoreModule
  ) {
    if (parentModule) {
      throw new Error(`${parentModule} has already been loaded. Import core module in the AppModule only.`);
    }
  }
}
