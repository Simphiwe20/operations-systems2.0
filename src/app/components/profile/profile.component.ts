import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiServicesService } from 'src/app/api-service/api-services.service';
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
  showPwd: boolean = false;
  showConfirmPwd: boolean = false;

  constructor(private sharedService: SharedServicesService, private dialogRef: MatDialogRef<ProfileComponent>, 
    private snackBar: MatSnackBar, private api: ApiServicesService) {
    this.user = this.sharedService.getData('session', 'user')

    console.log(this.user)
    console.log(this.employee)
  }

  close(): void {
    this.dialogRef.close()
  }

  changePwd(): void {
    console.log(this.userNewPassword)
    if(this.userNewPassword.confirmPassword !== this.userNewPassword.password) {
      this.snackBar.open('Passwords doesn\'t match', 'OK', {duration: 3000})
      return
    }

    let password = {
              password:  this.userNewPassword.password,
              email:  this.user.email
            }

    this.api.genericUpdateAPI('/update-password', password)
      .subscribe({
        next: (res) => {
          console.log('RES: ', res)
          this.close()
          this.snackBar.open('Passwords updated successfully', 'OK', {duration: 3000})
        },
        error: (err) => {console.log('ERR: ', err)},
        complete: () => {console.log('DONE...')},
      })
  }

  submit(form: NgForm): any {
    if(!form.valid) {
      return
    }if(this.userNewPassword.password === this.userNewPassword.confirmPassword) {
      this.snackBar.open
    }
  }

  isVisible(isPwd: boolean) {
    isPwd ? this.showPwd = !this.showPwd : this.showConfirmPwd = !this.showConfirmPwd

    console.log('this.showPwd: ', this.showPwd)
  }
}
