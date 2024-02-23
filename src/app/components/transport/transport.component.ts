import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import * as pdfMake from 'pdfmake/build/pdfMake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts'
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
  reqTransport: any[] = []
  statuses: string[] = ['Approved', 'Rejected']
  approvedDataSource!: [];
  rejectedDataSource!: [];
  approvedTransport: any[] = []
  rejectedTransport: any[] = []

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private matDialog: MatDialog, private sharedService: SharedServicesService,
    private snackBar: MatSnackBar) {
    this.userTransport = this.sharedService.getData('local', 'transport');
    this.user = sessionStorage.getItem('user')
    this.user = this.user ? JSON.parse(this.user) : {}
    if (this.user.role === 'employee') {
      this.dataSource = this.userTransport.filter((transport: any) => {
        if (transport.requestedByEmail === this.user.email) {
          this.reqTransport.push(transport)
          return transport
        }
      })
    } else if (this.user.role === 'manager') {
      this.displayedColumns = ['transportType', 'neededDate', 'pickUpSpot', 'pickUpReason', 'dropOffSpot', 'employeeEmail' ,'status', 'download'];
      this.userTransport = this.userTransport.filter((transport: any) => {
        if (transport.department === this.user.department) {
          this.reqTransport.push(transport)
          return transport
        }
      })
      this.dataSource = this.userTransport
    } else if (this.user.role === 'admin') {
      this.displayedColumns = ['transportType', 'neededDate', 'pickUpSpot', 'pickUpReason', 'dropOffSpot', 'employeeEmail' ,'status', 'download']
      this.dataSource = this.userTransport.filter((transport: any) => {
        if (transport.status === 'Approved') {
          this.reqTransport.push(transport)
          return transport
        }
      })
    }
    else {
      this.displayedColumns = ['transportType', 'neededDate', 'pickUpSpot', 'pickUpReason', 'dropOffSpot', 'employeeEmail' ,'status', 'download']
      this.dataSource = this.sharedService.getData('local', 'transport')
    }
    console.log(this.dataSource)
    console.log(this.sharedService.getData('local', 'transport'))
    console.log(this.reqTransport)
    this.moveTransport()
    


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

  moveTransport(): void {
    if (this.user.role === 'employee') {
      this.displayedColumns = ['transportType', 'neededDate', 'pickUpSpot', 'pickUpReason', 'dropOffSpot', 'status', 'download'];
      this.approvedDataSource = this.userTransport.filter((transport: any) => {
        if (transport.requestedByEmail === this.user.email && transport.status === 'Approved') {
          this.reqTransport.push(transport)
          return transport
        }
      })
      this.rejectedDataSource = this.userTransport.filter((transport: any) => {
        if (transport.requestedByEmail === this.user.email && transport.status === 'Rejected') {
          this.reqTransport.push(transport)
          return transport
        }
      })
    } else if (this.user.role === 'manager') {
      this.displayedColumns = ['transportType', 'neededDate', 'pickUpSpot', 'pickUpReason', 'dropOffSpot', 'employeeEmail' ,'status', 'download'];
      this.approvedDataSource = this.userTransport.filter((transport: any) => {
        if (transport.department === this.user.department && transport.status === 'Approved') {
          this.reqTransport.push(transport)
          return transport
        }
      })
      this.rejectedDataSource = this.userTransport.filter((transport: any) => {
        if (transport.department === this.user.department && transport.status === 'Rejected') {
          this.reqTransport.push(transport)
          return transport
        }
      })
    } else {
      this.displayedColumns = ['transportType', 'neededDate', 'pickUpSpot', 'pickUpReason', 'dropOffSpot', 'employeeEmail' ,'status', 'download']; 
      this.approvedDataSource = this.userTransport.filter((transport: any) => {
        if (transport.status === 'Approved') {
          this.reqTransport.push(transport)
          return transport
        }
      })
      this.rejectedDataSource = this.userTransport.filter((transport: any) => {
        if (transport.status === 'Rejected') {
          this.reqTransport.push(transport)
          return transport
        }
      })
    }
  }


  requestTransport(): void {
    let dialogRef = this.matDialog.open(TransportFormComponent)
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.userTransport = this.sharedService.getData('local', 'transport');
        this.dataSource = this.userTransport.filter((transport: any) => {
          if (transport.requestedByEmail === this.user.email) {
            this.reqTransport.push(transport)
            return transport
          }
        })
        this.snackBar.open(res, 'OK', { duration: 3000 })
      }
    })
  }

  statusUpdate(status: string, reqID: string): void {
    this.userTransport.forEach((transport: any, indx: number) => {
      if (transport.reqID === reqID) {
        if (status === 'Approved' || status === 'Rejected') {
          this.userTransport['dateUpdated'] = new Date();
        }
        this.userTransport[indx]['status'] = status;
        this.updateStorageStatus(status, transport)
        this.moveTransport()
      }
    });
    // localStorage.setItem('userGuestHouse', JSON.stringify(this.userGuestHouse));
    // this.updateUser();
  }

  updateStorageStatus(status: string, transport: any): void {
    this.userTransport = []
    this.sharedService.getData('local', 'transport').forEach((_transport: any) => {
      if (transport.reqID === _transport.reqID) {
        _transport['status'] = status
      }
      this.userTransport.push(_transport)
      console.log(_transport)
    })

    this.sharedService.storeData('local', 'transport', this.userTransport)
  }

  generatePdf(_row: any): void {
    let row = this.sharedService.getData('local', 'transport').find((policy: any, i: number) => {
      if(policy.reqID === _row.reqID) {
        return policy
      }
    })
    console.log(row)
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
          text: "Transport Type",
          fontSize: 20,
          margin: [0, 10, 0, 10]
        },
        row.transportType,
        {
          text: "Date Needed",
          fontSize: 20,
          margin: [0, 10, 0, 10]
        },
        row.neededDate.split('T')[0],
        {
          text: "Pick Up Spot",
          fontSize: 20,
          margin: [0, 10, 0, 10]
        },
        row.pickUpSpot,
        {
          text: "Drop Off Spot",
          fontSize: 20,
          margin: [0, 10, 0, 10]
        },
        row.dropOffSpot,
        {
          text: "Pick Up Reason",
          fontSize: 20,
          margin: [0, 10, 0, 10]
        },
        row.pickUpReason,
      ]
    }
    
    pdfMake.createPdf(docDefinition).open();
  }
}
