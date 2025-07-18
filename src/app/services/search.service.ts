import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Person } from '../person.model';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SearchService {
  readonly apiURL = "https://familink-back.onrender.com/";

  constructor(private http: HttpClient) {}

  getPeopleByString(string: string): Observable<Person[]> {
    if (!string || string.trim() === '') {
      return of([]); // <--- Observable vacío, no un array directo
    }
    return this.http.get<Person[]>(`${this.apiURL}search/${string}`);
  }
}
