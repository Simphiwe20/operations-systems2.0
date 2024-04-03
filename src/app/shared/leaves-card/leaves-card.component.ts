import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-leaves-card',
  templateUrl: './leaves-card.component.html',
  styleUrls: ['./leaves-card.component.scss']
})

export class LeavesCardComponent {

  @Input() user: any;
  leaveDays: any = [{ days: 36, leaveType: 'Annual Leave'}, {days: 21, leaveType: 'Sick Leave'}, {days: 4, leaveType: 'Family Responsibility Leave'}, {days:  6, leaveType: 'Maternity Leave' }]

}
