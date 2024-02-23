import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SharedServicesService } from 'src/app/services/shared-services.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  
  user: any;

  userNewPassword: any = {
    password: '',
    confirmPassword: ''
  }
  match: boolean = false
  employee: any;

  constructor(private sharedService: SharedServicesService, private dialogRef: MatDialogRef<ProfileComponent>, 
    private snackBar: MatSnackBar) {
    this.user = this.sharedService.getData('session', 'user')

    console.log(this.user)
    console.log(this.employee)
  }

  close(): void {
    this.dialogRef.close()
  }

  changePwd(ele: any): void {
    console.log(ele)
  }

  submit(form: NgForm): any {
    if(!form.valid) {
      return
    }if(this.userNewPassword.password === this.userNewPassword.confirmPassword) {
      this.snackBar.open
    }
  }
}
