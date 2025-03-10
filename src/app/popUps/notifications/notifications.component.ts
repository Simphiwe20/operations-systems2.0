import { Component } from '@angular/core';
import { ApiServicesService } from 'src/app/api-service/api-services.service';
import { SharedServicesService } from 'src/app/services/shared-services.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent {
  notification: any[] = [];
  data: any;
  paths: any;
  user: any;
  notifications: any;

  constructor(private api: ApiServicesService, private shared: SharedServicesService) {
    this.user = this.shared.getData('session', 'user')
    this.paths = ['/get-leaves', '/getGHRequests', '/getTransport', '/getTravel', '/getVisas']
    this.getNotification()
  }

  getNotification() {
    this.api.genericGetAPI('/get-notification')
      .subscribe({
        next: (res) => {
          console.log(res);
          this.notifications = res;
          console.log(this.notifications)
          this.notifications.forEach((notif: any, indx: number) => {
            if (notif.type.includes('Leave')) this.showNotification(this.paths[0], this.notifications)
            if (notif.type.includes('guestHouse')) this.showNotification(this.paths[1], this.notifications)
            if (notif.type.includes('Transport')) this.showNotification(this.paths[2], this.notifications)
            if (notif.type.includes('Travel')) this.showNotification(this.paths[3], this.notifications)
            if (notif.type.includes('Visa')) this.showNotification(this.paths[4], this.notifications)
          })
        },
        error: (err) => { console.log(err); },
        complete: () => { }
      })
  }

  showNotification(path: any, notification: any) {
    this.api.genericGetAPI(path)
      .subscribe({
        next: (res) => {
          this.data = res
          if (this.user.role === 'manager') {
            path === '/get-leaves' ? this.data = this.data.filter((_data: any) => _data.department === this.user.department) : this.data.filter((_data: any) => _data.department === this.user.department)
            this.data.forEach((_data: any, indx: number) => {
              notification.forEach((notif: any, _indx: number) => {
              let check = this.notification.length ? this.notification[_indx].notificationID === notif.notificationID : this.notification.length
                if(notif.notificationID === _data.appID && !check) {
                  this.notification.push(notif)
                }
              })
              console.log(this.notification)
            })
            console.log(this.notification)
          }
        },
        error: () => { },
        complete: () => { }
      })
  }
}
