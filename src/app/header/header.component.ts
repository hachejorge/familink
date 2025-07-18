import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { SearcherComponent } from '../searcher/searcher.component';


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

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit() {
    const currentUrl = this.router.url;
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
    console.log("Usuario = " + this.username)
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
  }
}
