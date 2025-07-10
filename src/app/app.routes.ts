import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { BirthCalendarComponent } from './birth-calendar/birth-calendar.component';
import { AuthGuard } from './services/auth.guard';
import { CheraFamiliesComponent } from './chera-families/chera-families.component';
import { CheraFamilyDetailsComponent } from './chera-family-details/chera-family-details.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', component: HomeComponent, canActivate: [AuthGuard] }, // <--- ahora HomeComponent
  { path: 'birthdates', component: BirthCalendarComponent, canActivate: [AuthGuard]},
  { path: 'chera', component: CheraFamiliesComponent, canActivate: [AuthGuard]},
  { path: 'chera/:id', component: CheraFamilyDetailsComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: 'login' }
];
