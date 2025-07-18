import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PersonService {
  readonly apiURL = "https://familink-back.onrender.com/";

  constructor(private http: HttpClient) {}

  getPersonDetails(id: number): Observable<any | null> {
    if (!id) {
      return of(null);
    }
    return this.http.get<any>(`${this.apiURL}persons/person-details/${id}`);
  }
}
