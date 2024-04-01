import { DialogRef } from '@angular/cdk/dialog';
import { Component } from '@angular/core';

@Component({
  selector: 'app-delete-pop-up',
  templateUrl: './delete-pop-up.component.html',
  styleUrls: ['./delete-pop-up.component.scss']
})
export class DeletePopUpComponent {

  constructor(private dialogRef: DialogRef) {}

  close(msg: string): void {
    this.dialogRef.close(msg)
    console.log(msg)
    console.log(this.dialogRef.close(msg))
  }
}
