import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { DareSharedModule } from '@dare/shared.module';

import { ContentComponent } from 'app/layout/components/content/content.component';

@NgModule({
    declarations: [
        ContentComponent
    ],
    imports     : [
        RouterModule,
        DareSharedModule
    ],
    exports     : [
        ContentComponent
    ]
})
export class ContentModule
{
}
