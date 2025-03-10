import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DateFilterFn } from '@angular/material/datepicker';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiServicesService } from 'src/app/api-service/api-services.service';
import { SharedServicesService } from 'src/app/services/shared-services.service';

@Component({
  selector: 'app-leave-form',
  templateUrl: './leave-form.component.html',
  styleUrls: ['./leave-form.component.scss']
})
export class LeaveFormComponent {
  leaveTypes: string[] = ['Annual Leave', 'Sick Leave', 'Family Responsibility Leave', 'Maternity leave']
  leaveFormData: any;
  leaveForm: any = {
    appID: '',
    leaveType: '',
    startDate: '',
    endDate: '',
    days: 0,
    status: 'Pending',
  }

  minDate: any = new Date()
  user: any;
  id: any = `${new Date().getFullYear()}${0}${Math.floor((Math.random() * 500) + 100)}`
  appliedBefore: boolean = false

  constructor(private sharedServices: SharedServicesService, private dialogRef: MatDialogRef<LeaveFormComponent>,
    private snackBar: MatSnackBar, private api: ApiServicesService) {
    this.leaveFormData = this.sharedServices.getData('local', 'leaves')
    this.user = this.sharedServices.getData('session', 'user')
    console.log(this.leaveFormData)
  }

  submit(form: NgForm): void {

    if(!form.valid) return

    if (form.valid) {
      console.log(this.leaveForm)
      this.leaveForm['appID'] = `leave-${this.id}`
      this.leaveForm['days'] = 1 + new Date(this.leaveForm['endDate']).getDate() - new Date(this.leaveForm['startDate']).getDate()
      this.leaveForm['employeeName'] = `${this.user.firstName} ${this.user.lastName}`
      this.leaveForm['email'] = `${this.user.email}`
      this.leaveForm['department'] = `${this.user.department}`
      console.log(this.leaveForm)
      this.api.genericPostAPI('/apply-leave', this.leaveForm)
        .subscribe({
          next: (res) => {console.log(res)},
          error: (err) => {console.log(err)},
          complete: () => {}
        })
      this.close('Leave applied sucessfully')
      console.log(this.id)
      let message = `${this.leaveForm.employeeName} submitted ${ this.leaveForm.leaveType.substring(0, 1) === 'A' ? 'an' : 'a' } ${this.leaveForm.leaveType}. This leave application starts on the ${this.leaveForm.startDate.toDateString()} and ends on the ${this.leaveForm.endDate.toDateString()}.`  
      let type = 'Leave Application'
      let notificationID = this.leaveForm.appID
      this.sharedServices.sendNotification(message, type, notificationID)
      // this.decrementLeaveDays()
    }
  }

  close(message: string = ''): void {
    this.dialogRef.close(message)
  }

  myfilter = (d: Date | null): boolean => {
    const day = d?.getDay();
    // Prevent Saturday and Sunday from being selected.
    return day !== 0 && day !== 6;
  }

}

