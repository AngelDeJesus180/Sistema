import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CatalogService, Camiseta } from '../shared/services/catalog.service';
import { AuthService } from '../shared/services/auth.service';
import { CartService } from '../shared/services/cart.service';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.scss'
})
export class CatalogComponent implements OnInit {
  camisetas: Camiseta[] = [];
  loading = true;
  error = '';
  username = '';
  isAdmin = false;

  showModal = false;
  editingId: number | null = null;
  modalForm: FormGroup;
  modalLoading = false;
  modalError = '';

  inlineEdit: { [id: number]: { stock: number; precio: number } } = {};
  savingInline: { [id: number]: boolean } = {};

  cartCount = 0;
  toast = '';
  toastType: 'success' | 'error' = 'success';

  tallas = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  tiposManga = ['Corta', 'Larga', 'Sin manga'];

  constructor(
    private catalogService: CatalogService,
    private authService: AuthService,
    private cartService: CartService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.modalForm = this.fb.group({
      talla: ['M', Validators.required],
      color: ['', Validators.required],
      tipoManga: ['Corta', Validators.required],
      precio: [0, [Validators.required, Validators.min(0.01)]],
      stock: [0, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    this.username = this.authService.getUsername() || 'Usuario';
    this.isAdmin = this.authService.isAdmin();
    this.loadCatalog();
    this.cartService.cart$.subscribe(() => {
      this.cartCount = this.cartService.getCount();
    });
  }

  loadCatalog(): void {
    this.loading = true;
    this.catalogService.getCamisetas().subscribe({
      next: (data) => {
        this.camisetas = data;
        this.loading = false;
        data.forEach(c => {
          if (c.id) this.inlineEdit[c.id] = { stock: c.stock ?? 0, precio: c.precio };
        });
      },
      error: () => { this.error = 'Error al cargar el catálogo'; this.loading = false; }
    });
  }

  isLarga(cam: Camiseta): boolean { return (cam.tipoManga || '').toLowerCase().includes('larga'); }
  isSinManga(cam: Camiseta): boolean { return (cam.tipoManga || '').toLowerCase().includes('sin'); }
  isCorta(cam: Camiseta): boolean { return !this.isLarga(cam) && !this.isSinManga(cam); }

  addToCart(cam: Camiseta, event: Event): void {
    event.stopPropagation();
    if ((cam.stock ?? 0) === 0) return;
    this.cartService.add(cam, 1);
    this.showToast(`${cam.color} agregada al carrito`, 'success');
  }

  goToCart(): void { this.router.navigate(['/cart']); }
  goToMyOrders(): void { this.router.navigate(['/my-orders']); }
  goToAdminOrders(): void { this.router.navigate(['/admin-orders']); }

  saveInline(cam: Camiseta, event: Event): void {
    event.stopPropagation();
    if (!cam.id) return;
    this.savingInline[cam.id] = true;
    const updated = { ...cam, stock: this.inlineEdit[cam.id].stock, precio: this.inlineEdit[cam.id].precio };
    this.catalogService.updateCamiseta(cam.id, updated).subscribe({
      next: () => {
        this.savingInline[cam.id!] = false;
        cam.stock = updated.stock;
        cam.precio = updated.precio;
        this.showToast('Guardado', 'success');
      },
      error: () => { this.savingInline[cam.id!] = false; this.showToast('Error al guardar', 'error'); }
    });
  }

  openCreate(): void {
    this.editingId = null;
    this.modalForm.reset({ talla: 'M', tipoManga: 'Corta', precio: 0, stock: 0 });
    this.modalError = '';
    this.showModal = true;
  }

  openEdit(cam: Camiseta, event: Event): void {
    event.stopPropagation();
    this.editingId = cam.id || null;
    this.modalForm.setValue({ talla: cam.talla, color: cam.color, tipoManga: cam.tipoManga, precio: cam.precio, stock: cam.stock ?? 0 });
    this.modalError = '';
    this.showModal = true;
  }

  deleteCamiseta(cam: Camiseta, event: Event): void {
    event.stopPropagation();
    if (!confirm(`¿Eliminar ${cam.color} talla ${cam.talla}?`)) return;
    this.catalogService.deleteCamiseta(cam.id!).subscribe({
      next: () => { this.showToast('Eliminada', 'success'); this.loadCatalog(); },
      error: () => this.showToast('Error al eliminar', 'error')
    });
  }

  saveModal(): void {
    if (this.modalForm.invalid || this.modalLoading) return;
    this.modalLoading = true;
    this.modalError = '';
    const data = this.modalForm.value;
    const op = this.editingId
      ? this.catalogService.updateCamiseta(this.editingId, data)
      : this.catalogService.createCamiseta(data);
    op.subscribe({
      next: () => { this.modalLoading = false; this.showModal = false; this.showToast(this.editingId ? 'Actualizada' : 'Creada', 'success'); this.loadCatalog(); },
      error: () => { this.modalLoading = false; this.modalError = 'Error al guardar'; }
    });
  }

  closeModal(): void { this.showModal = false; }

  showToast(msg: string, type: 'success' | 'error'): void {
    this.toast = msg; this.toastType = type;
    setTimeout(() => this.toast = '', 2500);
  }

  logout(): void { this.authService.logout(); }

  getTallaColor(talla: string): string {
    const colors: Record<string, string> = { S: '#4488ff', M: '#44cc88', L: '#ffaa44', XL: '#ff6644', XXL: '#cc44ff', XS: '#44ccff' };
    return colors[talla] || '#888';
  }

  getCssColor(colorName: string): string {
    const map: Record<string, string> = {
      rojo: '#e53935', roja: '#e53935',
      azul: '#1e88e5', celeste: '#29b6f6',
      verde: '#43a047', verde_militar: '#558b2f',
      negro: '#212121', negra: '#212121',
      blanco: '#f5f5f5', blanca: '#f5f5f5',
      gris: '#757575', gris_claro: '#bdbdbd',
      amarillo: '#fdd835', amarilla: '#fdd835',
      naranja: '#fb8c00',
      morado: '#8e24aa', lila: '#ab47bc',
      rosado: '#e91e8c', rosa: '#f06292',
      cafe: '#6d4c41', marron: '#6d4c41',
      turquesa: '#26c6da', beige: '#d7ccc8',
      vino: '#880e4f', burdeos: '#880e4f',
    };
    const key = (colorName || '').toLowerCase().trim();
    for (const [k, v] of Object.entries(map)) {
      if (key.includes(k.replace('_', ' ').replace('_', ''))) return v;
    }
    return '#607d8b';
  }

  getDarkColor(colorName: string): string {
    return this.darken(this.getCssColor(colorName));
  }

  private darken(hex: string): string {
    try {
      const num = parseInt(hex.replace('#', ''), 16);
      const r = Math.max(0, (num >> 16) - 50);
      const g = Math.max(0, ((num >> 8) & 0xff) - 50);
      const b = Math.max(0, (num & 0xff) - 50);
      return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
    } catch { return '#333'; }
  }
}
