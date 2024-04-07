import { Component, Input } from '@angular/core';
import { SharedServicesService } from 'src/app/services/shared-services.service';

@Component({
  selector: 'app-leaves-card',
  templateUrl: './leaves-card.component.html',
  styleUrls: ['./leaves-card.component.scss']
})

export class LeavesCardComponent {

  @Input() user: any;
  leaveDays: any
  currentUser: any;

  constructor (private shared: SharedServicesService) {
  console.log('User', this.user)
  this.currentUser = this.shared.getData('session', 'user')

  this.leaveDays = [{ days: this.currentUser.leaveDays.annualLeaveDays, leaveType: 'Annual Leave'}, {days: this.currentUser.leaveDays.sickLeaveDays, leaveType: 'Sick Leave'}, {days: this.currentUser.leaveDays.familyResponsibilityLeaveDays, leaveType: 'Family Responsibility Leave'}, {days: this.currentUser.leaveDays.maternityLeaveDays, leaveType: 'Maternity Leave' }]
  }

}
