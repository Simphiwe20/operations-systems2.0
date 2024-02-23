import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import * as pdfMake from 'pdfmake/build/pdfMake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts'
import { VisaFormComponent } from 'src/app/forms/visa-form/visa-form.component';
import { SharedServicesService } from 'src/app/services/shared-services.service';

(pdfMake as any).vfs = pdfFonts.pdfMake.vfs


@Component({
  selector: 'app-visa',
  templateUrl: './visa.component.html',
  styleUrls: ['./visa.component.scss']
})
export class VisaComponent {
  displayedColumns: string[] = ['visaType', 'neededDate', 'status', 'download'];
  dataSource!: MatTableDataSource<any>;
  user: any;
  userVisas: any;
  reqVisa: any = [];
  statuses: string[] = ['Approved', 'Rejected']
  approvedDataSource!: [];
  rejectedDataSource!: [];
  approvedVisa: any[] = []
  rejectedVisa: any[] = []

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private matDialog: MatDialog, private sharedService: SharedServicesService,
    private snackBar: MatSnackBar) {
    this.userVisas = this.sharedService.getData('local', 'visas');
    this.user = sessionStorage.getItem('user')
    this.user = this.user ? JSON.parse(this.user) : {}
    if (this.user.role === 'employee') {
      this.displayedColumns = ['visaType', 'neededDate', 'status', 'download'];
      this.dataSource = this.userVisas.filter((visa: any) => {
        if (visa.requestedByEmail === this.user.email) {
          this.reqVisa.push(visa)
          return visa
        }
      })
    } else if (this.user.role === 'manager') {
      this.displayedColumns = ['visaType', 'neededDate', 'employeeEmail', 'status', 'download'];
      this.userVisas = this.userVisas.filter((visa: any) => {
        if (visa.department === this.user.department) {
          this.reqVisa.push(visa)
          return visa
        }
      })
      this.dataSource = this.userVisas
    } else if (this.user.role === 'admin') {
      this.displayedColumns = ['visaType', 'neededDate', 'employeeEmail', 'status', 'download']
      this.dataSource = this.userVisas.filter((visa: any) => {
        if (visa.status === 'Approved') {
          return visa
        }
      })
    }
    else {
      this.displayedColumns = ['visaType', 'neededDate', 'employeeEmail', 'status', 'download']
      this.dataSource = this.sharedService.getData('local', 'visas')
    }
    console.log(this.dataSource)
    console.log(this.sharedService.getData('local', 'visas'))
    this.moveVisas()


  }



  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  moveVisas(): void {
    if (this.user.role === 'employee') {
      this.displayedColumns = ['visaType', 'neededDate', 'status', 'download'];
      this.approvedDataSource = this.userVisas.filter((visa: any) => {
        if (visa.email === this.user.email && visa.status === 'Approved') {
          this.reqVisa.push(visa)
          return visa
        }
      })
      this.rejectedDataSource = this.userVisas.filter((visa: any) => {
        if (visa.email === this.user.email && visa.status === 'Rejected') {
          return visa
        }
      })
    } else if (this.user.role === 'manager') {
      this.displayedColumns = ['visaType', 'neededDate', 'employeeEmail', 'status', 'download'];
      this.approvedDataSource = this.userVisas.filter((visa: any) => {
        if (visa.department === this.user.department && visa.status === 'Approved') {
          this.reqVisa.push(visa)
          return visa
        }
      })
      this.rejectedDataSource = this.userVisas.filter((visa: any) => {
        if (visa.department === this.user.department && visa.status === 'Rejected') {
          return visa
        }
      })
    } else {
      this.approvedDataSource = this.userVisas.filter((visa: any) => {
        if (visa.status === 'Approved') {
          return visa
        }
      })
      this.rejectedDataSource = this.userVisas.filter((visa: any) => {
        if (visa.status === 'Rejected') {
          return visa
        }
      })
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  RequestVisa(): void {
    let dialogRef = this.matDialog.open(VisaFormComponent)
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.userVisas = this.sharedService.getData('local', 'visas')
        this.reqVisa = this.userVisas.filter((visa: any) => {
          if (visa.requestedByEmail === this.user.email) {
            return visa

          }
        })
        this.snackBar.open(res, 'OK', { duration: 3000 })

      }
    })

    this.dataSource = this.reqVisa
  }

  statusUpdate(status: string, reqID: string): void {
    this.userVisas.forEach((visa: any, indx: number) => {
      console.log(reqID, visa.reqID)
      if (visa.reqID === reqID) {
        if (status === 'Approved' || status === 'Rejected') {
          this.userVisas['dateUpdated'] = new Date();
        }
        this.userVisas[indx]['status'] = status;
        this.updateStorageStatus(status, visa)
        this.moveVisas()
      }
    });
    // localStorage.setItem('userGuestHouse', JSON.stringify(this.userGuestHouse));
    // this.updateUser();
  }

  updateStorageStatus(status: string, visa: any): void {
    this.userVisas = []
    this.sharedService.getData('local', 'visas').forEach((_visa: any) => {
      if (visa.reqID === _visa.reqID) {
        _visa['status'] = status
      }
      this.userVisas.push(_visa)
      console.log(_visa)
    })

    this.sharedService.storeData('local', 'visas', this.userVisas)
  }

  generatePdf(ele: any): void {
    let row = this.sharedService.getData('local', 'visas').find((visa: any, i: number) => {
      if (ele.reqID === visa.reqID) {
        return visa
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
          text: "Date Needed",
          fontSize: 20,
          margin: [0, 10, 0, 10]
        },
        row.neededDate.split('T')[0],
        {
          text: "Visa Request Type",
          fontSize: 20,
          margin: [0, 10, 0, 10]
        },
        row.visaType,
        {
          text: "Replacement Reason",
          fontSize: 20,
          margin: [0, 10, 0, 10]
        },
        row.replacementReason,
        {
          text: "Visa Request Status",
          fontSize: 20,
          margin: [0, 10, 0, 10]
        },
        row.status,
      ]
    }

    pdfMake.createPdf(docDefinition).open();
  }
}

