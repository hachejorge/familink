import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { SearcherComponent } from '../searcher/searcher.component';
import { PersonService } from '../services/person.service';

@Component({
  selector: 'app-header',
  imports: [CommonModule, SearcherComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  username = '';
  showOptionsPanel = false;
  selectedNav = '';
  showCheraButton = false;

  DEFAULT_IMAGE = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";

  profileImage: string = "";

  constructor(private auth: AuthService, private router: Router, private person: PersonService) {}

  ngOnInit() {
    this.showCheraButton = this.auth.getFamilyId() === 1;

    const currentUrl = this.router.url;

    // Ponemos como imagen de perfil la de la persona root del usuario logueado
    const personId = this.auth.getRootPersonId();
    if (personId) {
      this.person.getPersonDetails(personId).subscribe(person => {
        if (person && person.imageUrl) {
          this.profileImage = person.imageUrl;
        } else {
          this.profileImage = this.DEFAULT_IMAGE;
        }
      });
    }

    if (currentUrl === '/' || currentUrl.startsWith('/home')) {
      this.selectedNav = 'home';
    } else if (currentUrl.startsWith('/birthdates')) {
      this.selectedNav = 'birthdays';
    } else if (currentUrl.startsWith('/chera')) {
      this.selectedNav = 'chera';
    } else {
      this.selectedNav = '';
    }
    this.username = this.auth.getUserName() ?? '';
  }

  goToHome() {
    this.selectedNav = 'home';
    if (this.router.url === "/") {
      window.location.reload();
    } else {
      this.router.navigate(["/"]);
    }
  }

  goToBirthDates() {
    this.selectedNav = 'birthdays';
    this.router.navigate(["/birthdates"])
  }

  goToChera() {
    this.selectedNav = 'chera';
    this.router.navigate(["/chera"])
  }

  logOut() {
    this.auth.logout();
    // Quiero redirigir al login
    this.router.navigate(['/login']);
  }
}
