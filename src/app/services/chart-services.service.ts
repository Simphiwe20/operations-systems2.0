import { Injectable } from '@angular/core';
import { ApiServicesService } from '../api-service/api-services.service';
import { SharedServicesService } from './shared-services.service';
import { Observable, of } from 'rxjs';
import { ResolveStart } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class ChartServicesService {

  approved: number = 0;
  declined: number = 0;
  pending: number = 0
  itCount: number = 0
  makertingCount: number = 0;
  salesCount: number = 0
  operationsCount: number = 0;
  other: number = 0
  usersTot: number = 0
  travelReq: number = 0; transportReq: number = 0; guesthouseReq: number = 0; visaReq: number = 0
  guestHouseApproved: number = 0; guestHouseDeclined: number = 0; guestHousePending: number = 0
  transportApproved: number = 0; transportDeclined: number = 0; transportPending: number = 0
  travelApproved: number = 0; travelDeclined: number = 0; travelPending: number = 0
  visaApproved: number = 0; visaDeclined: number = 0; visaPending: number = 0
  disabled: any
  active: number = 0
  users: any[] = []
  leaves: any;
  _req: any;
  apiReques: any[] = []
  done: Observable<boolean> = new Observable();
  mostUserRequests: any[] = [];

  constructor(private api: ApiServicesService, private sharedService: SharedServicesService) { }

  getUserStats(): void {
    this.api.genericGetAPI('/get-users')
      .subscribe({
        next: (res) => {
          console.log(res)
          let users = res
          this.users.push(users)
          this.getUserStatus(res)
          this.getDep(users)
          this.getReqStats(users, '')
        },
        error: (err) => { console.log(err) },
        complete: () => { }
      })
  }

  getLeavesNo(user: any): void {
    this.api.genericGetAPI('/get-leaves')
      .subscribe({
        next: (res) => {
          this.pending = 0
          this.declined = 0
          this.approved = 0

          this.leaves = res
          this.leaves.forEach((leave: any) => {
            if (user.email === leave.email) {
              if (leave.status.toLowerCase() === 'approved') {
                this.approved++
              } else if (leave.status.toLowerCase() === 'declined') {
                this.declined++
              } else if (leave.status.toLowerCase() === 'pending') {
                this.pending++
              }
            } else if (user.role === 'operations personnel') {
              if (leave.status.toLowerCase() === 'approved') {
                this.approved++
              } else if (leave.status.toLowerCase() === 'declined') {
                this.declined++
              } else if (leave.status.toLowerCase() === 'pending') {
                this.pending++
              }
            } else if (user.role === 'manager') {
              if (leave.department === user.department) {
                if (leave.status.toLowerCase() === 'approved') {
                  this.approved++
                } else if (leave.status.toLowerCase() === 'declined') {
                  this.declined++
                } else if (leave.status.toLowerCase() === 'pending') {
                  this.pending++
                }
              }
            }
          })
        },
        error: () => { },
        complete: () => { }
      })
  }

  getDep(users: any): void {
    users.forEach((_user: any) => {
      if (_user?.department?.toLowerCase() === 'it') {
        this.itCount++
        this.usersTot++
      } else if (_user?.department?.toLowerCase() === 'marketing') {
        this.makertingCount++
        this.usersTot++
      } else if (_user?.department?.toLowerCase() === 'sales') {
        this.salesCount++
        this.usersTot++
      } else if (_user?.department?.toLowerCase() === 'operations') {
        this.operationsCount++
        this.usersTot++
      } else {
        this.other++
        this.usersTot++
      }
    })
  }

  getReqStats(users: any, req: any): void {
    this.approved = 0
    this.declined = 0
    users?.forEach((user: { email: any; firstName: any; lastName: any }) => {
      if (user.email) {
        this.mostUserRequests.push({
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
          requestedGH: 0,
          requestedVisas: 0,
          requestedTravel: 0,
          requestedTransport: 0
        })
      }

    })
    this.getUsersReq()
  }

  async getReqs(user: any, path: any) {
    this.travelReq = 0; this.transportReq = 0; this.guesthouseReq = 0; this.visaReq = 0
    this.pending = 0
    this.api.genericGetAPI(path)
      .subscribe({
        next: (res) => {
          this._req = res
          this._req.forEach((reqs: any, indx: number) => {
            if ((reqs.reqID.includes('guestHouse') && !this.apiReques.includes(this._req[indx].reqID)) && (user.email === reqs.requestedByEmail || (user.role === 'manager' && user.department === reqs.department) || user.role === 'operations personnel')) {
              this.guesthouseReq++
              reqs.status.toLowerCase() === 'approved' ? this.guestHouseApproved++ : reqs.status.toLowerCase() === 'declined' ? this.guestHouseDeclined++ : this.guestHousePending++
            } else if ((reqs.reqID.includes('transport') && !this.apiReques.includes(this._req[indx].reqID)) && (user.email === reqs.requestedByEmail || (user.role === 'manager' && user.department === reqs.department || user.role === 'operations personnel'))) {
              this.transportReq++
              reqs.status.toLowerCase() === 'approved' ? this.transportApproved++ : reqs.status.toLowerCase() === 'declined' ? this.transportDeclined++ : this.transportPending++

            } else if ((reqs.reqID.includes('travel') && !this.apiReques.includes(this._req[indx].reqID)) && (user.email === reqs.requestedByEmail || (user.role === 'manager' && user.department === reqs.department || user.role === 'operations personnel'))) {
              this.travelReq++
              reqs.status.toLowerCase() === 'approved' ? this.travelApproved++ : reqs.status.toLowerCase() === 'declined' ? this.travelDeclined++ : this.travelPending++

            } else if ((reqs.reqID.includes('visa') && !this.apiReques.includes(this._req[indx].reqID)) && (user.email === reqs.requestedByEmail || (user.role === 'manager' && user.department === reqs.department || user.role === 'operations personnel'))) {
              this.visaReq++
              reqs.status.toLowerCase() === 'approved' ? this.visaApproved++ : reqs.status.toLowerCase() === 'declined' ? this.visaDeclined++ : this.visaPending++

              if (this._req.length - 1 === indx) {
                this.done = new Observable(observer => {
                  observer.next(true)
                  observer.complete()
                  return observer
                })
              }
            }
            this.apiReques.push(reqs.reqID)
          })
        },
        error: () => { },
        complete: () => { }
      })

    return Promise.resolve(this.done)
  }

  getUserStatus(users: any = []): void {
    this.disabled = 0
    this.active = 0
    users.forEach((user: any, indx: number) => {
      if (user.status === 'disable') {
        this.disabled++
      } else if (user.status === 'active') {
        this.active++
      }
    })

  }


  getUsersReq() {
    let paths = ['/getGHRequests', '/getTransport', '/getTravel', '/getVisas']
    paths.forEach((path, indx) => {
      this.api.genericGetAPI(path)
        .subscribe({
          next: (res: any) => {
            console.log(`${path} -->`, res)
            if (indx == 0) {
              this.mostUserRequests.forEach(user => {
                console.log('res.requestedByEmail == user.email 0', res.requestedByEmail == user.email)
                res.forEach((req: { requestedByEmail: any; }) => {
                  if (req.requestedByEmail == user.email) {
                    user.requestedGH++
                    console.log('user.requestedGH: ', user.requestedGH)
                  }
                })
              })
            } else if (indx == 1) {
              this.mostUserRequests.forEach(user => {
                res.forEach((req: { requestedByEmail: any; }) => {
                  if (req.requestedByEmail == user.email) {
                    user.requestedTransport++
                    console.log('user.requestedTransport: ', user.requestedTransport)
                  }

                })
              })
            } else if (indx == 2) {
              this.mostUserRequests.forEach(user => {
                res.forEach((req: { requestedByEmail: any; }) => {
                  if (req.requestedByEmail == user.email) {
                    user.requestedTravel++
                    console.log('user.requestedTravel: ', user.requestedTravel)
                  }

                })
              })
            } else {
              this.mostUserRequests.forEach(user => {
                res.forEach((req: { requestedByEmail: any; }) => {
                  if (req.requestedByEmail == user.email) {
                    user.requestedVisas++
                    console.log('user.requestedVisas: ', user.requestedVisas)
                  }

                })
              })
            }
          },
          error: (ERR) => { },
          complete: () => { }
        })
    })
  }

}
