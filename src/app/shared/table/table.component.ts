import { AfterViewInit, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table'
import { SharedServicesService } from 'src/app/services/shared-services.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements AfterViewInit {
  @Input() displayedColumns: any;
  @Input() dataSource = new MatTableDataSource;
  @Input() columnNames: any;
  @Output() sendStatus = new EventEmitter<any>()
  loggedInUser: any;
  statuses: any

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private sharedService: SharedServicesService) {
    this.loggedInUser = sharedService.getData('session', 'user')
    this.statuses = [
      {value: 'Approved', displayVal: 'Approve'},
      {value: 'Declined', displayVal: 'Decline'}
    ]

    console.log('this.loggedInUser: ', this.loggedInUser)
  }

  ngAfterViewInit() {

    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }, 1000)

    console.log("dataSource: ", this.dataSource)

  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  pageEvent(event: any) {
    console.log("EVENT: ", event)
    console.log("DATA SOURCE: ", this.dataSource)
  }

  actionStatusUpdate(status: any, item: any) {
    let _status = {'status': status, 'item': item}
    this.sendStatus?.emit(_status)
    console.log("_status: ", _status)
  }

}
