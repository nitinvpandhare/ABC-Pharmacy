// sales.component.ts
// The "New Sale" page — staff pick a medicine, enter qty and customer,
// and submit. The API deducts stock and saves the receipt.

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MedicineService } from '../../services/medicine.service';
import { SaleService } from '../../services/sale.service';
import { StaffService } from '../../services/staff.service';
import { ToastService } from '../../services/toast.service';
import { Medicine, SaleForm } from '../../models/models';

@Component({
  selector: 'app-sales',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.scss']
})
export class SalesComponent implements OnInit {

  medicines: Medicine[] = [];

  // Form fields
  selectedMedicineId = '';
  quantity = 1;
  customerName = '';

  successMsg = '';
  errorMsg = '';
  loading = false;

  constructor(
    private medicineService: MedicineService,
    private saleService: SaleService,
    private staffService: StaffService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.medicineService.getAll().subscribe({
      next: data => this.medicines = data,
      error: () => this.toast.show('Could not load medicines.', 'error')
    });
  }

  // Current staff name for "Processed By" display
  get staffName(): string {
    return this.staffService.currentStaff.name;
  }

  // Find selected medicine object for price/stock display
  get selectedMedicine(): Medicine | undefined {
    return this.medicines.find(m => m.id === this.selectedMedicineId);
  }

  // Calculate total bill dynamically
  get totalAmount(): number {
    return (this.selectedMedicine?.price ?? 0) * (this.quantity || 0);
  }

  submitSale(): void {
    this.successMsg = '';
    this.errorMsg = '';

    if (!this.selectedMedicineId) { this.errorMsg = 'Please select a medicine.'; return; }
    if (!this.quantity || this.quantity < 1) { this.errorMsg = 'Please enter a valid quantity.'; return; }

    this.loading = true;
    const payload: SaleForm = {
      medicineId:   this.selectedMedicineId,
      quantitySold: this.quantity,
      customerName: this.customerName.trim(),
      processedBy:  this.staffService.currentStaff.name
    };

    this.saleService.create(payload).subscribe({
      next: (sale) => {
        this.successMsg = `✓ Sale recorded! Bill total: ₹ ${sale.totalAmount.toFixed(2)}. Stock has been updated.`;
        // Reset form for next customer
        this.selectedMedicineId = '';
        this.quantity = 1;
        this.customerName = '';
        this.loading = false;
        // Reload medicines to reflect new stock
        this.medicineService.getAll().subscribe(data => this.medicines = data);
      },
      error: (err) => {
        this.errorMsg = err?.error?.message || 'Sale could not be completed. Please check stock.';
        this.loading = false;
      }
    });
  }
}
