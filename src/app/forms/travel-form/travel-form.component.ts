import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { SharedServicesService } from 'src/app/services/shared-services.service';

@Component({
  selector: 'app-travel-form',
  templateUrl: './travel-form.component.html',
  styleUrls: ['./travel-form.component.scss']
})
export class TravelFormComponent {
  travelTypes: string[] = ['International Travel', 'Domestic Travel']

  travelForm: any = {
    departureDate: '',
    returnDate: '',
    travelType: '',
    reasonForTravel: '',
    specialNeeds: '',
    status: 'Pending'
  }
  user: any;
  travelData: any;
  id: any = `${new Date().getFullYear()}${0}${Math.floor((Math.random() * 500 ) + 100)}`

  constructor(private sharedService: SharedServicesService, private dialogRef: MatDialogRef<TravelFormComponent>) {
    this.travelData = this.sharedService.getData('local', 'travels')
    this.user = this.sharedService.getData('session', 'user')
  }

  submit(form: NgForm): void {
    if(form.valid) {
      if(this.travelForm['specialNeeds'] === '') {
        this.travelForm['specialNeeds'] = 'None'
      }
      this.travelForm['reqID'] = `travel-${this.id}`
      this.travelForm['requestedBy'] = `${this.user.firstName} ${this.user.lastName}`
      this.travelForm['requestedByEmail'] = this.user.email
      this.travelForm['department'] = this.user.department
      console.log(this.id)
      console.log(this.travelForm)
      this.travelData.push(this.travelForm)
      this.sharedService.storeData('local', 'travels', this.travelData)
    }
    this.close('Transport request added successfuly')
  }

  close(message: string =''): void {
    this.dialogRef.close(message)
  }

}

