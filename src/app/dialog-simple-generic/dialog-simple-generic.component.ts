

import {
  Component,
  Inject,
 } from '@angular/core';

import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material';

@Component({
  selector: 'app-dialog-simple-generic',
  templateUrl: './dialog-simple-generic.component.html',
  styleUrls: ['./dialog-simple-generic.component.css']
})
export class DialogSimpleGenericComponent {

  constructor(
    public dialogRef: MatDialogRef<DialogSimpleGenericComponent>,
     @Inject(MAT_DIALOG_DATA) public data: any
  ) {}



}
