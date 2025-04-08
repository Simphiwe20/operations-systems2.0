import { Injectable } from '@angular/core';
import { ApiServicesService } from '../api-service/api-services.service';
import { SharedServicesService } from './shared-services.service';
import { Observable, of } from 'rxjs';

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
  



  constructor(private api: ApiServicesService, private sharedService: SharedServicesService) { }


  getUserStats(): void {
    this.api.genericGetAPI('/get-users')
      .subscribe({
        next: (res) => {
          console.log(res)
          let users = res
          this.users.push(users)
          console.log(users)
          this.getUserStatus(res)
          this.getDep(users)
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
          console.log(this.leaves)
          console.log(user)
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

    console.log(this.pending)
  }

  getDep(users: any): void {
    console.log(users)
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

  getReqStats(user: any, req: any): void {
    this.approved = 0
    this.declined = 0
    // this.pending = 0
    // this.sharedService.getData('local', req)?.forEach((_req: any) => {
    //   if (user.email === _req.requestedByEmail || (user.role === 'manager' && user.department === _req.department)) {
    //     if (_req.status.toLowerCase() === 'approved') {
    //       this.approved++
    //     } else if (_req.status.toLowerCase() === 'declined') {
    //       this.declined++
    //     } else if (_req.status.toLowerCase() === 'pending') {
    //       this.pending++
    //     }
    //   }
    // })
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


  getRequests() {

  }

}
