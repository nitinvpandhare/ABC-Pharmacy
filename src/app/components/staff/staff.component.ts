import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StaffService } from '../../services/staff.service';
import { ToastService } from '../../services/toast.service';
import { Staff } from '../../models/models';

@Component({
  selector: 'app-staff',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './staff.component.html',
  styleUrls: ['./staff.component.scss']
})
export class StaffComponent {

  currentStaff: Staff = this.staffService.currentStaff;

  constructor(public staffService: StaffService, private toast: ToastService) {
    this.staffService.currentStaff$.subscribe(s => this.currentStaff = s);
  }

  switchTo(staff: Staff): void {
    this.staffService.switchStaff(staff.id);
    this.toast.show(`👋 Shift started — welcome, ${staff.name}!`, 'success');
  }
}