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
  displayedColumns!: string[];
  columnNames!: string[];
  dataSource!: MatTableDataSource<any>;
  user: any;
  userLeaves: any;
  statuses: string[] = ['Approved', 'Declined']
  approvedDataSource: any;
  rejectedDataSource: any;
  approvedLeaves: any[] = []
  rejectedLeaves: any[] = []
  leave: any;
  showLoader: boolean = true


  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  constructor(private matDialog: MatDialog, private sharedService: SharedServicesService,
    private snackBar: MatSnackBar, private api: ApiServicesService) {
    this.user = this.sharedService.getData('session', 'user')
    if (this.user.role === 'employee') {
      this.columnNames = ['Start Date', 'End Date', 'Leave  Type', 'Status', 'Download']
      this.displayedColumns = ['startDate', 'endDate', 'leaveType', 'status', 'download'];
    } else {
      this.displayedColumns = ['startDate', 'endDate', 'leaveType', 'email', 'status', 'download']
      this.columnNames = ['Start Date', 'End Date', 'Leave  Type', 'Employee Email', 'Status', 'Download']
    }


    this.getLeaves()
    this.moveLeaves()
  }

  moveLeaves(): void {
    this.showLoader = true;
    this.api.genericGetAPI('/get-leaves')
      .subscribe({
        next: (_res) => {
          this.userLeaves = _res
          if (this.user.role === 'employee') {
            this.approvedDataSource = this.userLeaves.filter((leave: any) => {
              if (leave.email === this.user.email && leave.status === 'Approved') {
                return leave
              }
            })
            this.rejectedDataSource = this.userLeaves.filter((leave: any) => {
              if (leave.email === this.user.email && leave.status === 'Declined') {
                return leave
              }
            })
          } else if (this.user.role === 'manager') {
            this.approvedDataSource = this.userLeaves.filter((leave: any) => {
              if (leave.department === this.user.department && leave.status === 'Approved') {
                return leave
              }
            })
            this.rejectedDataSource = this.userLeaves.filter((leave: any) => {
              if (leave.department === this.user.department && leave.status === 'Declined') {
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
              if (leave.status === 'Declined') {
                return leave
              }
            })
          }
          this.showLoader = false

          if (this.user.role == 'admin') {
            this.userLeaves = this.approvedDataSource
          }

        },
        error: (err) => {
          this.showLoader = false;
          this.snackBar.open(err.Error, 'OK', { duration: 3000 })
        },
        complete: () => { }
      })
    console.log("this.userLeaves: ", this.userLeaves)
  }

  applyLeave(): void {
    let dialogRef = this.matDialog.open(LeaveFormComponent)
    dialogRef.afterClosed().subscribe(res => {
      this.showLoader = true;
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
              this.showLoader = false;
            },
            error: (err) => {
              this.showLoader = false;
              this.snackBar.open(err.Error, 'OK')
                , { duration: 3000 }
            },
            complete: () => { }
          })
        this.snackBar.open(res, 'OK', { duration: 3000 })
      }
    })
  }

  selectedIndex(event: any) {
    console.log('EVENT: ', event)
    if (event == 1) {
      this.dataSource = this.approvedDataSource
    } else if (event == 2) {
      this.dataSource = this.rejectedDataSource
    } else {
      this.dataSource = this.userLeaves
    }
  }

  getLeaves() {
    this.showLoader = true;
    this.api.genericGetAPI('/get-leaves')
      .subscribe({
        next: (_res) => {
          this.userLeaves = _res
          if (this.user.role === 'employee') {
            this.dataSource = this.userLeaves.filter((leave: any) => leave.email === this.user.email)
            console.log('DONE >>>>> employee', this.dataSource)
          } else if (this.user.role === 'manager') {
            this.dataSource = this.userLeaves.filter((leave: any) => leave.department === this.user.department)
            console.log('DONE >>>>> manager')
          } else if (this.user.role = 'admin') {
            this.dataSource = this.userLeaves.filter((leave: any) => {
              if (leave.status === 'Approved') {
                this.approvedLeaves.push(leave)
                return leave
              }
            })
            console.log('DONE >>>>> admin')
          } else {
            this.dataSource = this.userLeaves
          }
          this.showLoader = false;
          console.log('this.dataSource: ', this.dataSource)
        },
        error: (err) => {
          this.showLoader = false;
          this.snackBar.open(err.Error, 'OK'), { duration: 3000 }
        },
        complete: () => { }
      })
  }

  statusUpdate(event: any): void {
    this.showLoader = true;
    let updatedLeave = event.item
    updatedLeave.status = event.status
    updatedLeave.dateUpdated = new Date();
    this.sharedService.decrementLeaveDays(updatedLeave)
    this.updateStorageStatus(updatedLeave)
    this.sendNotifications(event)
  }

  
  sendNotifications(data: any) {
    let message = `Your leave application has been ${data.status}.`
    let _notificationData = {
      message: message,
      for: `${data.item.email}`,
      notificationID: `actioned_${data.item.appID}`
    }
    this.sharedService.sendNotification(_notificationData)
  }

  updateStorageStatus(leave: any) {
    this.api.genericUpdateAPI('/updateLeave', leave)
      .subscribe({
        next: (res) => {
          console.log('RESS: ', res)
          this.moveLeaves()
        },
        error: (err) => { console.log('ERR: ', err) }
      })
  }

  generatePdf(_row: any): void {
    console.log(_row)
    this.leave = _row
    let docDefinition = {
      content: [
        {
          text: `${this.leave.employeeName}`,
          fontSize: 30,
          alignment: 'center'
        },
        {
          text: "Employee Email Address",
          fontSize: 20,
          margin: [0, 10, 0, 10]
        },
        this.leave.email,
        {
          text: "Employee Department",
          fontSize: 20,
          margin: [0, 10, 0, 10]
        },
        this.leave.department,
        {
          text: "Leave Start Date",
          fontSize: 20,
          margin: [0, 10, 0, 10]
        },
        this.leave.startDate.split('T')[0],
        {
          text: "Leave End Date",
          fontSize: 20,
          margin: [0, 10, 0, 10]
        },
        this.leave.endDate.split('T')[0],
        {
          text: "Days Taken",
          fontSize: 20,
          margin: [0, 10, 0, 10]
        },
        this.leave.days,
        {
          text: "Leave Application Status",
          fontSize: 20,
          margin: [0, 10, 0, 10]
        },
        this.leave.status,
      ]
    }

    pdfMake.createPdf(docDefinition).open();
  }
}

