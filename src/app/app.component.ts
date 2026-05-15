// app.component.ts
// The root component — just holds the navbar and the router outlet.
// All real content lives in the routed components.

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/shared/navbar/navbar.component';
import { ToastService, Toast } from './services/toast.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent],
  template: `
    <app-navbar></app-navbar>
    <main class="main">
      <router-outlet></router-outlet>
    </main>

     <!-- Global toast notification -->
      <div class="toast"
      [class.show]="!!currentToast"
      [class.green]="currentToast !== null && currentToast.type === 'success'"
      [class.red]="currentToast !== null && currentToast.type === 'error'"
      *ngIf="currentToast !== null">
      {{ currentToast.message }}
    </div>
  `,
  styles: []
})
export class AppComponent implements OnInit {

  currentToast: Toast | null = null;

  constructor(private toastService: ToastService) { }

  ngOnInit(): void {
    this.toastService.toast$.subscribe(t => this.currentToast = t);
  }
}
