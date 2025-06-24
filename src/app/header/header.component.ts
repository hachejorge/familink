import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { AuthService } from '../services/auth.service';


@Component({
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  @Output() backToHome = new EventEmitter<void>();

  username = '';
  showOptionsPanel = false;

  constructor(public auth: AuthService) {}


  ngOnInit() {
    this.username = this.auth.getUserName() ?? '';
    console.log("Usuario = " + this.username)
  }

  onBackToHome() {
    this.backToHome.emit();
  }

  logOut() {
    this.auth.logout();
    // Quiero redirigir al login
  }
}
