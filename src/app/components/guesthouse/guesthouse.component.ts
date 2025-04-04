import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import * as pdfMake from 'pdfmake/build/pdfMake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts'
import { ApiServicesService } from 'src/app/api-service/api-services.service';
import { GuesthouseFormComponent } from 'src/app/forms/guesthouse-form/guesthouse-form.component';
import { SharedServicesService } from 'src/app/services/shared-services.service';

(pdfMake as any).vfs = pdfFonts.pdfMake.vfs


@Component({
  selector: 'app-guesthouse',
  templateUrl: './guesthouse.component.html',
  styleUrls: ['./guesthouse.component.scss']
})

export class GuesthouseComponent {
  displayedColumns: string[] = ['guestHouseName', 'checkInDate', 'checkOutDate', 'status', 'download'];
  columnNames: string[] = ['Guest House', 'Check In', 'Check Out', 'Status', 'Download']
  dataSource!: MatTableDataSource<any>;
  user: any;
  userGuestHouse: any;
  reqGuestHouse: any = []
  approvedDataSource!: MatTableDataSource<any>;
  declinedDataSource!: MatTableDataSource<any>
  showLoader: boolean = true

  constructor(private matDialog: MatDialog, private sharedService: SharedServicesService,
    private snackBar: MatSnackBar, private api: ApiServicesService) {
    this.showGuestHouse()
    this.user = this.sharedService.getData('session', 'user')
    if (this.user.role !== 'employee') {
      this.displayedColumns = ['guestHouseName', 'checkInDate', 'checkOutDate', 'requestedByEmail', 'status', 'download'];
      this.columnNames = ['Guest House', 'Check In', 'Check Out', 'Email', 'Status', 'Download']

    }
    this.moveGuestHouse()
  }

  moveGuestHouse(): void {
    this.api.genericGetAPI('/getGHRequests')
      .subscribe({
        next: (_res) => {
          this.reqGuestHouse = _res
          if (this.user.role === 'employee') {
            this.approvedDataSource = this.reqGuestHouse.filter((guestHouse: any) => {
              if (guestHouse.email === this.user.email && guestHouse.status === 'Approved') {
                return guestHouse || []
              }
            })
            this.declinedDataSource = this.reqGuestHouse.filter((guestHouse: any) => {
              if (guestHouse.email === this.user.email && guestHouse.status === 'Declined') {
                return guestHouse || []
              }
            })
          } else if (this.user.role === 'manager') {
            this.approvedDataSource = this.reqGuestHouse.filter((guestHouse: any) => {
              if (guestHouse.department === this.user.department && guestHouse.status === 'Approved') {
                return guestHouse || []
              }
            })
            this.declinedDataSource = this.reqGuestHouse.filter((guestHouse: any) => {
              if (guestHouse.department === this.user.department && guestHouse.status === 'Declined') {
                return guestHouse || []
              }
            })
          } else {
            this.approvedDataSource = this.reqGuestHouse.filter((guestHouse: any) => {
              if (guestHouse.status === 'Approved') {
                return guestHouse || []
              }
            })
            this.declinedDataSource = this.reqGuestHouse.filter((guestHouse: any) => {
              if (guestHouse.status === '"Declined"') {
                return guestHouse || []
              }
            })
          }
          this.showLoader = false

        },
        error: (err) => {
          this.showLoader = false;
          this.snackBar.open(err.Error, 'OK', { duration: 3000 })
        },
        complete: () => { }

      })

  }

  selectedIndex(event: any) {
    console.log('EVENT: ', event)
    if (event == 1) {
      this.dataSource = this.approvedDataSource
    } else if (event == 2) {
      this.dataSource = this.declinedDataSource
    } else {
      this.dataSource = this.reqGuestHouse
    }
  }

