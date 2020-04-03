import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';

import { DarePipesModule } from '@dare/pipes/pipes.module';

import { DareMaterialColorPickerComponent } from '@dare/components/material-color-picker/material-color-picker.component';

@NgModule({
    declarations: [
        DareMaterialColorPickerComponent
    ],
    imports: [
        CommonModule,

        FlexLayoutModule,

        MatButtonModule,
        MatIconModule,
        MatMenuModule,
        MatTooltipModule,

        DarePipesModule
    ],
    exports: [
        DareMaterialColorPickerComponent
    ],
})
export class DareMaterialColorPickerModule
{
}
