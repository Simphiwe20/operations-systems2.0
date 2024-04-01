import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { PolicyFormComponent } from 'src/app/forms/policy-form/policy-form.component';
import { MatSnackBar } from '@angular/material/snack-bar';

import * as docx from 'docx'
import * as pdfMake from 'pdfmake/build/pdfMake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts'
import { SharedServicesService } from 'src/app/services/shared-services.service';
import { DeletePopUpComponent } from 'src/app/popUps/delete-pop-up/delete-pop-up.component';

(pdfMake as any).vfs = pdfFonts.pdfMake.vfs


@Component({
  selector: 'app-policies',
  templateUrl: './policies.component.html',
  styleUrls: ['./policies.component.scss']
})
export class PoliciesComponent implements AfterViewInit{
  displayedColumns: string[] = ['name', 'category', 'action', 'download' ];
  dataSource!: MatTableDataSource<any>;
  user: any;
 documentContent!: string;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  fileContent: any | ArrayBuffer = '';


  constructor(private matDialog: MatDialog, private sharedService: SharedServicesService, private snackBar: MatSnackBar,) {
    this.dataSource = this.sharedService.getData('local', 'policies');
    this.user = sessionStorage.getItem('user')
    this.user = this.user ? JSON.parse(this.user) : {}
    console.log(this.dataSource)
    if(this.user.role !== 'admin' || this.user.role === 'employee') {
      this.displayedColumns = ['name', 'category', 'download' ]
    }
  }

  ngOnInit(): void {
    console.log(this.sharedService.getData('local' ,'policies'));

   //  New way of subscribing or listen to an observables
    this.sharedService.policy$.subscribe({
     next: (result: any) => this.dataSource = result,
     error: (err: any) => console.log(err),
     complete: () => {}
    })
 }


 readDocument(fileChangeEvent: Event) {
   const file = (fileChangeEvent.target as HTMLInputElement).files![0];
   let fileReader = new FileReader();
   fileReader.onload = async (e) => {
     const arrayBuffer = fileReader.result as ArrayBuffer;
    //  const doc = await docx.Document.load(arrayBuffer);
    //  console.log(doc)
    //  const html = await docx.convertToHtml(doc);
    //  this.documentContent = html.outerHTML;
   };
   fileReader.readAsArrayBuffer(file);
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

  RequestGH(): void {
    let dialogRef = this.matDialog.open(PolicyFormComponent)
    dialogRef.afterClosed().subscribe(res => {
      if(res) {
        this.dataSource = this.sharedService.getData('local', 'policies')
      }
    })
  }

  generatePdf(_row: any): void {
    let row = this.sharedService.getData('local', 'policies').find((policy: any, i: number) => {
      if(policy.reqID === _row.reqID) {
        return policy
      }
    })
    console.log(row)
    let docDefinition = {
      content: [
        {
          text: row.policyName + " Policy",
          fontSize: 30,
          alignment: 'center'
        },
        {
          text: "Policy Name",
          fontSize: 20,
          margin: [0, 10, 0, 10]
        },
        row.policyName,
        {
          text: "Policy Category",
          fontSize: 20,
          margin: [0, 10, 0, 10]
        },
        row.category,
        {
          text: "Overview",
          fontSize: 20,
          margin: [0, 10, 0, 10]
        },
        row.overview,
        {
          text: "Purpose",
          fontSize: 20,
          margin: [0, 10, 0, 10]
        },
        row.purpose,
        {
          text: "Objective",
          fontSize: 20,
          margin: [0, 10, 0, 10]
        },
        row.objective,
        {
          text: "Guidlines",
          fontSize: 20,
          margin: [0, 10, 0, 10]
        },
        row.guidlines,
      ]
    }
    
    pdfMake.createPdf(docDefinition).open();
  }

  editPolicy(policy: any): void {
    let dialogRef = this.matDialog.open(PolicyFormComponent, {
      data: policy
    })
    console.log(dialogRef)
    dialogRef.afterClosed().subscribe(res => {
      if(res) {
        this.snackBar.open('Policy was updated', 'OK', {duration: 3000})
      }else {
        this.snackBar.open('Policy update was cancelled', 'OK', {duration: 3000})
      }
    })
  }

  deletePolicy(index: number): void {
  let dialogRef =   this.matDialog.open(DeletePopUpComponent)
  console.log(dialogRef)
  dialogRef.afterClosed()
  .subscribe({
      next: (res) => {console.log(res)},
      error: (err) => {console.log(err)},
      complete: () => {}
     })
  //  let updatedPolicies = this.sharedService.getData('local', 'policies').filter((policy: any, indx: number) => index !== indx )
  //  console.log(updatedPolicies)
  //  this.sharedService.storeData('local', 'policies', updatedPolicies)
  //  this.dataSource = this.sharedService.getData('local', 'policies')
  }
}

