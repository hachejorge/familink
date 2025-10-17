import { Component } from '@angular/core';
import { HeaderComponent } from '../../../shared/header/header.component';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Person, PersonDetails } from '../../../person.model';
import { PersonService } from '../../../services/person.service';
import { PersonDetailsExtendedComponent } from '../person-details-extended/person-details-extended.component';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-person',
  imports: [CommonModule, HeaderComponent, PersonDetailsExtendedComponent],
  templateUrl: './person.component.html',
  styleUrl: './person.component.css'
})
export class PersonComponent {

  constructor(private router: Router, private route: ActivatedRoute, private personService: PersonService, private authService: AuthService) {}

  loading = true;
  error = '';
  showEditFamily = false;
  isAdmin = false;

  personToManage: Person | null = null;

  personDetails: PersonDetails | null = null;
  spouse: PersonDetails | null = null;
  father: PersonDetails | null = null;
  mother: PersonDetails | null = null;

  children: PersonDetails[] = [];
  siblings: PersonDetails[] = [];

  ngOnInit() {
    this.isAdmin = this.authService.isAdmin();

    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));

      if (id) {
        this.personService.getPersonDetails(id).subscribe({
          next: (details) => {
            this.personDetails = details;

            // Relaciones directas
            this.spouse = details.spouse ?? null;
            this.father = details.father ?? null;
            this.mother = details.mother ?? null;

            // Hijos y hermanos
            this.children = details.children ?? [];
            this.siblings = details.siblings ?? [];

            this.loading = false;
          },
          error: (err) => {
            this.error = 'Error al cargar los detalles de la persona';
            console.error(err);
            this.loading = false;
          }
        });
      } else {
        // si no hay parámetros, cargar el árbol por defecto
      }
    });
  }

  formatearFecha(fecha: string | null): string {
    if (!fecha) return 'Desconocido';

    const partes = fecha.split('-'); // Esperado: DD-MM-AAAA
    if (partes.length !== 3) return 'Desconocido';

    const [dia, mes, anio] = partes;
    const meses = [
      'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
      'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ];

    const nombreMes = meses[parseInt(mes, 10) - 1] ?? '';
    return `${anio}, ${dia} ${nombreMes}`;
  }

  onViewAscendants() {
    // Emitir el evento para ver los ascendientes
    this.router.navigate([`/home/${this.personDetails?.id}/ascendant`]);
  }

  onViewDescendants() {
    // Emitir el evento para ver los descendientes
    this.router.navigate([`/home/${this.personDetails?.id}/descendant`]);
  }

  onEditFamily() {
    this.showEditFamily = true;
    this.personToManage = this.personDetails as Person;
  }

  backToPerson() {
    this.showEditFamily = false;
    this.personToManage = null;
    //window.location.reload();
  }

  onClickPerson(person: PersonDetails) {
    // Navegar a la página de detalles de la persona seleccionada
    this.router.navigate([`/person/${person.id}`]);
  }

}
