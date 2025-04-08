import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import * as pdfMake from 'pdfmake/build/pdfMake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts'
import { ApiServicesService } from 'src/app/api-service/api-services.service';
import { TravelFormComponent } from 'src/app/forms/travel-form/travel-form.component';
import { SharedServicesService } from 'src/app/services/shared-services.service';

(pdfMake as any).vfs = pdfFonts.pdfMake.vfs

@Component({
  selector: 'app-travel',
  templateUrl: './travel.component.html',
  styleUrls: ['./travel.component.scss']
})
export class TravelComponent implements OnInit {
  displayedColumns: string[] = ['travelType', 'returnDate', 'reasonForTravel', 'departureDate', 'requestedByEmail', 'status', 'download'];
  columnNames: string[] = ['Travel Type', 'Return Date', 'Travel Reason', 'Departure Date', 'Email', 'Status', 'Download'];
  dataSource!: MatTableDataSource<any>;
  user: any;
  userTravels: any;
  reqTravels: any[] = []
  statuses: string[] = ['Approved', 'Declined']
  approvedDataSource: any;
  declinedDataSource: any;
  showLoader: boolean = true

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private matDialog: MatDialog, private sharedService: SharedServicesService,
    private snackBar: MatSnackBar, private api: ApiServicesService) { }

  ngOnInit(): void {
    this.user = this.sharedService.getData('session', 'user')
    if (this.user.role === 'employee') {
      this.displayedColumns = ['travelType', 'returnDate', 'reasonForTravel', 'departureDate', 'status', 'download'];
      this.columnNames = ['Travel Type', 'Return Date', 'Travel Reason', 'Departure Date', 'Status', 'Download'];

    }
    this.getTravel()
    this.moveTravel()
  }

  moveTravel(): void {
    this.api.genericGetAPI('/getTravel')
      .subscribe({
        next: (_res) => {
          this.userTravels = _res
          if (this.user.role === 'employee') {
            this.displayedColumns = ['travelType', 'returnDate', 'reasonForTravel', 'departureDate', 'status', 'download'];
            this.approvedDataSource = this.userTravels.filter((travel: any) => {
              if (travel.requestedByEmail === this.user.email && travel.status === 'Approved') {
                return travel
              }
            })
            this.declinedDataSource = this.userTravels.filter((travel: any) => {
              if (travel.requestedByEmail === this.user.email && travel.status === 'Declined') {
                return travel
              }
            })
          } else if (this.user.role === 'manager') {
            this.approvedDataSource = this.userTravels.filter((travel: any) => {
              if (travel.department === this.user.department && travel.status === 'Approved') {
                return travel
              }
            })
            this.declinedDataSource = this.userTravels.filter((travel: any) => {
              if (travel.department === this.user.department && travel.status === 'Declined') {
                return travel
              }
            })
          } else {
            this.approvedDataSource = this.userTravels.filter((travel: any) => {
              if (travel.status === 'Approved') {
                return travel
              }
            })
            this.declinedDataSource = this.userTravels.filter((travel: any) => {
              if (travel.status === 'Declined') {
                return travel
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

  travelReq(): void {
    let dialogRef = this.matDialog.open(TravelFormComponent)
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.showLoader = true
        this.api.genericGetAPI('/getTravel')
          .subscribe({
            next: (_res) => {
              this.userTravels = _res
              this.dataSource = this.userTravels.filter((travel: any) => {
                if (travel.requestedByEmail === this.user.email) {
                  return travel
                }
              })
              this.showLoader = false;
            },
            error: (err) => {
              this.showLoader = false;
              this.snackBar.open(err.Error, 'OK')
            },
            complete: () => { }
          })
        this.showLoader = false
        this.snackBar.open(res, 'OK', { duration: 3000 })
      }
    })

  }

  getTravel() {
    this.api.genericGetAPI('/getTravel')
      .subscribe({
        next: (_res) => {
          this.userTravels = _res
          if (this.user.role === 'employee') {
            this.dataSource = this.userTravels.filter((travel: any) => {
              if (travel.requestedByEmail === this.user.email) {
                return travel
              }
            })
          } else if (this.user.role === 'manager') {
            this.dataSource = this.userTravels.filter((travel: any) => {
              if (travel.department === this.user.department) {
                this.reqTravels.push(travel)
                return travel
              }
            })
          }
          else {
            this.dataSource = this.userTravels
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

  statusUpdate(event: any): void {
    this.showLoader = true;
    let updatedRequest = event.item
    updatedRequest.status = event.status
    updatedRequest.dateUpdated = new Date();
    this.updateStorageStatus(updatedRequest)
    this.sendNotifications(event)
  }

  
  sendNotifications(data: any) {
    let message = `Your travel request has been ${data.status}.`
    let _notificationData = {
      message: message,
      for: `${data.item.requestedByEmail}`,
      notificationID: `actioned_${data.item.appID}`
    }
    this.sharedService.sendNotification(_notificationData)
  }

  updateStorageStatus(updatedRequest: any) {
    this.api.genericUpdateAPI('/updateTravel', updatedRequest)
      .subscribe({
        next: (res) => {
          console.log('RESS: ', res)
          this.moveTravel()
        },
        error: (err) => { console.log('ERR: ', err) }
      })
  }

  selectedIndex(event: any) {
    console.log('EVENT: ', event)
    if (event == 1) {
      this.dataSource = this.approvedDataSource
    } else if (event == 2) {
      this.dataSource = this.declinedDataSource
    } else {
      this.dataSource = this.userTravels
    }
  }

  generatePdf(row: any): void {
    let docDefinition = {
      content: [
        {
          text: `${row.requestedBy}`,
          fontSize: 30,
          alignment: 'center'
        },
        {
          text: "Employee Email Address",
          fontSize: 20,
          margin: [0, 10, 0, 10]
        },
        row.requestedByEmail,
        {
          text: "Employee Department",
          fontSize: 20,
          margin: [0, 10, 0, 10]
        },
        row.department,
        {
          text: "Reason for travel",
          fontSize: 20,
          margin: [0, 10, 0, 10]
        },
        row.reasonForTravel,
        {
          text: "Departure Date",
          fontSize: 20,
          margin: [0, 10, 0, 10]
        },
        row.departureDate.split('T')[0],
        {
          text: "Return Date",
          fontSize: 20,
          margin: [0, 10, 0, 10]
        },
        row.returnDate,
        {
          text: "Reason",
          fontSize: 20,
          margin: [0, 10, 0, 10]
        },
        row.dropOffSpot,
        {
          text: "Travel Type",
          fontSize: 20,
          margin: [0, 10, 0, 10]
        },
        row.travelType,
        {
          text: "Status",
          fontSize: 20,
          margin: [0, 10, 0, 10]
        },
        row.status
      ]
    }

    pdfMake.createPdf(docDefinition).open();
  }
}
