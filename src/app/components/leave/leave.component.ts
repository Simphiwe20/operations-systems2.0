import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import * as pdfMake from 'pdfmake/build/pdfMake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts'
import { ApiServicesService } from 'src/app/api-service/api-services.service';
import { LeaveFormComponent } from 'src/app/forms/leave-form/leave-form.component';
import { SharedServicesService } from 'src/app/services/shared-services.service';


(pdfMake as any).vfs = pdfFonts.pdfMake.vfs

@Component({
  selector: 'app-leave',
  templateUrl: './leave.component.html',
  styleUrls: ['./leave.component.scss']
})
export class LeaveComponent {
  displayedColumns!: string[]
  dataSource!: MatTableDataSource<any>;
  user: any;
  userLeaves: any;
  statuses: string[] = ['Approved', 'Rejected']
  approvedDataSource!: [];
  rejectedDataSource!: [];
  approvedLeaves: any[] = []
  rejectedLeaves: any[] = []


  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  constructor(private matDialog: MatDialog, private sharedService: SharedServicesService,
    private snackBar: MatSnackBar, private api: ApiServicesService) {
    this.user = this.sharedService.getData('session', 'user')
    if (this.user.role === 'employee') {
      this.displayedColumns = ['startDate', 'endDate', 'leaveType', 'status', 'download'];
    } else {
      this.displayedColumns = ['startDate', 'endDate', 'leaveType', 'employeeEmail', 'status', 'download']
    }
    this.getLeaves()
    this.moveLeaves()
  }

  moveLeaves(): void {
    this.api.genericGetAPI('/get-leaves')
      .subscribe({
        next: (_res) => {
          this.userLeaves = _res
          if (this.user.role === 'employee') {
            this.displayedColumns = ['startDate', 'endDate', 'leaveType', 'status', 'download'];
            this.approvedDataSource = this.userLeaves.filter((leave: any) => {
              if (leave.email === this.user.email && leave.status === 'Approved') {
                return leave
              }
            })
            this.rejectedDataSource = this.userLeaves.filter((leave: any) => {
              if (leave.email === this.user.email && leave.status === 'Rejected') {
                return leave
              }
            })
          } else if (this.user.role === 'manager') {
            this.displayedColumns = ['startDate', 'endDate', 'leaveType', 'employeeEmail', 'status', 'download'];
            this.approvedDataSource = this.userLeaves.filter((leave: any) => {
              if (leave.department === this.user.department && leave.status === 'Approved') {
                return leave
              }
            })
            this.rejectedDataSource = this.userLeaves.filter((leave: any) => {
              if (leave.department === this.user.department && leave.status === 'Rejected') {
                return leave
              }
            })
          } else {
            this.approvedDataSource = this.userLeaves.filter((leave: any) => {
              if (leave.status === 'Approved') {
                return leave
              }
            })
            this.rejectedDataSource = this.userLeaves.filter((leave: any) => {
              if (leave.status === 'Rejected') {
                return leave
              }
            })
          }
        },
        error: (err) => { console.log(err) },
        complete: () => { }
      })
  }



  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  applyLeave(): void {
    let dialogRef = this.matDialog.open(LeaveFormComponent)
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.api.genericGetAPI('/get-leaves')
          .subscribe({
            next: (_res) => {
              this.userLeaves = _res
              console.log(this.userLeaves)
              this.dataSource = this.userLeaves.filter((leave: any) => {
                if (leave.email === this.user.email) {
                  return leave
                }
              })
              console.log(this.dataSource)
            },
            error: (err) => { console.log(err) },
            complete: () => { }
          })
        this.snackBar.open(res, 'OK', { duration: 3000 })
      }
    })
  }

  getLeaves() {
    this.api.genericGetAPI('/get-leaves')
      .subscribe({
        next: (_res) => {
          this.userLeaves = _res
          if (this.user.role === 'employee') {
            this.dataSource = this.userLeaves.filter((leave: any) => {
              if (leave.email === this.user.email) {
                return leave
              }
            })
          } else if (this.user.role === 'manager') {
            this.userLeaves = this.userLeaves.filter((leave: any) => {
              if (leave.department === this.user.department) {
                return leave
              }
            })
          } else if (this.user.role = 'admin') {
            this.dataSource = this.userLeaves.filter((leave: any) => {
              if (leave.status === 'Approved') {
                this.approvedLeaves.push(leave)
                return leave
              }
            })
          } else {
            this.dataSource = this.userLeaves
          }
          console.log(this.dataSource)
        },
        error: (err) => { console.log(err) },
        complete: () => { }
      })
  }

  statusUpdate(status: string, appID: string): void {
    this.userLeaves.forEach((leave: any, indx: number) => {
      if (leave.appID === appID) {
        if (status === 'Approved' || status === 'Rejected') {
          this.userLeaves['dateUpdated'] = new Date();
        }
        this.userLeaves[indx]['status'] = status;
        this.updateStorageStatus(status, leave)
        this.moveLeaves()
      }
    });
    // localStorage.setItem('userGuestHouse', JSON.stringify(this.userGuestHouse));
    // this.updateUser();
  }

  updateStorageStatus(status: string, leave: any): void {
    this.userLeaves = []
    this.sharedService.getData('local', 'leaves').forEach((_leave: any) => {
      if (leave.appID === _leave.appID) {
        _leave['status'] = status
      }
      this.userLeaves.push(_leave)
      console.log(_leave)
    })

    this.sharedService.storeData('local', 'leaves', this.userLeaves)
  }

  decrementLeaveDays(ele: any): void {
    setTimeout(() => {
      if (ele.status === 'Approved') {
        if (ele.leaveType.toLowerCase() === 'annual leave') {
          ele.annualLeaveDays = ele.annualLeaveDays - ele.days
        } else {
          ele.sickLeaveDays = ele.sickLeaveDays - ele.days
        }
      }
      this.sharedService.getData('local', 'leaves').forEach((leave: any, indx: number) => {
        if (leave.appID === ele.appID) {
          this.userLeaves[indx] = ele
          this.sharedService.storeData('local', 'leaves', this.userLeaves)
        }
      })
    }, 3000

    )
  }

  generatePdf(_row: any): void {
    let row = this.sharedService.getData('local', 'leaves').find((policy: any, i: number) => {
      if (policy.appID === _row.appID) {
        return policy
      }
    })
    console.log(row)
    let docDefinition = {
      content: [
        {
          text: `${row.employeeName}`,
          fontSize: 30,
          alignment: 'center'
        },
        {
          text: "Employee Email Address",
          fontSize: 20,
          margin: [0, 10, 0, 10]
        },
        row.email,
        {
          text: "Employee Department",
          fontSize: 20,
          margin: [0, 10, 0, 10]
        },
        row.department,
        {
          text: "Leave Start Date",
          fontSize: 20,
          margin: [0, 10, 0, 10]
        },
        row.startDate.split('T')[0],
        {
          text: "Leave End Date",
          fontSize: 20,
          margin: [0, 10, 0, 10]
        },
        row.endDate.split('T')[0],
        {
          text: "Days Taken",
          fontSize: 20,
          margin: [0, 10, 0, 10]
        },
        row.days,
        {
          text: "Leave Application Status",
          fontSize: 20,
          margin: [0, 10, 0, 10]
        },
        row.status,
      ]
    }

    pdfMake.createPdf(docDefinition).open();
  }
}

