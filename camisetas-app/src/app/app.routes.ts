import { Routes } from '@angular/router';
import { authGuard } from './shared/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./auth/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'catalog',
    loadComponent: () => import('./catalog/catalog.component').then(m => m.CatalogComponent),
    canActivate: [authGuard]
  },
  {
    path: 'cart',
    loadComponent: () => import('./cart/cart.component').then(m => m.CartComponent),
    canActivate: [authGuard]
  },
  {
    path: 'my-orders',
    loadComponent: () => import('./my-orders/my-orders.component').then(m => m.MyOrdersComponent),
    canActivate: [authGuard]
  },
  {
    path: 'admin-orders',
    loadComponent: () => import('./admin-orders/admin-orders.component').then(m => m.AdminOrdersComponent),
    canActivate: [authGuard]
  },
  {
    path: 'order',
    loadComponent: () => import('./orders/order.component').then(m => m.OrderComponent),
    canActivate: [authGuard]
  },
  { path: '**', redirectTo: '/login' }
];
