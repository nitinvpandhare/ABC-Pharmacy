// staff.service.ts
// Manages the list of pharmacy staff and tracks who is currently on shift.
// Staff data is kept client-side (no API needed for this small team).
// Uses a BehaviorSubject so any component can react when the shift changes.

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Staff } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class StaffService {

  // The full team at ABC Pharmacy, Dadar West, Mumbai
  readonly staffList: Staff[] = [
    { id: 'staff-001', name: 'Priya Sharma',  role: 'Head Pharmacist', initials: 'PS', color: '#2d6a4f', phone: '+91 98201 11234', since: '2018' },
    { id: 'staff-002', name: 'Rahul Mehta',   role: 'Pharmacist',      initials: 'RM', color: '#d4a853', phone: '+91 98201 22345', since: '2020' },
    { id: 'staff-003', name: 'Sunita Patil',  role: 'Cashier',         initials: 'SP', color: '#6c5ce7', phone: '+91 98201 33456', since: '2021' },
    { id: 'staff-004', name: 'Arjun Desai',   role: 'Cashier',         initials: 'AD', color: '#e17055', phone: '+91 98201 44567', since: '2022' }
  ];

  // BehaviorSubject lets all components know when the shift changes
  private currentStaffSubject = new BehaviorSubject<Staff>(this.staffList[0]);

  // Public observable — subscribe to this in components
  currentStaff$ = this.currentStaffSubject.asObservable();

  // Quick getter for the current value without subscribing
  get currentStaff(): Staff {
    return this.currentStaffSubject.value;
  }

  // Switch to a different staff member
  switchStaff(staffId: string): void {
    const staff = this.staffList.find(s => s.id === staffId);
    if (staff) {
      this.currentStaffSubject.next(staff);
    }
  }
}
