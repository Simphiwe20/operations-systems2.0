import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import * as pdfMake from 'pdfmake/build/pdfMake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts'
import { ApiServicesService } from 'src/app/api-service/api-services.service';
import { TransportFormComponent } from 'src/app/forms/transport-form/transport-form.component';
import { SharedServicesService } from 'src/app/services/shared-services.service';

(pdfMake as any).vfs = pdfFonts.pdfMake.vfs

@Component({
  selector: 'app-transport',
  templateUrl: './transport.component.html',
  styleUrls: ['./transport.component.scss']
})
export class TransportComponent implements OnInit {
  displayedColumns: string[] = ['transportType', 'neededDate', 'pickUpSpot', 'pickUpReason', 'dropOffSpot', 'status', 'download'];
  columnNames: string[] = ['Transport Type', 'Needed Date', 'Pick Up Spot', 'Pick Up Reason', 'Drop Off Spot', 'Status', 'Download']
  dataSource!: MatTableDataSource<any>;
  user: any;
  userTransport: any;
  statuses: string[] = ['Approved', 'declined']
  approvedDataSource!: MatTableDataSource<any>;
  declinedDataSource!: MatTableDataSource<any>;
  showLoader: boolean = true

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private matDialog: MatDialog, private sharedService: SharedServicesService,
    private snackBar: MatSnackBar, private api: ApiServicesService) {}

  ngOnInit() {
    this.user = this.sharedService.getData('session', 'user')
    if (this.user.role !== 'employee') {
      this.displayedColumns = ['transportType', 'neededDate', 'pickUpSpot', 'pickUpReason', 'dropOffSpot', 'requestedByEmail', 'status', 'download']
      this.columnNames = ['Transport Type', 'Needed Date', 'Pick Up Spot', 'Pick Up Reason', 'Drop Off Spot', 'Employee Email', 'Status', 'Download']
    }

    this.getTransports()
    this.moveTransport()
  }


  moveTransport(): void {
    this.api.genericGetAPI('/getTransport')
      .subscribe({
        next: (_res) => {
          this.userTransport = _res
          if (this.user.role === 'employee') {
            this.approvedDataSource = this.userTransport.filter((transport: any) => {
              if (transport.requestedByEmail === this.user.email && transport.status === 'Approved') {
                return transport
              }
            })
            this.declinedDataSource = this.userTransport.filter((transport: any) => {
              if (transport.requestedByEmail === this.user.email && transport.status === 'Declined') {
                return transport
              }
            })
          } else if (this.user.role === 'manager') {
            this.approvedDataSource = this.userTransport.filter((transport: any) => {
              if (transport.department === this.user.department && transport.status === 'Approved') {
                return transport
              }
            })
            this.declinedDataSource = this.userTransport.filter((transport: any) => {
              if (transport.department === this.user.department && transport.status === 'Declined') {
                return transport
              }
            })
          } else {
            this.approvedDataSource = this.userTransport.filter((transport: any) => {
              if (transport.status === 'Approved') {
                return transport
              }
            })
            this.declinedDataSource = this.userTransport.filter((transport: any) => {
              if (transport.status === 'Declined') {
                return transport
              }
            })
          }
          this.showLoader = false
        },
        error: (err) => {
          this.showLoader = false;
          this.snackBar.open(err.Error, 'OK', { duration: 3000 })
          console.log('ERR: ', err)
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
      this.dataSource = this.userTransport
    }
  }


  requestTransport(): void {
    let dialogRef = this.matDialog.open(TransportFormComponent)
    dialogRef.afterClosed().subscribe(res => {
      if (res.includes('added')) {
        this.showLoader = true;
        this.api.genericGetAPI('/getTransport')
          .subscribe({
            next: (_res) => {
              this.userTransport = _res
              this.dataSource = this.userTransport.filter((transport: any) => {
                if (transport.requestedByEmail === this.user.email) {
                  return transport
                }
              })
              this.showLoader = false;
            },
            error: (err) => {
              this.showLoader = false;
              this.snackBar.open(err.Error, 'OK')
              console.log('ERR: ', err)
            },
            complete: () => { }
          })
        this.snackBar.open(res, 'OK', { duration: 3000 })
      }
    })
  }

  getTransports() {
    this.showLoader = true;
    this.api.genericGetAPI('/getTransport')
      .subscribe({
        next: (_res) => {
          this.userTransport = _res
          if (this.user.role === 'employee') {
            this.dataSource = this.userTransport.filter((transport: any) => {
              if (transport.requestedByEmail === this.user.email) {
                return transport
              }
            })
          } else if (this.user.role === 'manager') {
            this.dataSource = this.userTransport.filter((transport: any) => {
              if (transport.department === this.user.department) {
                return transport
              }
            })
          } else {
            this.dataSource = this.userTransport
          }
          this.showLoader = false;
        },
        error: (err) => {
          this.showLoader = false;
          this.snackBar.open(err.Error, 'OK', { duration: 3000 })
          console.log("ERRORS: ", err)
        },
        complete: () => { }
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
    let message = `Your transport request has been ${data.status}.`
    let _notificationData = {
      message: message,
      for: `${data.item.requestedByEmail}`,
      notificationID: `actioned_${data.item.appID}`
    }
    this.sharedService.sendNotification(_notificationData)
  }

  updateStorageStatus(updatedRequest: any) {
    this.api.genericUpdateAPI('/updateTransport', updatedRequest)
      .subscribe({
        next: (res) => {
          console.log('RESS: ', res)
          this.moveTransport()
        },
        error: (err) => { console.log('ERR: ', err) }
      })
  }

  generatePdf(_row: any): void {
    let docDefinition = {
      content: [
        {
          text: `${_row.requestedBy}`,
          fontSize: 30,
          alignment: 'center'
        },
        {
          text: "Employee Email Address",
          fontSize: 20,
          margin: [0, 10, 0, 10]
        },
        _row.requestedByEmail,
        {
          text: "Employee Department",
          fontSize: 20,
          margin: [0, 10, 0, 10]
        },
        _row.department,
        {
          text: "Transport Type",
          fontSize: 20,
          margin: [0, 10, 0, 10]
        },
        _row.transportType,
        {
          text: "Date Needed",
          fontSize: 20,
          margin: [0, 10, 0, 10]
        },
        _row.neededDate.split('T')[0],
        {
          text: "Pick Up Spot",
          fontSize: 20,
          margin: [0, 10, 0, 10]
        },
        _row.pickUpSpot,
        {
          text: "Drop Off Spot",
          fontSize: 20,
          margin: [0, 10, 0, 10]
        },
        _row.dropOffSpot,
        {
          text: "Pick Up Reason",
          fontSize: 20,
          margin: [0, 10, 0, 10]
        },
        _row.pickUpReason,
      ]
    }

    pdfMake.createPdf(docDefinition).open();
  }
}
