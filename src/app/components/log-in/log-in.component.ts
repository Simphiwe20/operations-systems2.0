import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ApiServicesService } from 'src/app/api-service/api-services.service';
import { SharedServicesService } from 'src/app/services/shared-services.service';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.scss']
})
export class LogInComponent {
  users: any;
  userCredentials: any = {email: '', password: ''}
  emailPattern: any = /^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/
  showPwd: boolean = false

  constructor(private sharedService: SharedServicesService, private router: Router, 
    private snackBar: MatSnackBar, private apiService: ApiServicesService ) {}

  submit(form: NgForm): any {
    if(!form.valid) return

    this.apiService.genericPostAPI('/sign-in', this.userCredentials)
        .subscribe({
          next: (res) => {
            this.router.navigate(['/landing'])
            sessionStorage.setItem('user', JSON.stringify(res))
            console.log(res)
          },
          error: (err) => {
            console.log(err)
            this.snackBar.open(err.error.Error, 'OK', {duration: 3000})
          },
          complete: () => {}
        })
  }

  
  isVisible() {
    this.showPwd = !this.showPwd
  }
}
