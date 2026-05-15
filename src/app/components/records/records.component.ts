import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SaleService } from '../../services/sale.service';
import { ToastService } from '../../services/toast.service';
import { SaleRecord } from '../../models/models';

@Component({
  selector: 'app-records',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './records.component.html',
  styleUrls: ['./records.component.scss']
})
export class RecordsComponent implements OnInit {

  records: SaleRecord[] = [];
  loading = true;

  constructor(private saleService: SaleService, private toast: ToastService) {}

  ngOnInit(): void {
    this.loadRecords();
  }

  loadRecords(): void {
    this.loading = true;
    this.saleService.getAll().subscribe({
      next: (data) => {
        // Newest first — that's what counter staff need to see
        this.records = [...data].reverse();
        this.loading = false;
      },
      error: () => {
        this.toast.show('Could not load sale records.', 'error');
        this.loading = false;
      }
    });
  }
}
