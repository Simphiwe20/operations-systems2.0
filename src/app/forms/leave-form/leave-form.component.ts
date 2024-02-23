import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DateFilterFn } from '@angular/material/datepicker';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SharedServicesService } from 'src/app/services/shared-services.service';

@Component({
  selector: 'app-leave-form',
  templateUrl: './leave-form.component.html',
  styleUrls: ['./leave-form.component.scss']
})
export class LeaveFormComponent {
  leaveTypes: string[] = ['Annual Leave', 'Sick Leave', 'Family Responsibility Leave']
  leaveFormData: any;
  leaveForm: any = {
    appID: '',
    leaveType: '',
    startDate: '',
    endDate: '',
    days: 1,
    status: 'Submitted',
    sickLeaveDays: 30,
    annualLeaveDays: 21
  }

  minDate: any = new Date()
  user: any;
  id: any = `${new Date().getFullYear()}${0}${Math.floor((Math.random() * 500) + 100)}`
  appliedBefore: boolean = false

  constructor(private sharedServices: SharedServicesService, private dialogRef: MatDialogRef<LeaveFormComponent>,
    private snackBar: MatSnackBar) {
    this.leaveFormData = this.sharedServices.getData('local', 'leaves')
    this.user = this.sharedServices.getData('session', 'user')
    console.log(this.leaveFormData)
  }

  submit(form: NgForm): void {
    if (form.valid) {
      console.log(this.leaveForm)
      this.leaveForm['appID'] = `leave-${this.id}`
      this.leaveForm['days'] = 1 + new Date(this.leaveForm['endDate']).getDate() - new Date(this.leaveForm['startDate']).getDate()
      this.leaveForm['employeeName'] = `${this.user.firstName} ${this.user.lastName}`
      this.leaveForm['email'] = `${this.user.email}`
      this.leaveForm['department'] = `${this.user.department}`
      console.log(this.leaveForm)
      this.leaveFormData.push(this.leaveForm)
      this.sharedServices.storeData('local', 'leaves', this.leaveFormData)
      this.close('Leave applied sucessfully')
      console.log(this.id)
      // this.decrementLeaveDays()
    }
  }

  decrementLeaveDays(): void {
    this.leaveFormData.forEach((leave: any): any => {
      if (leave.email === this.user.email) {
        this.appliedBefore = true
        if (leave.leaveType === "Sick Leave") {
          this.leaveForm.sickLeaveDays = leave.sickLeaveDays - this.leaveForm.days
        } else if (leave.leaveType === "Annual Leave") {
          this.leaveForm.annualLeaveDays = leave.annualLeaveDays - this.leaveForm.days
        }
      }
    })
    console.log(this.leaveForm)
    if (this.leaveForm['leaveType'] === 'Sick Leave' && !this.appliedBefore) {
      this.leaveForm['sickLeaveDays'] = this.leaveForm['sickLeaveDays'] - this.leaveForm.days
    } else if (this.leaveForm['leaveType'] === 'Annual Leave' && !this.appliedBefore) {
      this.leaveForm['annualLeaveDays'] = this.leaveForm['annualLeaveDays'] - this.leaveForm.days
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

