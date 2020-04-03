import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { DareSharedModule } from '@dare/shared.module';
import { SampleComponent } from './sample.component';
import { MatIconModule } from '@angular/material/icon';
import { routes } from './sample.routing';

@NgModule({
    declarations: [
        SampleComponent
    ],
    imports: [
        RouterModule.forChild(routes),
        TranslateModule,
        DareSharedModule,
        MatIconModule
    ],
    exports: [
        SampleComponent
    ]
})

export class SampleModule {
}
