import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { OrderService } from '../shared/services/order.service';
import { AuthService } from '../shared/services/auth.service';
import { Camiseta } from '../shared/services/catalog.service';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './order.component.html',
  styleUrl: './order.component.scss'
})
export class OrderComponent implements OnInit {
  form: FormGroup;
  camiseta: Camiseta | null = null;
  loading = false;
  success = false;
  error = '';
  orderId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private orderService: OrderService,
    private authService: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      cantidad: [1, [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    const nav = this.router.getCurrentNavigation();
    this.camiseta = nav?.extras?.state?.['camiseta'] || history.state?.camiseta || null;
    if (!this.camiseta) { this.router.navigate(['/catalog']); return; }

    const maxStock = this.camiseta.stock ?? 99;
    this.form.get('cantidad')!.setValidators([
      Validators.required, Validators.min(1), Validators.max(maxStock)
    ]);
    this.form.get('cantidad')!.updateValueAndValidity();
  }

  get cantidad(): number { return this.form.value.cantidad || 1; }
  get total(): number { return (this.camiseta?.precio || 0) * this.cantidad; }
  get maxStock(): number { return this.camiseta?.stock ?? 99; }
  get stockExceeded(): boolean { return this.cantidad > this.maxStock; }

  increment(): void {
    if (this.cantidad >= this.maxStock) return;
    this.form.patchValue({ cantidad: this.cantidad + 1 });
  }

  decrement(): void {
    if (this.cantidad <= 1) return;
    this.form.patchValue({ cantidad: this.cantidad - 1 });
  }

  submit(): void {
    if (!this.camiseta || this.form.invalid || this.loading || this.stockExceeded) return;
    this.loading = true;
    this.error = '';

    const order = {
      productoId: this.camiseta.id!,
      cantidad: this.cantidad,
      status: 'PENDIENTE',
      username: this.authService.getUsername() || ''
    };

    this.orderService.createOrder(order).subscribe({
      next: (res) => { this.success = true; this.loading = false; this.orderId = res.id || null; },
      error: () => { this.loading = false; this.error = 'Error al crear el pedido. Intenta de nuevo.'; }
    });
  }

  goBack(): void { this.router.navigate(['/catalog']); }
}
