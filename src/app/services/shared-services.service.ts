import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ApiServicesService } from '../api-service/api-services.service';
import { Notification } from '../interface/notification';

@Injectable({
  providedIn: 'root'
})
export class SharedServicesService {
  notification: any;
  data: any;
  user: any;
  employees: any;
  users: any;
  newUsers: any[] = []
  leave: any;
  leaveTypes: string[] = ['Annual Leave', 'Sick Leave', 'Family Responsibility Leave', 'Maternity leave']


  // this is todoList that stores the any list 
  private policy = new BehaviorSubject<any[]>([]);
  // this is my observable object, where all components can see the products flow
  policy$ = this.policy.asObservable();

  constructor(private api: ApiServicesService) {
    this.refreshPolicies()
  }


  refreshPolicies(): void {
    this.policy.next(this.getData('local', 'policies'))
  }

  getData(storage: any, key: any): any {
    console.log(storage, key)
    this.data = storage === 'local' ? localStorage.getItem(key) : sessionStorage.getItem(key)
    console.log(this.data)
    this.data = this.data ? JSON.parse(this.data) : []
    return this.data
  }

  storeData(storage: any, key: any, value: any): any {
    storage === 'session' ? sessionStorage.setItem(key, JSON.stringify(value)) : localStorage.setItem(key, JSON.stringify(value))
  }

  generatePwd(): any {
    let chars = 'Z*a&9Sx^Dc%V6$fG#b@7N3h!Jm~4Kl`Op/Iu?Y.tR;e2Wq:zAx]Sx[Cd|F\vB-F0g5Hj8MnkL1+'
    let pwd = ''
    for (let i = 0; i < 8; i++) {
      pwd += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return pwd
  }

  storeNewUsers(employees: any): void {

    this.api.genericGetAPI('/get-users')
      .subscribe({
        next: (res: any) => { this.getNewUser(res, employees) },
        error: () => { },
        complete: () => { }
      })
  }

  getNewUser(users: any, employees: any): void {
    let doesUserExist: boolean;
    employees.forEach((employee: any, indx: number) => {
      doesUserExist = false;
      users.forEach((user: any, indx: number) => {
        if (employee.Email === user.email) {
          console.log('Found User:', user)
          doesUserExist = true;
        }
      })
      if (!doesUserExist) {
        this.newUsers.push({
          firstName: employee.firstName,
          lastName: employee.lastName,
          email: employee.email,
          department: employee.department,
          occupation: employee.occupation,
          role: employee.occupation.toLowerCase() == 'hr personnel' ? 'HR personnel' :
            employee.occupation.toLowerCase() == 'operations personnel' ? 'operations personnel' :
              employee.occupation.toLowerCase() == 'manager' ? 'manager' : 'employee',
          password: this.generatePwd(),
          status: 'active',
          leaveDays: { annualLeaveDays: 36, sickLeaveDays: 21, familyResponsibilityLeaveDays: 4, maternityLeaveDays: 6 }
        })
      }
    })

    this.newUsers.forEach((user: any, indx: number) => {
      this.api.genericPostAPI('/add-user', user)
        .subscribe({
          next: (res) => { console.log(res) },
          error: (err) => { console.log(err) },
          complete: () => { }
        })
    })
  }

  updateRequest(path: string, payload: any) {
    this.api.genericUpdateAPI(path, payload)
      .subscribe({
        next: (res) => { console.log(res) },
        error: (err) => { console.log(err) },
        complete: () => { }
      })
  }

  decrementLeaveDays(leave: any): void {
    this.api.genericGetAPI('/get-users')
      .subscribe({
        next: (res) => {
          this.users = res
          this.users.forEach((user: any) => {
            if (user.email === leave.email) {
              if (leave.leaveType === 'Annual Leave') {
                user.leaveDays.annualLeaveDays -= leave.days
              } else if (leave.leaveType === 'Sick Leave') {
                user.leaveDays.sickLeaveDays -= leave.days
              } else if (leave.leaveType === 'Family Responsibility Leave') {
                user.leaveDays.familyResponsibilityLeaveDays -= leave.days
              } else {
                user.leaveDays.maternityLeaveDays -= leave.days
              }
              this.api.genericUpdateAPI('/update-user', user)
                .subscribe({
                  next: (res) => { console.log(res) },
                  error: (err) => { console.log(err) },
                  complete: () => { }
                })
            }
          })
        },
        error: (err) => { console.log(err) },
        complete: () => { }
      })
  }

  sendNotification(_message: any, _type: any, notificationID: string): any {
    let notification: Notification = {message: _message, date: new Date(), viewed: false, type: _type, notificationID: notificationID}
    console.log(notification)
    this.api.genericPostAPI('/add-notification', notification)
      .subscribe({
        next: (res) => {console.log(res)},
        error: (err) => {console.log(err)},
        complete: () => {}
      })
  }

  prepareDate(data: any): any {
    let keys = Object.keys(data[0])
    data.forEach((item: any, indx: number) => {
      keys.forEach(key => {
        if(item[key].split(':').length) {
          debugger
          item[key].toLocaleString().split(',')[0]
        }
      })
    })
    console.log('data', data)
    return data
  }


}
