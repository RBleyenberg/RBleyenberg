import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { DareSharedModule } from '@dare/shared.module';
import { ItemComponent } from './items.component';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { routes } from './items.routing';

@NgModule({
    declarations: [
        ItemComponent,
    ],
    imports: [
        RouterModule.forChild(routes),
        TranslateModule,
        DareSharedModule,
        MatIconModule,
        MatRippleModule
    ],
    exports: [
        ItemComponent
    ]
})

export class ItemModule { }
