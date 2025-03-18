import { AfterViewInit, Component, Input, ViewChild } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table'

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements AfterViewInit {
  @Input() displayedColumns: any;
  @Input() dataSource = new MatTableDataSource;
  @Input() columnNames: any;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    console.log("dataSource: ", this.dataSource)

    this.dataSource.paginator = this.paginator;

  }

  
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}
