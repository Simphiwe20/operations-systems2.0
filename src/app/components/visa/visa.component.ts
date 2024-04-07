import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import * as pdfMake from 'pdfmake/build/pdfMake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts'
import { ApiServicesService } from 'src/app/api-service/api-services.service';
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
  statuses: string[] = ['Approved', 'Declined']
  approvedDataSource!: [];
  rejectedDataSource!: [];
  approvedVisa: any[] = []
  rejectedVisa: any[] = []

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private matDialog: MatDialog, private sharedService: SharedServicesService,
    private snackBar: MatSnackBar, private api: ApiServicesService) {
    this.user = this.sharedService.getData('session', 'user')
    console.log(this.user)
    if (this.user.role === 'employee') {
      this.displayedColumns = ['visaType', 'neededDate', 'status', 'download'];
    } else {
      this.displayedColumns = ['visaType', 'neededDate', 'employeeEmail', 'status', 'download']
    }
    this.getVisas()
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
        if (visa.email === this.user.email && visa.status === 'Declined') {
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
        if (visa.department === this.user.department && visa.status === 'Declined') {
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
        if (visa.status === 'Declined') {
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
        this.api.genericGetAPI('/getVisas')
          .subscribe({
            next: (_res) => {
              this.userVisas = _res
              this.reqVisa = this.userVisas.filter((visa: any) => {
                if (visa.requestedByEmail === this.user.email) {
                  return visa
                }
              })
              this.dataSource = this.reqVisa
              this.snackBar.open(res, 'OK', { duration: 3000 })
            },
            error: () => { },
            complete: () => { }
          })

      }
    })

    this.dataSource = this.reqVisa
  }

  getVisas() {
    this.api.genericGetAPI('/getVisas')
      .subscribe({
        next: (_res) => {
          this.userVisas = _res
          console.log(this.userVisas)
          this.moveVisas()
          if (this.user.role === 'employee') {
            this.dataSource = this.userVisas.filter((visa: any) => {
              if (visa.requestedByEmail === this.user.email) {
                this.reqVisa.push(visa)
                return visa
              }
            })
          } else if (this.user.role === 'manager') {
            this.userVisas = this.userVisas.filter((visa: any) => {
              if (visa.department === this.user.department) {
                this.reqVisa.push(visa)
                return visa
              }
            })
            this.dataSource = this.userVisas
          } else if (this.user.role === 'admin') {
            this.dataSource = this.userVisas.filter((visa: any) => {
              if (visa.status === 'Approved') {
                return visa
              }
            })
          }
          else {
            this.dataSource = this.userVisas
          }
          console.log(this.userVisas)
          console.log(this.dataSource)
        },
        error: (err) => { console.log(err) },
        complete: () => { }
      })
  }

  statusUpdate(status: string, reqID: string): void {
    this.api.genericGetAPI('/getVisas')
      .subscribe({
        next: (res) => {
          res = this.userVisas
          this.userVisas.forEach((visa: any, indx: number) => {
            if (visa.reqID === reqID) {
              if (status === 'Approved' || status === 'Declined') {
                visa['dateUpdated'] = new Date();
              }
              visa['status'] = status;
              this.updateStorageStatus(status, visa)
              this.moveVisas()
            }
          });
        },
        error: () => { },
        complete: () => { }
      })
  }

  async updateStorageStatus(status: string, travel: any) {
    await this.sharedService.updateRequest('/updateVisa', travel)
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

