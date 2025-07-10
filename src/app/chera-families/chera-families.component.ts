import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CheraFamiliesService } from '../services/chera-families.service';
import { CheraFamilies } from '../person.model';

@Component({
  selector: 'app-chera-families',
  imports: [CommonModule, HeaderComponent],
  templateUrl: './chera-families.component.html',
  styleUrl: './chera-families.component.css'
})
export class CheraFamiliesComponent {
  constructor(private router: Router, private cheraFamiliesService: CheraFamiliesService) {}

  loading = false;
  error = '';  

  cheraFamilies: CheraFamilies[] | null = null;

  ngOnInit() {
    this.loading = true;
    this.error = '';
    this.cheraFamiliesService.getCheraFamilies().subscribe({
      next: (families) => {
        this.cheraFamilies = families;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al obtener las familias de chera';
        this.loading = false;
        console.log(err)
      }
    })
  }

  viewFamilyDetails(familyId: number) {
    this.router.navigate(['/chera', familyId]);
  }

}
