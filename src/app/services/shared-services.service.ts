import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ApiServicesService } from '../api-service/api-services.service';

@Injectable({
  providedIn: 'root'
})
export class SharedServicesService {
  data: any;
  user: any;
  employees: any;
  users: any[] = [];
  newUsers: any[] = []


  // this is todoList that stores the any list 
  private policy = new BehaviorSubject<any[]>([]);
  // this is my observable object, where all components can see the products flow
  policy$ = this.policy.asObservable();

  constructor(private api: ApiServicesService) {
    this.refreshPolicies()
  
  }


  refreshPolicies(): void {
    this.policy.next(this.getData('local', 'policies'))
  }

  getData(storage: any, key: any): any {
    if (key === 'users' && storage === 'local') {
      this.data = localStorage.getItem(key)
      this.data = this.data ? JSON.parse(this.data) : []
      return this.data
    } else if (key === 'employees' && storage === 'local') {
      this.data = localStorage.getItem('employees')
      this.data = this.data ? JSON.parse(this.data) : []
      return this.data
    } else if (key === 'leaves' && storage === 'local') {
      this.data = localStorage.getItem(key)
      this.data = this.data ? JSON.parse(this.data) : []
      return this.data
    } else if (key === 'user' && storage === 'session') {
      this.data = sessionStorage.getItem(key)
      this.data = this.data ? JSON.parse(this.data) : []
      return this.data
    } else if (key === 'visas' && storage === 'local') {
      this.data = localStorage.getItem(key)
      this.data = this.data ? JSON.parse(this.data) : []
      return this.data
    } else if (key === 'travels' && storage === 'local') {
      this.data = localStorage.getItem(key)
      this.data = this.data ? JSON.parse(this.data) : []
      return this.data
    } else if (key === 'transport' && storage === 'local') {
      this.data = localStorage.getItem(key)
      this.data = this.data ? JSON.parse(this.data) : []
      return this.data
    } else if (key === 'guesthouse' && storage === 'local') {
      this.data = localStorage.getItem(key)
      this.data = this.data ? JSON.parse(this.data) : []
      return this.data
    } else if (key === 'policies' && storage === 'local') {
      this.data = localStorage.getItem(key)
      this.data = this.data ? JSON.parse(this.data) : []
      return this.data
    } else if (key === 'messages' && storage === 'local') {
      this.data = localStorage.getItem(key)
      this.data = this.data ? JSON.parse(this.data) : []
      return this.data
    }
  }

  storeData(storage: any, key: any, value: any): any {
    if (key === 'user' && storage === 'session') {
      sessionStorage.setItem('user', JSON.stringify(value))
    } else if (key === 'users' && storage === 'local') {
      localStorage.setItem('users', JSON.stringify(value))
    } else if (key === 'employees' && storage === 'local') {
      localStorage.setItem('employees', JSON.stringify(value))
    } else if (key === 'leaves' && storage === 'local') {
      localStorage.setItem('leaves', JSON.stringify(value))
    } else if (key === 'visas' && storage === 'local') {
      localStorage.setItem('visas', JSON.stringify(value))
    } else if (key === 'travels' && storage === 'local') {
      localStorage.setItem('travels', JSON.stringify(value))
    } else if (key === 'transport' && storage === 'local') {
      localStorage.setItem('transport', JSON.stringify(value))
    } else if (key === 'guesthouse' && storage === 'local') {
      localStorage.setItem('guesthouse', JSON.stringify(value))
    } else if (key === 'policies' && storage === 'local') {
      localStorage.setItem('policies', JSON.stringify(value))
    } else if (key === 'messages' && storage === 'local') {
      localStorage.setItem('messages', JSON.stringify(value))
    }
  }

  generatePwd(): any {
    let chars = 'Z*a&9Sx^Dc%V6$fG#b@7N3h!Jm~4Kl`Op/Iu?Y.tR;e2Wq:zAx]Sx[Cd|F\vB-F0g5Hj8MnkL1+'
    let pwd = ''
    for (let i = 0; i < 8; i++) {
      pwd += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return pwd
  }

  storeNewUsers(employees: any): void {

    this.api.genericGetAPI('/get-users')
      .subscribe({
        next: (res: any) => { this.getNewUser(res, employees) },
        error: () => { },
        complete: () => { }
      })

    console.log("Users: ", this.users)
    console.log(" New users: ", this.newUsers[0])

    console.log("Employees from the spreasSheet", employees)

  }

  getNewUser(users: any, employees: any): void {
    let doesUserExist: boolean;
    employees.forEach((employee: any, indx: number) => {
      doesUserExist = false;
      users.forEach((user: any, indx: number) => {
        if (employee.Email === user.email) {
          console.log('Found User:', user)
          doesUserExist = true;
        }
      })
      if (!doesUserExist) {
        this.newUsers.push({
          firstName: employee.Name,
          lastName: employee.Surname,
          email: employee.Email,
          department: employee.Department,
          occupation: employee.Occupation,
          role: employee.Department.toLowerCase() == 'hr' ? 'admin' :
            employee.Department.toLowerCase() == 'operations' ? 'operations personnel' :
              employee.Occupation.toLowerCase() == 'manager' ? 'manager' : 'employee',
          password: this.generatePwd(),
          status: 'active'
        })
      }
    })

    this.newUsers.forEach((user: any, indx: number) => {
      this.api.genericPostAPI('/add-user', user)
        .subscribe({
          next: (res) => { console.log(res) },
          error: (err) => { console.log(err) },
          complete: () => { }
        })
    })
  }

 

}

