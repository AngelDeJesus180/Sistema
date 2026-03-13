import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { OrderService, OrderResponse } from '../shared/services/order.service';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-orders.component.html',
  styleUrl: './admin-orders.component.scss'
})
export class AdminOrdersComponent implements OnInit {
  orders: OrderResponse[] = [];
  filtered: OrderResponse[] = [];
  loading = true;
  error = '';
  cancellingId: number | null = null;
  toast = '';
  toastType: 'success' | 'error' = 'success';
  filterStatus = 'TODOS';
  filterUser = '';

  constructor(
    private orderService: OrderService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.authService.isAdmin()) { this.router.navigate(['/catalog']); return; }
    this.load();
  }

  load(): void {
    this.loading = true;
    this.orderService.getAllOrders().subscribe({
      next: (data) => { this.orders = data; this.applyFilter(); this.loading = false; },
      error: () => { this.error = 'Error al cargar pedidos'; this.loading = false; }
    });
  }

  applyFilter(): void {
    this.filtered = this.orders.filter(o => {
      const matchStatus = this.filterStatus === 'TODOS' || o.status?.toUpperCase() === this.filterStatus;
      const matchUser = !this.filterUser || o.username?.toLowerCase().includes(this.filterUser.toLowerCase());
      return matchStatus && matchUser;
    });
  }

  cancel(order: OrderResponse): void {
    if (!order.id || this.cancellingId) return;
    if (!confirm(`¿Cancelar pedido #${order.id} de ${order.username}?`)) return;
    this.cancellingId = order.id;
    this.orderService.cancelOrder(order.id).subscribe({
      next: () => { this.cancellingId = null; this.showToast('Pedido cancelado', 'success'); this.load(); },
      error: () => { this.cancellingId = null; this.showToast('Error al cancelar', 'error'); }
    });
  }

  canCancel(order: OrderResponse): boolean {
    return order.status?.toUpperCase() !== 'CANCELLED' && order.status?.toUpperCase() !== 'CANCELADO';
  }

  showToast(msg: string, type: 'success' | 'error'): void {
    this.toast = msg; this.toastType = type;
    setTimeout(() => this.toast = '', 2500);
  }

  getStatusClass(status: string): string {
    switch (status?.toUpperCase()) {
      case 'PENDIENTE': return 'status-pending';
      case 'CANCELLED': case 'CANCELADO': return 'status-cancelled';
      case 'COMPLETADO': return 'status-done';
      default: return 'status-pending';
    }
  }

  get totalPendientes(): number { return this.orders.filter(o => o.status?.toUpperCase() === 'PENDIENTE').length; }
  get totalCancelados(): number { return this.orders.filter(o => o.status?.toUpperCase() === 'CANCELLED' || o.status?.toUpperCase() === 'CANCELADO').length; }

  goBack(): void { this.router.navigate(['/catalog']); }
  logout(): void { this.authService.logout(); }
}
