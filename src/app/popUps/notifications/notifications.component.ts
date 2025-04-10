import { Component } from '@angular/core';
import { ApiServicesService } from 'src/app/api-service/api-services.service';
import { Notification } from 'src/app/interface/notification';
import { SharedServicesService } from 'src/app/services/shared-services.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent {
  paths: any;
  user: any;
  notifications: any;


  constructor(private api: ApiServicesService, private shared: SharedServicesService) {
    this.user = this.shared.getData('session', 'user')
    this.paths = ['/get-leaves', '/getGHRequests', '/getTransport', '/getTravel', '/getVisas']
    this.getNotifications()
  }

  getNotifications() {
    this.api.genericGetAPI('/get-notification')
      .subscribe({
        next: (res: any) => {
          console.log('RES Notifications: ', res)
          if (typeof res != undefined) {
            this.notifications = res.filter((notification: any) => {
              if (this.user.role == 'employee' && notification.for == this.user.email) {
                console.log(notification)
                console.log('notification.popedUp: ', notification.popedUp)
                if (notification.popedUp) {
                  this.updatePopedUp(notification)
                  return notification
                }
              } else if (this.user.role.includes('manager') && notification.for.includes(this.user.department)) {
                if (notification.popedUp) {
                  this.updatePopedUp(notification)
                  return notification
                }
              }
            })
          }
        },
        error: (err) => { console.log('ERR: ', err) },
        complete: () => { }
      })
  }

  updatePopedUp(payload: Notification) {
    payload.popedUp = !payload.popedUp
    this.api.genericUpdateAPI('/updatedNotifications', payload)
      .subscribe({
        next: (res) => {
          console.log('RES: ', res)
        },
        error: (ERR) => {
          console.log('ERR: ', ERR)
        },
        complete: () =>  {}
      })

  }
}