  guesthouseRequest(): void {
    let dialogRef = this.matDialog.open(GuesthouseFormComponent)
    dialogRef.afterClosed().subscribe(res => {
      console.log(res)
      if (res) {
        this.showLoader = true;
        this.snackBar.open(res, 'OK', { duration: 3000 })
        this.api.genericGetAPI('/getGHRequests')
          .subscribe({
            next: (_res) => {
              this.reqGuestHouse = _res
              this.dataSource = this.reqGuestHouse.filter((guesthouse: any) => {
                if (guesthouse.requestedByEmail === this.user.email) {
                  return guesthouse
                }
              })
              this.showLoader = false;
              console.log('this.reqGuestHouse:  ', this.reqGuestHouse)
            },
            error: (err) => {
              this.showLoader = false;
              this.snackBar.open(err.Error, 'OK', { duration: 3000 })
            },
            complete: () => { }
          })
      }
    })
  }

  statusUpdate(event: any): void {
    this.showLoader = true;
    let updatedRequest = event.item
    updatedRequest.status = event.status
    updatedRequest.dateUpdated = new Date();
    this.updateStorageStatus(updatedRequest)
    this.sendNotifications(event)
  }

  sendNotifications(data: any) {
    let message = `Your guesthouse request has been ${data.status}.`
    let _notificationData = {
      message: message,
      for: `${data.item.requestedByEmail}`,
      notificationID: `actioned_${data.item.appID}`
    }
    this.sharedService.sendNotification(_notificationData)
  }

  updateStorageStatus(updatedRequest: any) {
    this.api.genericUpdateAPI('/updateGHRequest', updatedRequest)
      .subscribe({
        next: (res) => {
          console.log('RESS: ', res)
          this.moveGuestHouse()
        },
        error: (err) => { console.log('ERR: ', err) }
      })
  }

  showGuestHouse() {
    this.showLoader = true;

    this.api.genericGetAPI('/getGHRequests')
      .subscribe({
        next: (_res) => {
          this.reqGuestHouse = _res
          console.log(this.reqGuestHouse)
          let requests: any[] = [];
          if (this.user.role === 'employee') {
            this.reqGuestHouse.forEach((guesthouse: any) => {
              if (guesthouse.requestedByEmail === this.user.email) {
                requests.push(guesthouse)
              }
            })
            this.dataSource = new MatTableDataSource(requests)
          } else if (this.user.role === 'manager') {
            this.dataSource = this.reqGuestHouse.filter((guestHouse: any) => {
              if (guestHouse.department === this.user.department) {
                return guestHouse
              }
            })
          }
          this.showLoader = false;

        },
        error: (err) => {
          this.showLoader = false;
          this.snackBar.open(err.Error, 'OK', { duration: 3000 })
        },
        complete: () => { }
      })
  }


  generatePdf(ele: any): void {
    let docDefinition = {
      content: [
        {
          text: `${ele.requestedBy}`,
          fontSize: 30,
          alignment: 'center'
        },
        {
          text: "Employee Email Address",
          fontSize: 20,
          margin: [0, 10, 0, 10]
        },
        ele.requestedByEmail,
        {
          text: "Employee Department",
          fontSize: 20,
          margin: [0, 10, 0, 10]
        },
        ele.department,
        {
          text: "GuestHouse Name",
          fontSize: 20,
          margin: [0, 10, 0, 10]
        },
        ele.guestHouseName,
        {
          text: "Check In Date",
          fontSize: 20,
          margin: [0, 10, 0, 10]
        },
        ele.checkInDate.split('T')[0],
        {
          text: "Check Out Date",
          fontSize: 20,
          margin: [0, 10, 0, 10]
        },
        ele.checkOutDate.split('T')[0],
        {
          text: "Any Special Needs",
          fontSize: 20,
          margin: [0, 10, 0, 10]
        },
        ele.specialNeeds,
        {
          text: "GuestHouse Request Status",
          fontSize: 20,
          margin: [0, 10, 0, 10]
        },
        ele.status,
      ]
    }

    pdfMake.createPdf(docDefinition).open();
  }
}

