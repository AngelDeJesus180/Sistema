import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Camiseta } from './catalog.service';

export interface CartItem {
  camiseta: Camiseta;
  cantidad: number;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private items: CartItem[] = [];
  private cartSubject = new BehaviorSubject<CartItem[]>([]);
  cart$ = this.cartSubject.asObservable();

  getItems(): CartItem[] { return this.items; }

  getCount(): number { return this.items.reduce((s, i) => s + i.cantidad, 0); }

  getTotal(): number { return this.items.reduce((s, i) => s + i.camiseta.precio * i.cantidad, 0); }

  add(camiseta: Camiseta, cantidad: number = 1): void {
    const existing = this.items.find(i => i.camiseta.id === camiseta.id);
    const maxStock = camiseta.stock ?? 0;
    if (existing) {
      const newQty = existing.cantidad + cantidad;
      existing.cantidad = Math.min(newQty, maxStock);
    } else {
      this.items.push({ camiseta, cantidad: Math.min(cantidad, maxStock) });
    }
    this.cartSubject.next([...this.items]);
  }

  remove(camisetaId: number): void {
    this.items = this.items.filter(i => i.camiseta.id !== camisetaId);
    this.cartSubject.next([...this.items]);
  }

  updateQty(camisetaId: number, cantidad: number): void {
    const item = this.items.find(i => i.camiseta.id === camisetaId);
    if (!item) return;
    if (cantidad <= 0) { this.remove(camisetaId); return; }
    item.cantidad = Math.min(cantidad, item.camiseta.stock ?? 999);
    this.cartSubject.next([...this.items]);
  }

  clear(): void {
    this.items = [];
    this.cartSubject.next([]);
  }
}
