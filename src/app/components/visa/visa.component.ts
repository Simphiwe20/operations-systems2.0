import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { flush } from '@angular/core/testing';
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
  columnNames: string[] = ['Visa Type', 'Needed Date', 'Status', 'Download'];
  dataSource!: MatTableDataSource<any>;
  user: any;
  userVisas: any;
  reqVisa: any = [];
  statuses: string[] = ['Approved', 'Declined']
  approvedDataSource!: MatTableDataSource<any>;
  rejectedDataSource!: MatTableDataSource<any>;
  showLoader: boolean = true

  constructor(private matDialog: MatDialog, private sharedService: SharedServicesService,
    private snackBar: MatSnackBar, private api: ApiServicesService) {
    this.user = this.sharedService.getData('session', 'user')
    console.log(this.user)
    if (this.user.role !== 'employee') {
      this.displayedColumns = ['visaType', 'neededDate', 'requestedByEmail', 'status', 'download'];
      this.columnNames = ['Visa Type', 'Needed Date', 'Email', 'Status', 'Download']
    } 
    this.getVisas()
  }

  moveVisas(): void {
    if (this.user.role === 'employee') {
      // this.displayedColumns = ['visaType', 'neededDate', 'status', 'download'];
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
      // this.displayedColumns = ['visaType', 'neededDate', 'employeeEmail', 'status', 'download'];
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

  RequestVisa(): void {
    let dialogRef = this.matDialog.open(VisaFormComponent)
    dialogRef.afterClosed().subscribe(res => {
      this.showLoader = true
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
              this.showLoader = false
            },
            error: (err) => {
              this.showLoader = false;
              this.snackBar.open(err.Error, 'OK', { duration: 3000 })
            },
            complete: () => { }
          })

      }
    })

    this.dataSource = this.userVisas
    console.log('this.dataSource: ', this.dataSource)
  }

  getVisas() {
    this.showLoader = true
    this.api.genericGetAPI('/getVisas')
      .subscribe({
        next: (_res) => {
          this.userVisas = _res
          this.moveVisas()
          if (this.user.role === 'employee') {
            this.dataSource = this.userVisas.filter((visa: any) => {
              if (visa.requestedByEmail === this.user.email) {
                this.reqVisa.push(visa)
                console.log('visa: ', visa)
                return visa
              }
            })
            console.log('this.dataSource.........', this.dataSource)
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
            console.log('this.dataSource.........: ', this.dataSource)

          }
          console.log('this.userVisas: ', this.userVisas)
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
    let message = `Your visa request has been ${data.status}.`
    let _notificationData = {
      message: message,
      for: `${data.item.requestedByEmail}`,
      notificationID: `actioned_${data.item.appID}`
    }
    this.sharedService.sendNotification(_notificationData)
  }

  updateStorageStatus(updatedRequest: any) {
    this.api.genericUpdateAPI('/updateVisa', updatedRequest)
      .subscribe({
        next: (res) => {
          console.log('RESS: ', res)
          this.moveVisas()
          this.showLoader = false
        },
        error: (err) => { console.log('ERR: ', err) }
      })
  }


  selectedIndex(event: any) {
    console.log('EVENT: ', event)
    if (event == 1) {
      this.dataSource = this.approvedDataSource
    } else if (event == 2) {
      this.dataSource = this.rejectedDataSource
    } else {
      this.dataSource = this.userVisas
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

