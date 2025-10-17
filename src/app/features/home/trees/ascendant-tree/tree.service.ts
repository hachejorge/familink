import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AscendantTree, DescendantTree } from '../../../../person.model';

@Injectable({
  providedIn: 'root'
})
export class TreeService {
  private apiUrl = 'https://familink-back.onrender.com/persons/'

  constructor(private http: HttpClient) {}

  getAscendantTree(personId: number): Observable<AscendantTree> {
    return this.http.get<AscendantTree>(`${this.apiUrl}ascendant-tree/${personId}`);
  }

  getDescendantTree(personId: number): Observable<DescendantTree> {
    return this.http.get<DescendantTree>(`${this.apiUrl}descendant-tree/${personId}`);
  }
}
