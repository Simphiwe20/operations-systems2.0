import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
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
    status: 'Submitted'
  }
  userVisas: any;
  visas: any;
  id: any = `${new Date().getFullYear()}${0}${Math.floor((Math.random() * 500 ) + 100)}`

  constructor(private sharedService: SharedServicesService, private dialogRef: MatDialogRef<VisaFormComponent>){
    this.user = this.sharedService.getData('session', 'user')
    this.visas = this.sharedService.getData('local', 'visas')
  }

  submit(form: NgForm): void {
    if(form.valid) {
      console.log(this.visaForm)
      if(this.visaForm['replacementReason'] === '') {
        this.visaForm['replacementReason'] = 'N/A'
      }
      this.visaForm['reqID'] = `visa-${this.id}`
      this.visaForm['requestedBy'] = `${this.user.firstName} ${this.user.lastName}`
      this.visaForm['requestedByEmail'] = this.user.email
      this.visaForm['department'] = this.user.department
      this.visas.push(this.visaForm)
      this.sharedService.storeData('local', 'visas', this.visas)
      this.id++
    }
    this.close('Visa request sucessfuly made')
  }

  close(message: string =''): void {
    this.dialogRef.close(message)
  }

}
