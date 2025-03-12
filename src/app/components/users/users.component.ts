import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ApiServicesService } from 'src/app/api-service/api-services.service';
import { SharedServicesService } from 'src/app/services/shared-services.service';
import * as XLSX from 'xlsx'


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements AfterViewInit {
  ExcelData: any;
  displayedColumns: string[] = ['email', 'name', 'surname', 'department', 'role', 'action'];
  dataSource: MatTableDataSource<any>;
  disabledDataSource: any[] = [];
  enableDataSource: any[] = []
  users: any;
  employees: any;
  statuses: any = ['active', 'disable']
  disabledUsers: any = [];
  enabledUsers: any = []


  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private sharedService: SharedServicesService, private api: ApiServicesService) {
    this.getUsers()
    this.dataSource = new MatTableDataSource(this.users)
    console.log(this.users)
  }

  ngAfterViewInit() {

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getUsers(): void {
    this.api.genericGetAPI('/get-users')
      .subscribe({
        next: (res) => {
          this.users = res
          console.log('Inside the next: ', this.users)
          this.showUsers(res)
          this.moveUsers(res)
        },
        error: () => { },
        complete: () => { }
      })
  }

  showUsers(users: any): void {
    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource(users?.filter((user: any) => {
      if (user.email !== 'admin@opsystem.co') {
        return user
      }
    }))
    console.log(this.dataSource)
    this.moveUsers(users)

    console.log('Users:', this.users)
  }

  moveUsers(users: any): void {
    this.disabledUsers = []
    this.enabledUsers = []
    users.forEach((user: any) => {
      if (user.status === 'disable' && user.email !== 'admin@opsystem.co') {
        this.disabledUsers.push(user)
      }
    })
    this.disabledDataSource = this.disabledUsers

    users.forEach((user: any) => {
      if (user.status === 'active' && user.email !== 'admin@opsystem.co') {
        this.enabledUsers.push(user)
      }
    })
    this.enableDataSource = this.enabledUsers
  }

  onFileChange(event: any): void {
    let file = event.target.files[0];
    let fileReader = new FileReader();
    // fileReader.readAsBinaryString(file)
    fileReader.readAsArrayBuffer(file);
    fileReader.onload = (e: any) => {
      let workBook = XLSX.read(fileReader.result, { type: 'binary' });
      let sheetNames = workBook.SheetNames;
      this.ExcelData = XLSX.utils.sheet_to_json(workBook.Sheets[sheetNames[0]])
      console.log(this.ExcelData)

      this.api.genericGetAPI('/get-users')
        .subscribe({
          next: (res) => {
            this.users = res
            this.checkUser(this.users)
          },
          error: (err) => { console.log(err) },
          complete: () => { }
        })
      setTimeout(() => {
        this.dataSource = new MatTableDataSource(this.users.filter((user: any) => {
          if (user.email !== 'admin@opsystem.co') {
            return user
          }
        }))
      }, 5000)

    };

    // fileReader.readAsArrayBuffer(file);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  updateUserStatus(status: string, user: any): void {
    console.log(status)
    this.users?.forEach((_user: any) => {
      if (user.email === _user.email) {
        _user['status'] = status
        this.api.genericUpdateAPI('/update-user', _user)
          .subscribe({
            next: (res) => { this.getUsers() },
            error: (err) => { console.log(err) },
            complete: () => { }
          })
      }
    })
  }

  checkUser(users: any) {
    let newUsers: any = [];
    this.ExcelData.forEach((user: any) => {
      let doesUserExist = false
      let newUser;
      users.forEach((_user: any) => {
        newUser = _user
        if (user.email == _user.email) {
          doesUserExist = true
        }
      })
      if(!doesUserExist) {
        newUsers.push(newUser)
      }
    })
    
    this.sharedService.storeNewUsers(newUsers)
    console.log("newUsers: ", newUsers)
  }
}