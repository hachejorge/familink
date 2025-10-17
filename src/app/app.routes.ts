import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { HomeComponent } from './features/home/home/home.component';
import { BirthCalendarComponent } from './features/calendar/birth-calendar/birth-calendar.component';
import { AuthGuard } from './services/auth.guard';
import { CheraFamiliesComponent } from './features/chera/chera-families/chera-families.component';
import { CheraFamilyDetailsComponent } from './features/chera/chera-family-details/chera-family-details.component';
import { PersonComponent } from './features/person/person/person.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'birthdates', component: BirthCalendarComponent, canActivate: [AuthGuard]},
  { path: 'chera', component: CheraFamiliesComponent, canActivate: [AuthGuard]},
  { path: 'chera/:id', component: CheraFamilyDetailsComponent, canActivate: [AuthGuard] }, // restringir a admins?
  { path: 'home/:id/:type', component: HomeComponent, canActivate: [AuthGuard] }, // pedir mas autorización?
  { path: 'person/:id', component: PersonComponent, canActivate: [AuthGuard] }, // pedir mas autorización?
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];
