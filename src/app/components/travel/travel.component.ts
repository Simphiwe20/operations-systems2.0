import { AfterViewInit, Component, ViewChild } from '@angular/core';
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
export class TravelComponent implements AfterViewInit {
  displayedColumns: string[] = ['travelType', 'returnDate', 'reasonForTravel', 'departureDate', 'employeeEmail', 'status', 'download'];
  dataSource!: MatTableDataSource<any>;
  user: any;
  userTravels: any;
  reqTravels: any[] = []
  statuses: string[] = ['Approved', 'Declined']
  approvedDataSource: any;
  rejectedDataSource: any;
  columnNames!: string[]

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private matDialog: MatDialog, private sharedService: SharedServicesService,
    private snackBar: MatSnackBar, private api: ApiServicesService) {
    this.user = this.sharedService.getData('session', 'user')
    if (this.user.role === 'employee') {
      this.displayedColumns = ['travelType', 'returnDate', 'reasonForTravel', 'departureDate', 'status', 'download'];
    }
    this.getTravel()
    this.moveTravel()
    console.log(this.approvedDataSource)
    console.log(this.rejectedDataSource)
  }

  ngAfterViewInit() {
    this.columnNames = ['Travel Type', 'Return Date', 'Travel Reason', 'Departure Date', 'Status', 'Download']
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
            this.rejectedDataSource = this.userTravels.filter((travel: any) => {
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
            this.rejectedDataSource = this.userTravels.filter((travel: any) => {
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
            this.rejectedDataSource = this.userTravels.filter((travel: any) => {
              if (travel.status === 'Declined') {
                return travel
              }
            })
          }
        },
        error: () => { },
        complete: () => { }
      })
  }

  travelReq(): void {
    let dialogRef = this.matDialog.open(TravelFormComponent)
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.api.genericGetAPI('/getTravel')
          .subscribe({
            next: (_res) => {
              this.userTravels = _res
              this.dataSource = this.userTravels.filter((travel: any) => {
                if (travel.requestedByEmail === this.user.email) {
                  return travel
                }
              })
            },
            error: () => { },
            complete: () => { }
          })
        this.snackBar.open(res, 'OK', { duration: 3000 })
      }
    })

  }

  statusUpdate(status: string, reqID: string): void {
    this.api.genericGetAPI('/getTravel')
      .subscribe({
        next: (res) => {
          res = this.userTravels
          this.userTravels.forEach((travel: any, indx: number) => {
            if (travel.reqID === reqID) {
              if (status === 'Approved' || status === 'Declined') {
                travel['dateUpdated'] = new Date();
              }
              travel['status'] = status;
              this.updateStorageStatus(status, travel)
              this.moveTravel()
            }
          });
        },
        error: () => { },
        complete: () => { }
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
          else if (this.user.role === 'admin') {
            this.dataSource = this.userTravels.filter((travel: any) => {
              if (travel.status === 'Approved') {
                this.reqTravels.push(travel)
                return travel
              }
            })
          }
        },
        error: () => { },
        complete: () => { }
      })
  }

  async updateStorageStatus(status: string, travel: any) {
    await this.sharedService.updateRequest('/updateTravel', travel)
  }

  
  selectedIndex(event: any) {
    console.log('EVENT: ', event)
    if(event == 1) {
      this.dataSource = this.approvedDataSource
    }else if(event == 2) {
      this.dataSource = this.rejectedDataSource
    }else {
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
