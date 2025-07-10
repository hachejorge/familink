import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';


@Component({
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  username = '';
  showOptionsPanel = false;

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit() {
    this.username = this.auth.getUserName() ?? '';
    console.log("Usuario = " + this.username)
  }

  goToHome() {
    this.router.navigate(["/"]);
  }

  goToBirthDates() {
    this.router.navigate(["/birthdates"])
  }

  goToChera() {
    this.router.navigate(["/chera"])
  }

  logOut() {
    this.auth.logout();
    // Quiero redirigir al login
  }
}
