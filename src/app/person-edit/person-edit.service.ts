import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PersonDetails } from '../person.model';

@Injectable({
  providedIn: 'root'
})
export class PersonEditService {
  private apiUrl = 'https://familink-back.onrender.com/'  // corregí la URL para apuntar a la raíz

  constructor(private http: HttpClient) {}

  uploadFile(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file); // clave debe ser 'file' como en upload.single("file")

    return this.http.post<any>(`${this.apiUrl}upload/multimedia`, formData);
  }

  modifyPerson(person: PersonDetails): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}person/modify`, person);
  }

  createChild(referenceId: string, person: PersonDetails): Observable<any> {
    return this.http.post(`${this.apiUrl}create/children/${referenceId}`, person);
  }

  createSibling(referenceId: string, person: PersonDetails): Observable<any> {
    return this.http.post(`${this.apiUrl}create/sibling/${referenceId}`, person);
  }

  createMother(referenceId: string, person: PersonDetails): Observable<any> {
    return this.http.post(`${this.apiUrl}create/mother/${referenceId}`, person);
  }

  createFather(referenceId: string, person: PersonDetails): Observable<any> {
    return this.http.post(`${this.apiUrl}create/father/${referenceId}`, person);
  }

  createSpouse(referenceId: string, person: PersonDetails): Observable<any> {
    return this.http.post(`${this.apiUrl}create/spouse/${referenceId}`, person);
  }


}
