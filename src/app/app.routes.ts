// app.routes.ts
// Angular 19 standalone routing — no NgModule needed.
// Each route lazy-loads its component for better performance.

import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'medicines', pathMatch: 'full' },
  {
    path: 'medicines',
    loadComponent: () => import('./components/medicines/medicines.component').then(m => m.MedicinesComponent),
    title: 'Medicines — ABC Pharmacy'
  },
  {
    path: 'sales',
    loadComponent: () => import('./components/sales/sales.component').then(m => m.SalesComponent),
    title: 'New Sale — ABC Pharmacy'
  },
  {
    path: 'records',
    loadComponent: () => import('./components/records/records.component').then(m => m.RecordsComponent),
    title: 'Records — ABC Pharmacy'
  },
  {
    path: 'staff',
    loadComponent: () => import('./components/staff/staff.component').then(m => m.StaffComponent),
    title: 'Staff — ABC Pharmacy'
  },
  { path: '**', redirectTo: 'medicines' }
];
