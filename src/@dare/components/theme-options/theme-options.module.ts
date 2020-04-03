import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { DareDirectivesModule } from '@dare/directives/directives';
import { DareMaterialColorPickerModule } from '@dare/components/material-color-picker/material-color-picker.module';
import { DareSidebarModule } from '@dare/components/sidebar/sidebar.module';

import { DareThemeOptionsComponent } from '@dare/components/theme-options/theme-options.component';

@NgModule({
    declarations: [
        DareThemeOptionsComponent
    ],
    imports     : [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,

        FlexLayoutModule,

        MatButtonModule,
        MatCheckboxModule,
        MatDividerModule,
        MatFormFieldModule,
        MatIconModule,
        MatOptionModule,
        MatRadioModule,
        MatSelectModule,
        MatSlideToggleModule,

        DareDirectivesModule,
        DareMaterialColorPickerModule,
        DareSidebarModule
    ],
    exports     : [
        DareThemeOptionsComponent
    ]
})
export class DareThemeOptionsModule
{
}
