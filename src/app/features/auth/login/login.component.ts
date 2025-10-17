import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username = '';
  password = '';
  error = '';

  loginInProgress = false;
  showPassword = false;

  constructor(private auth: AuthService, private router: Router) {}

  login() {
    this.loginInProgress = true;
    this.auth.login(this.username, this.password).subscribe({
      next: (res) => {
        this.auth.setToken(res.token);
        this.loginInProgress = false;
        this.router.navigate(['/']);
      },
      error: () => {
        this.loginInProgress = false;
        this.error = 'Credenciales incorrectas o error en el servidor';
      }
    });
  }
}