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
  adminAccount: any = {department: "IT", email : "admin@neutrinos.co", firstName: "built-in", 
                      lastName: "admin", occupation:  "None", password: "admin@123", role: "admin", status:"active"}

  constructor(private sharedService: SharedServicesService, private router: Router, 
    private snackBar: MatSnackBar, private apiService: ApiServicesService ) {
      // this.users = this.sharedService.getData('local', 'users')
      
      // if(!this.users.length) {
      //   this.users.push({
      //     email: 'admin@neutrinos.co',
      //     firstName: 'Built-in',
      //     lastName: 'Admin',
      //     password: 'admin@123',
      //     status: 'active',
      //     role: 'admin'
      //   })
      // }
      // this.sharedService.storeData('local', 'users', this.users)
    }

    ngOnInit(): void {
      this.apiService.genericGetAPI
      ('/get-users')
        .subscribe({
          next: (res) => {
            console.log(res)
            this.users = res
            console.log(this.users)
          },
          error: (err) => console.log(err),
          complete: () => {}
        })

        setTimeout( () => {
          if(!this.users.length) {
          this.apiService.genericPostAPI('/add-user', this.adminAccount)
          .subscribe({
            next: (res) => {console.log(res)},
            error: (err) => {console.log(err)},
            complete: () => {}
          })
        }
        }, 3000)        
    }

  submit(form: NgForm): any {
    if(!form.valid) return

    this.apiService.genericPostAPI('/sign-in', this.adminAccount)
        .subscribe({
          next: (res) => {
            this.router.navigate(['/landing'])
            sessionStorage.setItem('user', JSON.stringify(res))
            console.log(res)
          },
          error: (err) => {
            console.log(err)
            this.snackBar.open(err.error, 'OK', {duration: 3000})
          },
          complete: () => {}
        })
  }
}
