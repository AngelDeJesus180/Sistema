import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { OrderService, OrderResponse } from '../shared/services/order.service';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-my-orders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-orders.component.html',
  styleUrl: './my-orders.component.scss'
})
export class MyOrdersComponent implements OnInit {
  orders: OrderResponse[] = [];
  loading = true;
  error = '';
  cancellingId: number | null = null;
  toast = '';
  toastType: 'success' | 'error' = 'success';
  username = '';

  constructor(
    private orderService: OrderService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.username = this.authService.getUsername() || '';
    this.load();
  }

  load(): void {
    this.loading = true;
    this.orderService.getMyOrders(this.username).subscribe({
      next: (data) => { this.orders = data; this.loading = false; },
      error: () => { this.error = 'Error al cargar pedidos'; this.loading = false; }
    });
  }

  canCancel(order: OrderResponse): boolean {
    return order.status?.toUpperCase() !== 'CANCELLED' &&
      order.status?.toUpperCase() !== 'CANCELADO';
  }

  cancel(order: OrderResponse): void {
    if (!order.id || this.cancellingId) return;
    if (!confirm(`¿Cancelar pedido #${order.id}?`)) return;
    this.cancellingId = order.id;
    this.orderService.cancelOrder(order.id).subscribe({
      next: () => {
        this.cancellingId = null;
        this.showToast('Pedido cancelado', 'success');
        this.load();
      },
      error: () => { this.cancellingId = null; this.showToast('Error al cancelar', 'error'); }
    });
  }

  showToast(msg: string, type: 'success' | 'error'): void {
    this.toast = msg; this.toastType = type;
    setTimeout(() => this.toast = '', 2500);
  }

  getStatusClass(status: string): string {
    switch (status?.toUpperCase()) {
      case 'PENDIENTE': return 'status-pending';
      case 'CANCELLED':
      case 'CANCELADO': return 'status-cancelled';
      case 'COMPLETADO': return 'status-done';
      default: return 'status-pending';
    }
  }

  goBack(): void { this.router.navigate(['/catalog']); }
  logout(): void { this.authService.logout(); }
}
