import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ApiServicesService } from 'src/app/api-service/api-services.service';
import { SharedServicesService } from 'src/app/services/shared-services.service';

@Component({
  selector: 'app-transport-form',
  templateUrl: './transport-form.component.html',
  styleUrls: ['./transport-form.component.scss']
})
export class TransportFormComponent {

  transportTypes: string[] = ['Airport Pick Up', 'Generic Pick Up']
  airportPickUpSpots: string[] = ['OR Tambo Airport', 'Lanseria Airport']
  genericPickUpSpots: string[] = ['Afrika Tikkun', 'Neutrinos']
  dropOffSpots: string[] = ['Afrika Tikkun', 'Afrika Tikkun', 'OR Tambo Airport', 'Lanseria Airport', 'Other']
  transportForm: any = {
    transportType: '',
    neededDate: '',
    pickUpSpot: '',
    pickUpReason: '',
    dropOffSpot: '',
    status: 'Pending' 

  }
  user: any;
  transportData: any;
  id: any = `${new Date().getFullYear()}${0}${Math.floor((Math.random() * 500 ) + 100)}`

  constructor(private sharedService: SharedServicesService, private dialogRef: MatDialogRef<TransportFormComponent>,
    private api: ApiServicesService) {
    this.transportData = this.sharedService.getData('local', 'transport')
    this.user = this.sharedService.getData('session', 'user')
  }

  submit(form: NgForm): void {
    if(!form.valid) return

      console.log(this.transportForm)
      this.transportForm['reqID'] = `transport-${this.id}`
      this.transportForm['requestedBy'] = `${this.user.firstName} ${this.user.lastName}`
      this.transportForm['requestedByEmail'] = this.user.email
      this.transportForm['department'] = this.user.department
      this.api.genericPostAPI('/addTransport', this.transportForm)
        .subscribe({
          next: (res) => {console.log(res)},
          error: (err) => {console.log(err)},
          complete: () => {}
        })

    this.close('Transport request added successfuly')
  }

  close(message: string='') {
    this.dialogRef.close(message)
  }
}
