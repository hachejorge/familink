import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PersonDetails } from '../person.model';

@Injectable({ providedIn: 'root' })
export class BirthService {

  constructor(private http: HttpClient) {}

  readonly apiURL = "https://familink-back.onrender.com/";

  getBirthDates(familyId: number | null) {
    let birthdates = this.http.get<PersonDetails[]>(`${this.apiURL}persons/birthdates?familyId=${familyId}`);
    console.log(birthdates)
    return birthdates;
  }

}
