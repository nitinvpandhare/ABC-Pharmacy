// medicine.model.ts
// Matches the Medicine class in the .NET API exactly

export interface Medicine {
  id: string;
  fullName: string;
  notes: string;
  expiryDate: string;   // ISO date string from API
  quantity: number;
  price: number;
  brand: string;
  createdAt: string;
}

// What we send when creating or editing a medicine (no id/createdAt needed)
export interface MedicineForm {
  fullName: string;
  notes: string;
  expiryDate: string;
  quantity: number;
  price: number;
  brand: string;
}

// sale-record.model.ts
// Matches the SaleRecord class in the .NET API

export interface SaleRecord {
  id: string;
  medicineId: string;
  medicineName: string;
  quantitySold: number;
  pricePerUnit: number;
  totalAmount: number;
  saleDate: string;
  customerName: string;
  processedBy: string;
}

// What we send when recording a new sale
export interface SaleForm {
  medicineId: string;
  quantitySold: number;
  customerName: string;
  processedBy: string;
}

// staff.model.ts
// Staff members who use this system — stored client-side

export interface Staff {
  id: string;
  name: string;
  role: string;
  initials: string;
  color: string;
  phone: string;
  since: string;
}
