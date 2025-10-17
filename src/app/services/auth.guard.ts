import { Injectable } from "@angular/core";
import { CanActivate, Router, ActivatedRouteSnapshot } from "@angular/router";
import { AuthService } from "./auth.service";
import { PersonService } from "./person.service";
import { find, firstValueFrom } from "rxjs";

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private auth: AuthService,
    private router: Router,
    private personService: PersonService
  ) {}

  async canActivate(route: ActivatedRouteSnapshot): Promise<boolean> {
    // console.log('🔐 AuthGuard ejecutado para ruta:', route.routeConfig?.path);

    // 1️⃣ Comprobar si el usuario está autenticado
    if (!this.auth.isAuthenticated()) {
      console.warn('🚫 Usuario no autenticado. Redirigiendo a /login');
      this.router.navigate(['/login']);
      return false;
    }

    // 2️⃣ Obtener familyId del usuario loggeado
    const loggedUserFamilyId = this.auth.getFamilyId();
    const personId = route.params['id'];

    // console.log('👤 Usuario loggeado FamilyID:', loggedUserFamilyId);
    // console.log('📄 Ruta personId:', personId);

    // 3️⃣ Si la ruta tiene un :id (por ejemplo /person/:id o /home/:id/:type)
    if (personId) {
      try {
        // Obtener datos de la persona
        const person = await firstValueFrom(this.personService.getPersonDetails(+personId));
        // console.log('📋 Persona obtenida:', person);

        // Si no existe la persona
        if (!person) {
          // console.warn('⚠️ Persona no encontrada');
          this.router.navigate(['/home']);
          return false;
        }

        // 4️⃣ Comprobar que pertenezca a la misma familia
        if (person.familyId !== loggedUserFamilyId) {
          // console.warn('🚫 Acceso denegado: familyId diferente');
          console.warn('🚫 Acceso denegado: la persona buscada pertenece a otra familia');
          this.router.navigate(['/home']);
          return false;
        }

      } catch (error) {
        console.error('❌ Error al obtener detalles de la persona:', error);
        this.router.navigate(['/home']);
        return false;
      }
    }

    // 5️⃣ Si pasa todas las comprobaciones
    // console.log('✅ Acceso permitido');
    return true;
  }
}
