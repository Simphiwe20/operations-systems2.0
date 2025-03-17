import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SharedServicesService } from 'src/app/services/shared-services.service';
import { ApiServicesService } from 'src/app/api-service/api-services.service';


@Component({
  selector: 'app-policies',
  templateUrl: './policies.component.html',
  styleUrls: ['./policies.component.scss']
})
export class PoliciesComponent implements AfterViewInit {
  displayedColumns: string[] = ['name', 'uploadedDate', 'action', 'download'];
  dataSource!: MatTableDataSource<any>;
  user: any;
  documentContent!: string;
  policyDocs: any;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  fileContent: any | ArrayBuffer = '';


  constructor( private sharedService: SharedServicesService, private snackBar: MatSnackBar,
    private api: ApiServicesService
  ) {}

  ngOnInit(): void {
    console.log(this.sharedService.getData('local', 'policies'));

    this.user = sessionStorage.getItem('user')
    this.user = this.user ? JSON.parse(this.user) : {}

    if (this.user.role !== 'admin' || this.user.role === 'employee') {
      this.displayedColumns = ['name', 'uploadedDate', 'download']
    }
    
    this.getPolicyDocs()
  }


  readDocument(fileChangeEvent: Event) {
    const file = (fileChangeEvent.target as HTMLInputElement).files![0];
    const formData = new FormData()
    formData.append('file', file)

    // let subscription = 
    this.api.genericPostAPI('/upload', formData)
      .subscribe({
        next: (res: any) => {
          this.snackBar.open(res.message, 'OK')
        },
        error: (err) => { console.log("ERR: ", err) }
      })
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

  viewPolicy() {
    
  }

  editPolicy(policy: any): void {
  }

  deletePolicy(index: number): void {
  }

  getPolicyDocs() {
    this.api.genericGetAPI('/files')
      .subscribe({
        next: (docs: any) => {
          this.dataSource = new MatTableDataSource(docs)
          console.log('this.dataSource: ', this.dataSource)
        },
        error: (err) => {
          console.log("ERROR: ", err)
        }
      })
  }
}

