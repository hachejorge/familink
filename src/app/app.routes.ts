import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { BirthCalendarComponent } from './birth-calendar/birth-calendar.component';
import { AuthGuard } from './services/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', component: HomeComponent, canActivate: [AuthGuard] }, // <--- ahora HomeComponent
  { path: 'birthdates', component: BirthCalendarComponent, canActivate: [AuthGuard]},
  { path: '**', redirectTo: 'login' }
];
