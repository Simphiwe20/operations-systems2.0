import { AfterViewInit, Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ProfileComponent } from '../profile/profile.component';
import { NotificationsComponent } from 'src/app/popUps/notifications/notifications.component';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { Notification } from 'src/app/interface/notification';
import { ApiServicesService } from 'src/app/api-service/api-services.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements AfterViewInit {
  user: any;
  menuItems: any = []
  managerItems: any = []
  initials: any;
  clicked: number = 0;
  dashboardClicked: number = 1
  extend: boolean = false
  scale: boolean = false
  notifications: Notification[] = []
  showBtmSheet: boolean = false

  constructor(private router: Router, private dialog: MatDialog, private bottomSheet: MatBottomSheet,
    private api: ApiServicesService
  ) {
    this.user = sessionStorage.getItem('user')
    this.user = this.user ? JSON.parse(this.user) : []
    this.firstRoute()
    this.initials = `${this.user.firstName.substring(0, 1)}${this.user.lastName.substring(0, 1)}`
    this.getNotifications()

    if (this.user.role === 'admin') {
      this.menuItems = [
        { menu: 'Dashboard', route: 'dashboard' },
        { menu: 'Users', route: 'users' },
        // { menu: 'Approved leaves', route: 'leaves' },
        { menu: 'Policies', route: 'policies' }
      ]
    } else if (this.user.role === 'operations personnel') {
      this.menuItems = [
        { menu: 'Dashboard', route: 'dashboard' },
        { menu: 'GuestHouse', route: 'guesthouse' },
        { menu: 'Visa', route: 'visa' },
        { menu: 'Transport', route: 'transport' },
        { menu: 'Travels', route: 'travels' },
        { menu: 'Policies', route: 'policies' }
      ]
    } else {
      this.menuItems = [
        { menu: 'Dashboard', route: 'dashboard' },
        { menu: 'Leaves', route: 'leaves' },
        { menu: 'GuestHouse', route: 'guesthouse' },
        { menu: 'Visa', route: 'visa' },
        { menu: 'Transport', route: 'transport' },
        { menu: 'Travels', route: 'travels' },
        { menu: 'Policies', route: 'policies' }

      ]
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      console.log('this.showBtmSheet: ', this.showBtmSheet)
      if (this.showBtmSheet) {
        this.openBottomSheet()
      }
    }, 1000)

  }

  LogOut(): void {
    sessionStorage.clear()
    this.router.navigate(['/log-in'])
  }

  firstRoute(): void {
    this.router.navigate(['/landing/dashboard'])
  }

  openBottomSheet(): void {
    let btmSheetRef = this.bottomSheet.open(NotificationsComponent)
    console.log('btmSheetRef: ', btmSheetRef)
    setTimeout(() => {
        btmSheetRef.dismiss('CLOSED')
    }, 10000);
  }

  openNotifications() {
    this.extend = false
  }

  openProfile(): void {
    this.dialog.open(ProfileComponent, { width: '70%', height: '90%' })
    this.extend = false
  }

  viewMore(): void {
    if (!this.scale) {
      this.scale = !this.scale
    } else {
      this.scale = !this.scale
    }
  }

  Extend(): void {
    if (!this.extend) {
      this.extend = !this.extend
      console.log(this.extend)
    } else {
      this.extend = !this.extend
      console.log(this.extend)

    }
  }

  readNotification() {
    console.log('NOTIFICATION READ')
  }

  deleteNotification() {
    console.log('NOTIFICATION DELETE')
  }

  getNotifications() {
    this.api.genericGetAPI('/get-notifications')
      .subscribe({
        next: (res: any) => {
          console.log('RES Notifications: ', res)
          if (typeof res != undefined) {
            this.notifications = res.filter((notification: any) => {
              if (this.user.role == 'employee' && notification.for == this.user.email) {
                if (notification.popedUp) {
                  this.showBtmSheet = true
                  console.log('notification.popedUp: ', notification.popedUp)
                }
                return notification
              } else if (this.user.role.includes('manager') && notification.for.includes(this.user.department)) {
                if (notification.popedUp) {
                  this.showBtmSheet = true
                  console.log('notification.popedUp: ', notification.popedUp)

                }
                return notification
              }
            })
          }
        },
        error: (err) => { console.log('ERR: ', err) },
        complete: () => { }
      })
  }
}
