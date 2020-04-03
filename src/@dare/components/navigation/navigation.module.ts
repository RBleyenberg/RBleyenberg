import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';

import { TranslateModule } from '@ngx-translate/core';

import { DareNavigationComponent } from './navigation.component';
import { DareNavVerticalItemComponent } from './vertical/item/item.component';
import { DareNavVerticalCollapsableComponent } from './vertical/collapsable/collapsable.component';
import { DareNavVerticalGroupComponent } from './vertical/group/group.component';
import { DareNavHorizontalItemComponent } from './horizontal/item/item.component';
import { DareNavHorizontalCollapsableComponent } from './horizontal/collapsable/collapsable.component';

@NgModule({
    imports     : [
        CommonModule,
        RouterModule,

        MatIconModule,
        MatRippleModule,

        TranslateModule.forChild()
    ],
    exports     : [
        DareNavigationComponent
    ],
    declarations: [
        DareNavigationComponent,
        DareNavVerticalGroupComponent,
        DareNavVerticalItemComponent,
        DareNavVerticalCollapsableComponent,
        DareNavHorizontalItemComponent,
        DareNavHorizontalCollapsableComponent
    ]
})
export class DareNavigationModule
{
}
