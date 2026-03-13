import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Camiseta {
  id?: number;
  talla: string;
  color: string;
  tipoManga: string;
  precio: number;
  stock: number;
}

@Injectable({ providedIn: 'root' })
export class CatalogService {
  constructor(private http: HttpClient) {}

  getCamisetas(): Observable<Camiseta[]> {
    return this.http.get<Camiseta[]>('/catalog/camisetas');
  }

  createCamiseta(c: Camiseta): Observable<Camiseta> {
    return this.http.post<Camiseta>('/catalog/camisetas', c);
  }

  updateCamiseta(id: number, c: Camiseta): Observable<Camiseta> {
    return this.http.post<Camiseta>('/catalog/camisetas', { ...c, id });
  }

  deleteCamiseta(id: number): Observable<any> {
    return this.http.delete(`/catalog/camisetas/${id}`);
  }
}
