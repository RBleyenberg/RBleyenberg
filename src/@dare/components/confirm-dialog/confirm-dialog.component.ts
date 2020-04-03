import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'dare-confirm-dialog',
    templateUrl: './confirm-dialog.component.html',
    styleUrls: ['./confirm-dialog.component.scss']
})
export class DareConfirmDialogComponent {
    public confirmMessage: string;

    constructor(public dialogRef: MatDialogRef<DareConfirmDialogComponent>) {

    }

}
