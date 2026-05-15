import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MedicineService } from '../../services/medicine.service';
import { SaleService } from '../../services/sale.service';
import { StaffService } from '../../services/staff.service';
import { ToastService } from '../../services/toast.service';
import { Medicine, SaleForm } from '../../models/models';

@Component({
  selector: 'app-medicines',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './medicines.component.html',
  styleUrls: ['./medicines.component.scss']
})
export class MedicinesComponent implements OnInit {

  allMedicines: Medicine[] = [];
  filteredMedicines: Medicine[] = [];
  searchQuery = '';

  // Sort state
  sortKey: keyof Medicine = 'fullName';
  sortAsc = true;

  // Stats
  statTotal = 0;
  statExpiring = 0;
  statLowStock = 0;

  // Add/Edit modal
  showModal = false;
  editingId: string | null = null;
  medicineForm!: FormGroup;
  modalError = '';
  modalLoading = false;

  // Quick sell modal
  showSellModal = false;
  sellMedicine: Medicine | null = null;
  sellQty = 1;
  sellCustomer = '';
  sellError = '';
  sellLoading = false;

  constructor(
    private medicineService: MedicineService,
    private saleService: SaleService,
    private staffService: StaffService,
    private toast: ToastService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.loadMedicines();
  }

  // Build the reactive form for add/edit
  buildForm(): void {
    this.medicineForm = this.fb.group({
      fullName:   ['', [Validators.required, Validators.minLength(2)]],
      brand:      ['', Validators.required],
      expiryDate: ['', Validators.required],
      quantity:   [0,  [Validators.required, Validators.min(0)]],
      price:      [0,  [Validators.required, Validators.min(0.01)]],
      notes:      ['']
    });
  }

  loadMedicines(): void {
    this.medicineService.getAll().subscribe({
      next: (data) => {
        this.allMedicines = data;
        this.applyFilter();
      },
      error: () => this.toast.show('Could not load medicines. Is the API running?', 'error')
    });
  }

  // Filter by search term
  applyFilter(): void {
    const q = this.searchQuery.toLowerCase().trim();
    this.filteredMedicines = q
      ? this.allMedicines.filter(m => m.fullName.toLowerCase().includes(q))
      : [...this.allMedicines];
    this.applySort();
    this.updateStats();
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.applyFilter();
  }

  // Sort table by column
  sortBy(key: keyof Medicine): void {
    this.sortAsc = this.sortKey === key ? !this.sortAsc : true;
    this.sortKey = key;
    this.applySort();
  }

  applySort(): void {
    this.filteredMedicines.sort((a, b) => {
      let av: any = a[this.sortKey];
      let bv: any = b[this.sortKey];
      if (this.sortKey === 'expiryDate') { av = new Date(av); bv = new Date(bv); }
      if (typeof av === 'string') av = av.toLowerCase();
      if (typeof bv === 'string') bv = bv.toLowerCase();
      if (av < bv) return this.sortAsc ? -1 : 1;
      if (av > bv) return this.sortAsc ?  1 : -1;
      return 0;
    });
  }

  // Update the 3 stat counters (match the grid table counts)
  updateStats(): void {
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    // Stats should reflect ALL medicines.
    // const source = this.allMedicines;
    const source = this.filteredMedicines;


    this.statTotal = source.length;
    this.statExpiring = source.filter(m => new Date(m.expiryDate) <= thirtyDaysFromNow).length;
    // Same condition used by the table badge: quantity < 10
    this.statLowStock = source.filter(m => Number(m.quantity) < 10).length;
  }

  // Row colour: red if expiring within 30 days, yellow if low stock
  getRowClass(m: Medicine): string {
    const expiry = new Date(m.expiryDate);
    const thirtyDays = new Date();
    thirtyDays.setDate(thirtyDays.getDate() + 30);
    if (expiry <= thirtyDays) return 'row-red';
    if (m.quantity < 10) return 'row-yellow';
    return '';
  }

  // Days until expiry — used for the badge
  daysUntilExpiry(dateStr: string): number {
    const diff = new Date(dateStr).getTime() - new Date().getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  // ─── ADD / EDIT MODAL ──────────────────────────────────────

  openAddModal(): void {
    this.editingId = null;
    this.medicineForm.reset({ quantity: 0, price: 0 });
    this.modalError = '';
    this.showModal = true;
  }

  openEditModal(m: Medicine): void {
    this.editingId = m.id;
    this.medicineForm.patchValue({
      fullName:   m.fullName,
      brand:      m.brand,
      expiryDate: m.expiryDate.split('T')[0],
      quantity:   m.quantity,
      price:      m.price,
      notes:      m.notes
    });
    this.modalError = '';
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  saveMedicine(): void {
    if (this.medicineForm.invalid) {
      this.modalError = 'Please fill in all required fields correctly.';
      return;
    }
    this.modalLoading = true;
    const val = this.medicineForm.value;
    const payload = {
      ...val,
      expiryDate: new Date(val.expiryDate).toISOString()
    };

    const request = this.editingId
      ? this.medicineService.update(this.editingId, payload)
      : this.medicineService.create(payload);

    request.subscribe({
      next: () => {
        this.toast.show(this.editingId ? '✓ Medicine updated!' : '✓ Medicine added!', 'success');
        this.closeModal();
        this.loadMedicines();
        this.modalLoading = false;
      },
      error: () => {
        this.modalError = 'Save failed. Please try again.';
        this.modalLoading = false;
      }
    });
  }

  deleteMedicine(m: Medicine): void {
    if (!confirm(`Delete "${m.fullName}"? This cannot be undone.`)) return;
    this.medicineService.delete(m.id).subscribe({
      next: () => {
        this.toast.show('Medicine removed.', 'error');
        this.loadMedicines();
      },
      error: () => this.toast.show('Delete failed.', 'error')
    });
  }

  // ─── QUICK SELL MODAL ─────────────────────────────────────

  get quickTotal(): number {
    return (this.sellMedicine?.price ?? 0) * (this.sellQty || 0);
  }

  openSellModal(m: Medicine): void {
    this.sellMedicine = m;
    this.sellQty = 1;
    this.sellCustomer = '';
    this.sellError = '';
    this.showSellModal = true;
  }

  closeSellModal(): void {
    this.showSellModal = false;
  }

  confirmSale(): void {
    if (!this.sellMedicine || !this.sellQty || this.sellQty < 1) {
      this.sellError = 'Please enter a valid quantity.';
      return;
    }
    this.sellLoading = true;
    const payload: SaleForm = {
      medicineId:   this.sellMedicine.id,
      quantitySold: this.sellQty,
      customerName: this.sellCustomer,
      processedBy:  this.staffService.currentStaff.name
    };
    this.saleService.create(payload).subscribe({
      next: (sale) => {
        this.toast.show(`✓ Sale recorded — ₹ ${sale.totalAmount.toFixed(2)}`, 'success');
        this.closeSellModal();
        this.loadMedicines();
        this.sellLoading = false;
      },
      error: (err) => {
        this.sellError = err?.error?.message || 'Sale failed. Check stock availability.';
        this.sellLoading = false;
      }
    });
  }
}
