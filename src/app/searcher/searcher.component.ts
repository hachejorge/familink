import { Component } from '@angular/core';
import { SearchService } from '../services/search.service';
import { Person } from '../person.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-searcher',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './searcher.component.html',
  styleUrls: ['./searcher.component.css']
})
export class SearcherComponent {
  searchQuery = '';
  results: Person[] = [];
  isLoading = false;

  constructor(private searchService: SearchService, private router: Router) {}

  onSearchChange() {
    const query = this.searchQuery.trim();
    if (query.length === 0) {
      this.results = [];
      return;
    }

    this.isLoading = true;

    this.searchService.getPeopleByString(query).subscribe({
      next: (people: Person[]) => {
        this.results = people;
        console.log("Resultados de búsqueda:", this.results);
        this.isLoading = false;
      },
      error: () => {
        this.results = [];
        this.isLoading = false;
      }
    });
  }

  trackById(index: number, person: Person) {
    return person.id;
  }

  onPersonSelected(person: Person) {
    this.router.navigate([`/person/${person.id}`]);
  }
}
