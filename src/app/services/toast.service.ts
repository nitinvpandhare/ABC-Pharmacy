// toast.service.ts
// Simple service to show brief pop-up notifications to staff.
// Any component can inject this and call show() — no need to add
// toast HTML to every component individually.

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Toast {
  message: string;
  type: 'success' | 'error' | 'info';
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  private toastSubject = new BehaviorSubject<Toast | null>(null);
  toast$ = this.toastSubject.asObservable();

  show(message: string, type: 'success' | 'error' | 'info' = 'info'): void {
    this.toastSubject.next({ message, type });
    // Auto-clear after 3 seconds
    setTimeout(() => this.toastSubject.next(null), 3200);
  }
}
