import { NgModule } from '@angular/core';

import { DareIfOnDomDirective } from '@dare/directives/dare-if-on-dom/dare-if-on-dom.directive';
import { DareInnerScrollDirective } from '@dare/directives/dare-inner-scroll/dare-inner-scroll.directive';
import { DarePerfectScrollbarDirective } from '@dare/directives/dare-perfect-scrollbar/dare-perfect-scrollbar.directive';
import { DareMatSidenavHelperDirective, DareMatSidenavTogglerDirective } from '@dare/directives/dare-mat-sidenav/dare-mat-sidenav.directive';

@NgModule({
    declarations: [
        DareIfOnDomDirective,
        DareInnerScrollDirective,
        DareMatSidenavHelperDirective,
        DareMatSidenavTogglerDirective,
        DarePerfectScrollbarDirective
    ],
    imports     : [],
    exports     : [
        DareIfOnDomDirective,
        DareInnerScrollDirective,
        DareMatSidenavHelperDirective,
        DareMatSidenavTogglerDirective,
        DarePerfectScrollbarDirective
    ]
})
export class DareDirectivesModule
{
}
