import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PersonDetails } from '../person.model';

@Injectable({
  providedIn: 'root'
})
export class PersonDetailsExtendedService {
  private apiUrl = 'https://familink-back.onrender.com/';  // corregí la URL para apuntar a la raíz

  constructor(private http: HttpClient) {}

  getRelatives(id: string) {
    return this.http.get<any>(`${this.apiUrl}relatives/${id}`)
  }

  getDetails(id: string) {
    return this.http.get<PersonDetails>(`${this.apiUrl}persons/person-details/${id}`);
  }

  deletePerson(id: string) {
    return this.http.delete<any>(`${this.apiUrl}person/${id}`);
  }

}
