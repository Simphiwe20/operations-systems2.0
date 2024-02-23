import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { SharedServicesService } from 'src/app/services/shared-services.service';

@Component({
  selector: 'app-guesthouse-form',
  templateUrl: './guesthouse-form.component.html',
  styleUrls: ['./guesthouse-form.component.scss']
})
export class GuesthouseFormComponent {

  guestHouseNames = ['Garden Court', 'Blue Waters', 'Premiers Hotel']
  guestHouseForm: any = {
    guestHouseName: '',
    checkInDate: '',
    checkOutDate: '',
    specialNeeds: '',
    status: 'Submitted'
  }
  guestHouseData: any;
  id: any = `${new Date().getFullYear()}${0}${Math.floor((Math.random() * 500) + 100)}`
  user: any;

  constructor(private sharedServices: SharedServicesService, private dialogRef: MatDialogRef<GuesthouseFormComponent>) {
    this.guestHouseData = this.sharedServices.getData('local', 'guesthouse')
    this.user = this.sharedServices.getData('session', 'user')
  }

  submit(form: NgForm) {
    if (form.valid) {
      if (this.guestHouseForm['specialNeeds'] === '') {
        this.guestHouseForm['specialNeeds'] = 'None'
      }
      this.guestHouseForm['reqID'] = `guestHouse-${this.id}`
      this.guestHouseForm['requestedBy'] = `${this.user.firstName} ${this.user.lastName}`
      this.guestHouseForm['requestedByEmail'] = `${this.user.email}`
      this.guestHouseForm['department'] = `${this.user.department}`
      this.guestHouseData.push(this.guestHouseForm)
      console.log(this.guestHouseForm)
      this.sharedServices.storeData('local', 'guesthouse', this.guestHouseData)
      this.close('GuestHouse request successfully added')

    }
  }

  close(message: string = ''): void {
    this.dialogRef.close(message)
  }
}

