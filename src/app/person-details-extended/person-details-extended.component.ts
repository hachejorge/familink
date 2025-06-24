import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Person, PersonDetails } from '../person.model';
import { PersonDetailsExtendedService } from './person-details-extended.service';
import { NodeExtendedComponent } from '../node-extended/node-extended.component';
import { CommonModule } from '@angular/common';
import { PersonEditComponent } from '../person-edit/person-edit.component';
import { ActionOfNode, ActionType, NewPerson, RelativeType } from '../options.model';
import { PersonNewComponent } from '../person-new/person-new.component';

@Component({
  selector: 'app-person-details-extended',
  imports: [CommonModule, NodeExtendedComponent, PersonEditComponent, PersonNewComponent],
  standalone: true,
  templateUrl: './person-details-extended.component.html',
  styleUrl: './person-details-extended.component.css'
})
export class PersonDetailsExtendedComponent {
  // ----------------- VARIABLES -----------------

  readonly RelativeType = RelativeType;

  // Person de la que se parte para los familiares 
  @Input() rootPerson!: Person;

  @Output() closePage = new EventEmitter<void>();

  // Variables de control
  loading = true;

  // Editar una nueva persona
  showEditPerson = false;
  personToEdit : PersonDetails | null = null;

  // Crear una nueva persona
  showNewPerson = false;
  personToCreate: NewPerson | null = null;

  // Eliminar una persona
  showDeletePerson = false;
  personToDelete : PersonDetails | null = null;

  // Estructura de datos 
  spouse: Person | null = null;
  father: Person | null = null;
  mother: Person | null = null;
  siblings: Person[] | null = null
  children: Person[] | null = null;

  // Constructor de llamada a la API
  constructor(private personDetailsExtended: PersonDetailsExtendedService ) {}
    
  // ----------------- FUNCIONES -----------------

  ngOnInit() {
    this.loadRelatives();
  }

  loadRelatives() {
    this.loading = true;
    this.personDetailsExtended.getRelatives(String(this.rootPerson.id)).subscribe({
      next: (response) => {
        this.spouse = response.spouse;
        this.father = response.father;
        this.mother = response.mother;
        this.siblings = response.siblings;
        this.children = response.children;
        this.loading = false;
      },
      error: (error) => {
        console.log("Error obteniendo datos de familiares");
        this.loading = false;
      }
    });
  }

  handleAction(action : ActionOfNode) {
    // MODIFICAR ALGUIEN YA EXISTENTE
    if(action.action == ActionType.MODIFY) {
      this.personDetailsExtended.getDetails(action.id.toString()).subscribe({
        next: (response) => {
          this.personToEdit = response;
          this.showEditPerson = true;
        },
        error: (error) => {
          console.log("Error obteniendo detalles para modificar")
        }
      })
    }

    else if(action.action == ActionType.DELETE) {
      this.personDetailsExtended.getDetails(action.id.toString()).subscribe({
        next: (response) => {
          this.personToDelete = response;
          this.showDeletePerson = true;
        },
        error: (error) => {
          console.log("Error obteniendo detalles para modificar")
        }
      })
    }

    else if(action.action == ActionType.NEW) {
      this.personToCreate = {
        relation: action.relative,
        rootPersonId: this.rootPerson.id,
      }
      this.showNewPerson = true;
    }
  }

  closeDeleteModal() {
    this.showDeletePerson = false;
    this.personToDelete = null;
  } 

  deletePerson() {
    this.showDeletePerson = false;
    if (this.personToDelete?.id !== undefined) {
      console.log("eleminando a " + this.personToDelete.firstName);
      this.personDetailsExtended.deletePerson(String(this.personToDelete.id)).subscribe({
        next: () => {
          console.log("Persona eliminada exitosamente");

          // Si la persona a eliminar es la raiz de la pagina se sale
          if (this.rootPerson && this.personToDelete?.id === this.rootPerson.id) {
            this.close();
          }

          this.loadRelatives(); // Recarga los familiares solo después de eliminar
        },
        error: (error) => {
          console.error("Error eliminando la persona", error);
        }
      });

    }
  }

  closeEditModal() {
    this.showEditPerson = false;
    this.personToEdit = null;
    this.loadRelatives(); // refresca datos
  }

  closeNewModal() {
    this.showNewPerson = false;
    this.personToCreate = null;
    this.loadRelatives(); // refresca datos
  }

  close() {
    this.closePage.emit();
  }
}
