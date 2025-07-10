import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CheraFamilies } from '../person.model';

@Injectable({ providedIn: 'root' })
export class CheraFamiliesService {

  constructor(private http: HttpClient) {}

  readonly apiURL = "https://familink-back.onrender.com/";

  getCheraFamilies() {
    let families = this.http.get<CheraFamilies[]>(`${this.apiURL}cheraFamilies`);
    console.log(families)
    return families;
  }

}
