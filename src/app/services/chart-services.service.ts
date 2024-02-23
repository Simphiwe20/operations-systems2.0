import { Injectable } from '@angular/core';
import { ApiServicesService } from '../api-service/api-services.service';
import { SharedServicesService } from './shared-services.service';

@Injectable({
  providedIn: 'root'
})
export class ChartServicesService {

  approved: number = 0;
  rejected: number = 0;
  submitted: number = 0
  itCount: number = 0
  makertingCount: number = 0;
  salesCount: number = 0
  operationsCount: number = 0;
  other: number = 0
  usersTot: number = 0
  travelReq: number = 0; transportReq: number = 0; guesthouseReq: number = 0; visaReq: number = 0
  disabled: number = 0
  active: number = 0


  constructor( private api: ApiServicesService, private sharedService: SharedServicesService) { }

      
  getUserStats(): void {
    this.api.genericGetAPI('/get-users')
      .subscribe({
        next: (res) => {this.getUserStatus(res)},
        error: (err) => {console.log(err)},
        complete: () => {}
      })

      // this.getUserStatus()
  }

  getLeavesNo(user: any): void {
    this.sharedService.getData('local', 'leaves').forEach((leave: any) => {
      if (user.email === leave.email) {
        if (leave.status === 'Approved') {
          this.approved++
        } else if (leave.status === 'Rejected') {
          this.rejected++
        } else if (leave.status.toLowerCase() === 'submitted') {
          this.submitted++
        }
      } else if (user.role === 'operations personnel') {
        if (leave.status === 'Approved') {
          this.approved++
        } else if (leave.status === 'Rejected') {
          this.rejected++
        } else if (leave.status.toLowerCase() === 'submitted') {
          this.submitted++
        }
      } else if (user.role === 'manager') {
        if (leave.department === user.department) {
          if (leave.status === 'Approved') {
            this.approved++
          } else if (leave.status === 'Rejected') {
            this.rejected++
          } else if (leave.status.toLowerCase() === 'submitted') {
            this.submitted++
          }
        }
      }

    })

  }

  getDep(user: any): void {
    if (user.role === 'admin') {
      this.sharedService.getData('local', 'employees').forEach((_user: any) => {
        if (_user?.Department.toLowerCase() === 'it') {
          this.itCount++
          this.usersTot++
        } else if (_user.Department.toLowerCase() === 'marketing') {
          this.makertingCount++
          this.usersTot++
        } else if (_user.Department.toLowerCase() === 'sales') {
          this.salesCount++
          this.usersTot++
        } else if (_user.Department.toLowerCase() === 'operations') {
          this.operationsCount++
          this.usersTot++
        } else {
          this.other++
          this.usersTot++
        }
      })
    }
  }

  getReqStats(user: any, req: any): void {
    this.approved = 0
    this.rejected = 0
    this.submitted = 0
    this.sharedService.getData('local', req)?.forEach((_req: any) => {
      if (user.email === _req.requestedByEmail || (user.role === 'manager' && user.department === _req.department)) {
        if (_req.status.toLowerCase() === 'approved') {
          this.approved++
        } else if (_req.status.toLowerCase() === 'rejected') {
          this.rejected++
        } else if (_req.status.toLowerCase() === 'submitted') {
          this.submitted++
        }
      }
    })

  }

  getReqs(user: any): void {
    if (user.role === 'manager') {
      this.travelReq = 0; this.transportReq = 0; this.guesthouseReq = 0; this.visaReq = 0
      this.submitted = 0
      this.sharedService.getData('local', 'travels').forEach((travel: any) => {
        if (user.department === travel.department) {
          this.travelReq++
          if (travel.status.toLowerCase() === 'approved') {
            this.approved++
          } else if (travel.status.toLowerCase() === 'rejected') {
            this.rejected++
          } else if (travel.status.toLowerCase() === 'submitted') {
            this.submitted++
          }
        }
      })
      this.sharedService.getData('local', 'transport').forEach((transport: any) => {
        if (user.department === transport.department) {
          this.transportReq++
          if (transport.status.toLowerCase() === 'approved') {
            this.approved++
          } else if (transport.status.toLowerCase() === 'rejected') {
            this.rejected++
          } else if (transport.status.toLowerCase() === 'submitted') {
            this.submitted++
          }
        }
      })
      this.sharedService.getData('local', 'visas').forEach((visa: any) => {
        if (user.department === visa.department) {
          this.visaReq++
          if (visa.status.toLowerCase() === 'approved') {
            this.approved++
          } else if (visa.status.toLowerCase() === 'rejected') {
            this.rejected++
          } else if (visa.status.toLowerCase() === 'submitted') {
            this.submitted++
          }
        }
      })
      this.sharedService.getData('local', 'guesthouse').forEach((guesthouse: any) => {
        if (user.department === guesthouse.department) {
          this.guesthouseReq++
          if (guesthouse.status.toLowerCase() === 'approved') {
            this.approved++
          } else if (guesthouse.status.toLowerCase() === 'rejected') {
            this.rejected++
          } else if (guesthouse.status.toLowerCase() === 'submitted') {
            this.submitted++
          }
        }
      })
    }
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

    console.log(this.active)
    console.log(this.disabled)

  }

}
