import { NgModule } from '@angular/core';

import { DareSidebarComponent } from './sidebar.component';

@NgModule({
    declarations: [
        DareSidebarComponent
    ],
    exports     : [
        DareSidebarComponent
    ]
})
export class DareSidebarModule
{
}
