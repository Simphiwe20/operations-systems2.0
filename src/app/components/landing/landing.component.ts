import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ProfileComponent } from '../profile/profile.component';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent {
  user: any;
  menuItems: any = []
  managerItems: any = []
  initials: any;
  clicked: number = 0;
  dashboardClicked: number = 1
  extend: boolean = false
  scale: boolean = false

  constructor(private router: Router, private dialog: MatDialog) {
    this.user = sessionStorage.getItem('user')
    this.user = this.user ? JSON.parse(this.user) : []
    // this.dashboardClicked = 1
    this.firstRoute()
    console.log(this.user.firstName)
    this.initials = `${this.user.firstName.substring(0, 1)}${this.user.lastName.substring(0, 1)}`

    if(this.user.role === 'admin') {
      this.menuItems = [
        {menu: 'Dashboard', route: 'dashboard'},
        {menu: 'Users', route: 'users'},
        {menu: 'View Approved leaves', route: 'leaves'},
        {menu: 'Policies', route: 'policies'}
      ]
    }else if(this.user.role === 'operations personnel') {
      this.menuItems = [
        {menu: 'Dashboard', route: 'dashboard'},
        {menu: 'GuestHouse', route: 'guesthouse'},
        {menu: 'Visa', route: 'visa'},
        {menu: 'Transport', route: 'transport'},
        {menu: 'Travels', route: 'travels'},
        {menu: 'Policies', route: 'policies'}
      ]
    }else{
      this.menuItems = [
        {menu: 'Dashboard', route: 'dashboard'},
        {menu: 'Leaves', route: 'leaves'},
        {menu: 'GuestHouse', route: 'guesthouse'},
        {menu: 'Visa', route: 'visa'},
        {menu: 'Transport', route: 'transport'},
        {menu: 'Travels', route: 'travels'},
        {menu: 'Policies', route: 'policies'}

      ]
    }
  }


  LogOut(): void {
    sessionStorage.clear()
    this.router.navigate(['/log-in'])
  }

  firstRoute(): void {
    this.router.navigate(['/landing/dashboard'])
  }

  // openMessage(): void  {
  //   this.dialog.open(MessagingComponent)
  // }

  openProfile(): void {
    this.dialog.open(ProfileComponent)
  }

  viewMore(): void {
    if(!this.scale) {
      this.scale = !this.scale
    }else {
      this.scale = !this.scale
    }
    
  }

  Extend(): void {
    if(!this.extend) {
      this.extend = !this.extend
      console.log(this.extend)
    }else {
      this.extend = !this.extend
      console.log(this.extend)

    }
  }
}
