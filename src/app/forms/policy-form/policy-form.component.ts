import { Component, Inject, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SharedServicesService } from 'src/app/services/shared-services.service';

@Component({
  selector: 'app-policy-form',
  templateUrl: './policy-form.component.html',
  styleUrls: ['./policy-form.component.scss']
})
export class PolicyFormComponent implements OnInit{

  policyForm: any = {
    policyName: '',
    category: '',
    overview: '',
    purpose: '',
    objective: '',
    guidlines: ''
  }
  policyData: any;
  isUpdate: boolean = false
  id: any = `${new Date().getFullYear()}${0}${Math.floor((Math.random() * 500 ) + 100)}`

  constructor(private sharedService: SharedServicesService, private dialogRef: MatDialogRef<PolicyFormComponent>,
    private snackBar: MatSnackBar, @Inject(MAT_DIALOG_DATA) public data: any) { 
      console.log(data)

      if(data) {
        this.isUpdate = true;
        this.policyForm = data;
      }
    }
  
    ngOnInit(): void {
      this.policyData = this.sharedService.getData('local' ,'policies')
      console.log(this.sharedService.getData('local' ,'policies'));

    }

  submit(form: NgForm): void {
    if(!form.valid) return

    if(this.isUpdate) {
      this.policyData = this.policyData.map((ele: any) => {
        if(ele['policy-id'] === this.data['policy-id']) {
          return this.policyForm
        }else {
          return ele
        }
      })
      this.close('Policy successfully updated')
    }else{
      console.log(this.policyForm)
      this.policyForm['policy-id'] = `policy-${this.id}`
      this.policyData.push(this.policyForm) 
      this.close('Policy Added successfully')
    }
    this.sharedService.storeData('local', 'policies', this.policyData)
  }

  close(message: string = '') {
    this.dialogRef.close(message)
  }
}

