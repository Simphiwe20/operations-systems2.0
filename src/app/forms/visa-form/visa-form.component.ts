import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ApiServicesService } from 'src/app/api-service/api-services.service';
import { SharedServicesService } from 'src/app/services/shared-services.service';

@Component({
  selector: 'app-visa-form',
  templateUrl: './visa-form.component.html',
  styleUrls: ['./visa-form.component.scss']
})
export class VisaFormComponent {
  visaRequestTypes: string[] = ['Application', 'Replacement', 'Extension']
  user: any;
  visaForm: any = {
    visaType: '',
    replacementReason: '',
    neededDate: '',
    status: 'Pending'
  }
  userVisas: any;
  visas: any;
  id: any = `${new Date().getFullYear()}${0}${Math.floor((Math.random() * 500) + 100)}`

  constructor(private sharedService: SharedServicesService, private dialogRef: MatDialogRef<VisaFormComponent>,
    private api: ApiServicesService) {
    this.user = this.sharedService.getData('session', 'user')
    this.visas = this.sharedService.getData('local', 'visas')
  }

  submit(form: NgForm): void {
    if (!form.valid) return
    console.log(this.visaForm)
    if (this.visaForm['replacementReason'] === '') this.visaForm['replacementReason'] = 'N/A'

    this.visaForm['reqID'] = `visa-${this.id}`
    this.visaForm['requestedBy'] = `${this.user.firstName} ${this.user.lastName}`
    this.visaForm['requestedByEmail'] = this.user.email
    this.visaForm['department'] = this.user.department
    this.id++
    debugger
    this.api.genericPostAPI('/addVisa', this.visaForm)
      .subscribe({
        next: (_res) => {
          if (_res) {
            this.close('Visa request sucessfuly made')
            console.log(_res)
          }
        },
        error: () => { },
        complete: () => { }
      })
  }

  close(message: string = ''): void {
    this.dialogRef.close(message)
  }

}
