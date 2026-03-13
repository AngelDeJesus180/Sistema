import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';

export interface OrderRequest {
  productoId: number;
  cantidad: number;
  status: string;
  username: string;
}

export interface OrderResponse {
  id?: number;
  productoId: number;
  cantidad: number;
  status: string;
  username: string;
}

@Injectable({ providedIn: 'root' })
export class OrderService {
  constructor(private http: HttpClient) {}

  createOrder(order: OrderRequest): Observable<OrderResponse> {
    return this.http.post<OrderResponse>('/orders', order);
  }

  createMultipleOrders(orders: OrderRequest[]): Observable<OrderResponse[]> {
    return forkJoin(orders.map(o => this.createOrder(o)));
  }

  getMyOrders(username: string): Observable<OrderResponse[]> {
    return this.http.get<OrderResponse[]>(`/orders/user/${username}`);
  }

  getAllOrders(): Observable<OrderResponse[]> {
    return this.http.get<OrderResponse[]>('/orders');
  }

  cancelOrder(id: number): Observable<any> {
    return this.http.put(`/orders/${id}/cancelar`, {}, { responseType: 'text' });
  }
}
