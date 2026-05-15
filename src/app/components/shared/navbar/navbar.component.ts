// navbar.component.ts
// The top navigation bar. Shows the pharmacy name, nav links,
// and the "who's on shift" bar at the very top.

// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { RouterModule } from '@angular/router';
// import { StaffService } from '../../../services/staff.service';
// import { Staff } from '../../../models/models';

// @Component({
//   selector: 'app-navbar',
//   standalone: true,
//   imports: [CommonModule, RouterModule],
//   templateUrl: './navbar.component.html',
//   styleUrls: ['./navbar.component.scss']
// })
// export class NavbarComponent implements OnInit {

//   currentStaff!: Staff;
//   mobileMenuOpen = false;
//   staffPickerOpen = false;

//   constructor(public staffService: StaffService) {}

//   ngOnInit(): void {
//     // Subscribe to shift changes so the bar updates instantly
//     this.staffService.currentStaff$.subscribe(staff => {
//       this.currentStaff = staff;
//     });
//   }

//   toggleMobileMenu(): void {
//     this.mobileMenuOpen = !this.mobileMenuOpen;
//   }

//   closeMenu(): void {
//     this.mobileMenuOpen = false;
//   }

//   openStaffPicker(): void {
//     this.staffPickerOpen = true;
//   }

//   closeStaffPicker(): void {
//     this.staffPickerOpen = false;
//   }

//   switchStaff(staffId: string): void {
//     this.staffService.switchStaff(staffId);
//     this.staffPickerOpen = false;
//   }
// }
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StaffService } from '../../../services/staff.service';
import { Staff } from '../../../models/models';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  currentStaff: Staff = this.staffService.currentStaff;
  mobileMenuOpen = false;
  staffPickerOpen = false;

  constructor(public staffService: StaffService) {}

  ngOnInit(): void {
    this.staffService.currentStaff$.subscribe(staff => {
      this.currentStaff = staff;
    });
  }

  toggleMobileMenu(): void { this.mobileMenuOpen = !this.mobileMenuOpen; }
  closeMenu(): void         { this.mobileMenuOpen = false; }
  openStaffPicker(): void   { this.staffPickerOpen = true; }
  closeStaffPicker(): void  { this.staffPickerOpen = false; }

  switchStaff(staffId: string): void {
    this.staffService.switchStaff(staffId);
    this.staffPickerOpen = false;
  }
}