import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import * as pdfMake from 'pdfmake/build/pdfMake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts'
import { TravelFormComponent } from 'src/app/forms/travel-form/travel-form.component';
import { SharedServicesService } from 'src/app/services/shared-services.service';

(pdfMake as any).vfs = pdfFonts.pdfMake.vfs

@Component({
  selector: 'app-travel',
  templateUrl: './travel.component.html',
  styleUrls: ['./travel.component.scss']
})
export class TravelComponent implements AfterViewInit{
  displayedColumns: string[] = ['travelType', 'returnDate', 'travelReason', 'departureDate', 'employeeEmail', 'status', 'download'];
  dataSource!: MatTableDataSource<any>;
  user: any;
  userTravels: any;
  reqTravels: any[] = []
  statuses: string[] = ['Approved', 'Rejected']
  approvedDataSource!: [];
  rejectedDataSource!: [];
  approvedTravel: any[] = []
  rejectedTravel: any[] = []

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private matDialog: MatDialog, private sharedService: SharedServicesService,
    private snackBar: MatSnackBar) {
    this.userTravels = this.sharedService.getData('local', 'travels');
    this.user = this.sharedService.getData('session', 'user')
    if (this.user.role === 'employee') {
      this.displayedColumns = ['travelType', 'returnDate', 'travelReason', 'departureDate', 'status', 'download'];
      this.dataSource = this.userTravels.filter((travel: any) => {
        if (travel.requestedByEmail === this.user.email) {
          this.reqTravels.push(travel)
          return travel
        }
      })
    } else if (this.user.role === 'manager') {
      this.userTravels = this.userTravels.filter((travel: any) => {
        if (travel.department === this.user.department) {
          this.reqTravels.push(travel)
          return travel
        }
      })
      this.dataSource = this.userTravels
    } else if (this.user.role === 'admin') {
      this.dataSource = this.userTravels.filter((travel: any) => {
        if (travel.status === 'Approved') {
          this.reqTravels.push(travel)
          return travel
        }
      })
    }
    else {
      this.dataSource = this.sharedService.getData('local', 'travels')
    }
    console.log(this.dataSource)
    console.log(this.sharedService.getData('local', 'travels'))
    console.log(this.reqTravels)
    this.moveTravel()
    

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

  moveTravel(): void {
    if (this.user.role === 'employee') {
      this.displayedColumns = ['travelType', 'returnDate', 'travelReason', 'departureDate', 'status', 'download'];
      this.approvedDataSource = this.userTravels.filter((travel: any) => {
        if (travel.requestedByEmail === this.user.email && travel.status === 'Approved') {
          this.userTravels.push(travel)
          return travel
        }
      })
      this.rejectedDataSource = this.userTravels.filter((travel: any) => {
        if (travel.requestedByEmail === this.user.email && travel.status === 'Rejected') {
          this.userTravels.push(travel)
          return travel
        }
      })
    } else if (this.user.role === 'manager') {
      this.approvedDataSource = this.userTravels.filter((travel: any) => {
        if (travel.department === this.user.department && travel.status === 'Approved') {
          this.userTravels.push(travel)
          return travel
        }
      })
      this.rejectedDataSource = this.userTravels.filter((travel: any) => {
        if (travel.department === this.user.department && travel.status === 'Rejected') {
          this.userTravels.push(travel)
          return travel
        }
      })
    } else {
      this.approvedDataSource = this.userTravels.filter((travel: any) => {
        if (travel.status === 'Approved') {
          this.userTravels.push(travel)
          return travel
        }
      })
      this.rejectedDataSource = this.userTravels.filter((travel: any) => {
        if (travel.status === 'Rejected') {
          this.userTravels.push(travel)
          return travel
        }
      })
    }
  }

  travelReq(): void {
    let dialogRef = this.matDialog.open(TravelFormComponent)
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.userTravels = this.sharedService.getData('local', 'travels');
        this.dataSource = this.userTravels.filter((travel: any) => {
          if (travel.requestedByEmail === this.user.email) {
            return travel
          }
        })
        this.snackBar.open(res, 'OK', { duration: 3000 })
      }
    })

  }

  statusUpdate(status: string, reqID: string): void {
    this.userTravels.forEach((travel: any, indx: number) => {
      if (travel.reqID === reqID) {
        if (status === 'Approved' || status === 'Rejected') {
          this.userTravels['dateUpdated'] = new Date();
        }
        this.userTravels[indx]['status'] = status;
        this.updateStorageStatus(status, travel)
        this.moveTravel()
      }
    });
    // localStorage.setItem('userGuestHouse', JSON.stringify(this.userGuestHouse));
    // this.updateUser();
  }

  updateStorageStatus(status: string, travel: any): void {
    this.userTravels = []
    this.sharedService.getData('local', 'travels').forEach((_travel: any) => {
      if (travel.reqID === _travel.reqID) {
        _travel['status'] = status
      }
      this.userTravels.push(_travel)
      console.log(_travel)
    })

    this.sharedService.storeData('local', 'travels', this.userTravels)
  }

  generatePdf(indx: number): void {
    let row = this.sharedService.getData('local', 'travels').find((travel: any, i: number) => {
      if(i === indx) {
        return travel
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
