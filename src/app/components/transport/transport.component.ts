import { AfterViewInit, Component, ViewChild } from '@angular/core';
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
export class TransportComponent {
  displayedColumns: string[] = ['transportType', 'neededDate', 'pickUpSpot', 'pickUpReason', 'dropOffSpot', 'status', 'download'];
  dataSource!: MatTableDataSource<any>;
  user: any;
  userTransport: any;
  statuses: string[] = ['Approved', 'Rejected']
  approvedDataSource!: MatTableDataSource<any>;
  rejectedDataSource!: MatTableDataSource<any>;
  columnNames: string[] = []

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private matDialog: MatDialog, private sharedService: SharedServicesService,
    private snackBar: MatSnackBar, private api: ApiServicesService) {
    this.user = this.sharedService.getData('session', 'user')
    console.log(this.user)
    if (this.user.role === 'manager') {
      this.displayedColumns = ['transportType', 'neededDate', 'pickUpSpot', 'pickUpReason', 'dropOffSpot', 'employeeEmail', 'status', 'download'];
    }
    else if(this.user.role !== 'employee') {
      this.displayedColumns = ['transportType', 'neededDate', 'pickUpSpot', 'pickUpReason', 'dropOffSpot', 'employeeEmail', 'status', 'download']
    }
    console.log(this.dataSource)
    console.log(this.sharedService.getData('local', 'transport'))
    this.getTransports()
    this.moveTransport()

  }



  ngAfterViewInit() {
    this.columnNames = ['Transport Type', 'Needed Date', 'Pick Up Spot', 'Pick Up Reason', 'Drop Off Spot', 'Employee Email', 'Status', 'Download']
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

  moveTransport(): void {
    this.api.genericGetAPI('getTransport')
      .subscribe({
        next: (_res) => {
          this.userTransport = _res
          if (this.user.role === 'employee') {
            this.approvedDataSource = this.userTransport.filter((transport: any) => {
              if (transport.requestedByEmail === this.user.email && transport.status === 'Approved') {
                return transport
              }
            })
            this.rejectedDataSource = this.userTransport.filter((transport: any) => {
              if (transport.requestedByEmail === this.user.email && transport.status === 'Rejected') {
                return transport
              }
            })
          } else if (this.user.role === 'manager') {
            this.approvedDataSource = this.userTransport.filter((transport: any) => {
              if (transport.department === this.user.department && transport.status === 'Approved') {
                return transport
              }
            })
            this.rejectedDataSource = this.userTransport.filter((transport: any) => {
              if (transport.department === this.user.department && transport.status === 'Rejected') {
                return transport
              }
            })
          } else {
            this.approvedDataSource = this.userTransport.filter((transport: any) => {
              if (transport.status === 'Approved') {
                return transport
              }
            })
            this.rejectedDataSource = this.userTransport.filter((transport: any) => {
              if (transport.status === 'Rejected') {
                return transport
              }
            })
          }
        },
        error: (err) => { console.log(err) },
        complete: () => { }
      })

  }

  
  selectedIndex(event: any) {
    console.log('EVENT: ', event)
    if(event == 1) {
      this.dataSource = this.approvedDataSource
    }else if(event == 2) {
      this.dataSource = this.rejectedDataSource
    }else {
      this.dataSource = this.userTransport
    }
  }


  requestTransport(): void {
    let dialogRef = this.matDialog.open(TransportFormComponent)
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.api.genericGetAPI('/getTransport')
          .subscribe({
            next: (_res) => {
              console.log(res)
              this.userTransport = _res
              this.dataSource = this.userTransport.filter((transport: any) => {
                if (transport.requestedByEmail === this.user.email) {
                  return transport
                }
              })
            },
            error: (err) => { console.log(err) },
            complete: () => { }
          })
        this.snackBar.open(res, 'OK', { duration: 3000 })
      }
    })
  }

  getTransports() {
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
          } else if (this.user.role === 'admin') {
            this.dataSource = this.userTransport.filter((transport: any) => {
              if (transport.status === 'Approved') {
                return transport
              }
            })
          }
        },
        error: (err) => { console.log(err) },
        complete: () => { }
      })
  }

  statusUpdate(status: string, reqID: string): void {
    this.api.genericGetAPI('/getTransport')
      .subscribe({
        next: (res) => {
          res = this.userTransport
          this.userTransport.forEach((transport: any, indx: number) => {
            if (transport.reqID === reqID) {
              if (status === 'Approved' || status === 'Declined') {
                transport['dateUpdated'] = new Date();
              }
              transport['status'] = status;
              this.updateStorageStatus(status, transport)
              this.moveTransport()
            }
          });
        },
        error: () => { },
        complete: () => { }
      })
  }

  async updateStorageStatus(status: string, travel: any) {
    await this.sharedService.updateRequest('/updateTransport', travel)
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
