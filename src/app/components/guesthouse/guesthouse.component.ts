import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import * as pdfMake from 'pdfmake/build/pdfMake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts'
import { GuesthouseFormComponent } from 'src/app/forms/guesthouse-form/guesthouse-form.component';
import { SharedServicesService } from 'src/app/services/shared-services.service';

(pdfMake as any).vfs = pdfFonts.pdfMake.vfs


@Component({
  selector: 'app-guesthouse',
  templateUrl: './guesthouse.component.html',
  styleUrls: ['./guesthouse.component.scss']
})

export class GuesthouseComponent {
  displayedColumns: string[] = ['name', 'checkInDate', 'checkOutDate', 'status', 'download'];
  dataSource!: MatTableDataSource<any>;
  user: any;
  userGuestHouse: any;
  reqGuestHouse: any = []
  approvedDataSource!: [];
  rejectedDataSource!: [];
  approvedGuest: any[] = []
  rejectedGuest: any[] = []
  statuses: string[] = ['Approved', 'Rejected']

  

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private matDialog: MatDialog, private sharedService: SharedServicesService,
    private snackBar: MatSnackBar) {
    this.userGuestHouse = this.sharedService.getData('local', 'guesthouse');
    this.user = this.sharedService.getData('session', 'user')
    if (this.user.role === 'employee') {
      this.dataSource = this.userGuestHouse.filter((guesthouse: any) => {
        if (guesthouse.requestedByEmail === this.user.email) {
          this.reqGuestHouse.push(guesthouse)
          return guesthouse
        }
      })
    }else if(this.user.role === 'manager') {
      this.displayedColumns = ['name', 'checkInDate', 'checkOutDate', 'employeeEmail', 'status', 'download'];
      this.dataSource = this.userGuestHouse.filter((guestHouse: any) => {
        if(guestHouse.department === this.user.department) {
          this.reqGuestHouse.push(guestHouse)
          return guestHouse
        }
      })
    }else if(this.user.role === 'admin') {
      this.displayedColumns = ['name', 'checkInDate', 'checkOutDate', 'employeeEmail', 'status', 'download'];
      this.dataSource = this.userGuestHouse.filter((guestHouse: any) => {
        if(guestHouse.status === 'Approved') {
          this.reqGuestHouse.push(guestHouse)
          return guestHouse
        }
      })
    }else {
      this.dataSource = this.userGuestHouse
    }

    this.moveGuestHouse()
  }
  // this.dataSource = this.reqGuestHouse

  moveGuestHouse(): void {
    if (this.user.role === 'employee') {
      this.approvedDataSource = this.userGuestHouse.filter((guestHouse: any) => {
        if (guestHouse.email === this.user.email && guestHouse.status === 'Approved') {
          return guestHouse
        }
      })
      this.rejectedDataSource = this.userGuestHouse.filter((guestHouse: any) => {
        if (guestHouse.email === this.user.email && guestHouse.status === 'Rejected') {
          return guestHouse
        }
      })
    } else if (this.user.role === 'manager') {
      this.displayedColumns = ['name', 'checkInDate', 'checkOutDate', 'employeeEmail', 'status', 'download'];
      this.approvedDataSource = this.userGuestHouse.filter((guestHouse: any) => {
        if (guestHouse.department === this.user.department && guestHouse.status === 'Approved') {
          return guestHouse
        }
      })
      this.rejectedDataSource = this.userGuestHouse.filter((guestHouse: any) => {
        if (guestHouse.department === this.user.department && guestHouse.status === 'Rejected') {
          return guestHouse
        }
      })
    } else {
      this.approvedDataSource = this.userGuestHouse.filter((guestHouse: any) => {
      this.displayedColumns = ['name', 'checkInDate', 'checkOutDate', 'employeeEmail', 'status', 'download'];
        if (guestHouse.status === 'Approved') {
          return guestHouse
        }
      })
      this.rejectedDataSource = this.userGuestHouse.filter((guestHouse: any) => {
        if (guestHouse.status === 'Rejected') {
          return guestHouse
        }
      })
    }
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

guesthouseRequest(): void {
  let dialogRef = this.matDialog.open(GuesthouseFormComponent)
    dialogRef.afterClosed().subscribe(res => {
    this.snackBar.open(res, 'OK', { duration: 3000 })
    this.userGuestHouse = this.sharedService.getData('local', 'guesthouse');
    this.reqGuestHouse = this.userGuestHouse.filter((guesthouse: any) => {
      if (guesthouse.requestedByEmail === this.user.email) {
        return guesthouse
      }
    })
    this.dataSource = this.reqGuestHouse
  })
}

statusUpdate(status: string, reqID: string): void {
  this.userGuestHouse.forEach((guestHouse: any, indx: number) => {
    console.log(guestHouse.reqID, reqID)
    if (guestHouse.reqID === reqID) {
      if (status === 'Approved' || status === 'Rejected') {
        this.userGuestHouse['dateUpdated'] = new Date();
      }
      this.userGuestHouse[indx]['status'] = status;
      this.updateStorageStatus(status, guestHouse)
      this.moveGuestHouse()
    }
  });
  // localStorage.setItem('userGuestHouse', JSON.stringify(this.userGuestHouse));
  // this.updateUser();
}

updateStorageStatus(status: string, guestHouse: any): void {
  this.userGuestHouse = []
  this.sharedService.getData('local', 'guesthouse').forEach((_guestHouse: any) => {
    if (guestHouse.reqID === _guestHouse.reqID) {
      _guestHouse['status'] = status
    }
    this.userGuestHouse.push(_guestHouse)
    console.log(_guestHouse)
  })

  this.sharedService.storeData('local', 'guesthouse', this.userGuestHouse)
}


generatePdf(ele: any): void {
  let row = this.sharedService.getData('local', 'guesthouse').find((policy: any, indx: number) => {
    if (policy.reqID === ele.reqID) {
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
        text: "GuestHouse Name",
        fontSize: 20,
        margin: [0, 10, 0, 10]
      },
      row.guestHouseName,
      {
        text: "Check In Date",
        fontSize: 20,
        margin: [0, 10, 0, 10]
      },
      row.checkInDate.split('T')[0],
      {
        text: "Check Out Date",
        fontSize: 20,
        margin: [0, 10, 0, 10]
      },
      row.checkOutDate.split('T')[0],
      {
        text: "Any Special Needs",
        fontSize: 20,
        margin: [0, 10, 0, 10]
      },
      row.specialNeeds,
      {
        text: "GuestHouse Request Status",
        fontSize: 20,
        margin: [0, 10, 0, 10]
      },
      row.status,
    ]
  }

    pdfMake.createPdf(docDefinition).open();
}
}

