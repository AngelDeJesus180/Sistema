import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CartService, CartItem } from '../shared/services/cart.service';
import { OrderService } from '../shared/services/order.service';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit {
  items: CartItem[] = [];
  loading = false;
  success = false;
  error = '';
  orderIds: number[] = [];

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cartService.cart$.subscribe(items => this.items = items);
  }

  get total(): number { return this.cartService.getTotal(); }

  increment(item: CartItem): void {
    this.cartService.updateQty(item.camiseta.id!, item.cantidad + 1);
  }

  decrement(item: CartItem): void {
    this.cartService.updateQty(item.camiseta.id!, item.cantidad - 1);
  }

  remove(item: CartItem): void {
    this.cartService.remove(item.camiseta.id!);
  }

  checkout(): void {
    if (this.items.length === 0 || this.loading) return;
    this.loading = true;
    this.error = '';
    const username = this.authService.getUsername() || '';

    const orders = this.items.map(item => ({
      productoId: item.camiseta.id!,
      cantidad: item.cantidad,
      status: 'PENDIENTE',
      username
    }));

    this.orderService.createMultipleOrders(orders).subscribe({
      next: (res) => {
        this.success = true;
        this.loading = false;
        this.orderIds = res.map(r => r.id).filter(Boolean) as number[];
        this.cartService.clear();
      },
      error: () => {
        this.loading = false;
        this.error = 'Error al procesar el pedido. Intenta de nuevo.';
      }
    });
  }

  goBack(): void { this.router.navigate(['/catalog']); }
  goToOrders(): void { this.router.navigate(['/my-orders']); }
}
