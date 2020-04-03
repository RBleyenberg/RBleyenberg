import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

import { DareConfirmDialogComponent } from '@dare/components/confirm-dialog/confirm-dialog.component';

@NgModule({
    declarations: [
        DareConfirmDialogComponent
    ],
    imports: [
        MatDialogModule,
        MatButtonModule
    ],
    entryComponents: [
        DareConfirmDialogComponent
    ],
})
export class DareConfirmDialogModule
{
}
