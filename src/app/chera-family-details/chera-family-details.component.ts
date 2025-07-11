import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { ActivatedRoute, Router } from '@angular/router';
import { TreeService } from '../ascendant-tree/tree.service';
import { DescendantTree, Person, PersonDetails, TreeType } from '../person.model';
import { CommonModule } from '@angular/common';
import { ZoomWrapperComponent } from '../zoom-wrapper/zoom-wrapper.component';
import { DescendantTreeComponent } from '../descendant-tree/descendant-tree.component';
import { PersonDetailComponent } from '../person-detail/person-detail.component';
import { PersonDetailsExtendedComponent } from '../person-details-extended/person-details-extended.component';
import { PersonEditComponent } from '../person-edit/person-edit.component';

@Component({
  selector: 'app-chera-family-details',
  imports: [CommonModule, HeaderComponent, ZoomWrapperComponent, DescendantTreeComponent, PersonDetailComponent, PersonDetailsExtendedComponent, PersonEditComponent],
  templateUrl: './chera-family-details.component.html',
  styleUrl: './chera-family-details.component.css'
})
export class CheraFamilyDetailsComponent {
  personToManage: Person | null = null;
  constructor(private route: ActivatedRoute, private treeService: TreeService, private router: Router) {}

  selectedPersonId: string | null = null;

  personToEdit : PersonDetails | null = null;
  
  showEditModal = false;
  
  showManageRelatives = false;

  familyHeadId: number | null = null;
  loading = true;
  error: string | null = null
  data: DescendantTree | null = null;
  diagramName: string = '';

  ngOnInit(): void {
    this.familyHeadId = Number(this.route.snapshot.paramMap.get('id'));
    console.log('ID:', this.familyHeadId);


    this.treeService.getDescendantTree(this.familyHeadId).subscribe({
        next: (tree) => {
          this.data = tree;
          this.diagramName = `Descendencia de ${tree.root.firstName} ${tree.root.lastName}`;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Error al cargar la descendencia.';
          this.loading = false;
        }
      });
  }

  manageRelatives( person: PersonDetails ) {
    this.showManageRelatives = true;
    this.personToManage = this.fromDetailsToPerson(person);
  }

  fromDetailsToPerson(person: PersonDetails ) {
    return {
      id: person.id,
      firstName: person.firstName ?? '',
      lastName: person.lastName ?? '',
      imageUrl: person.imageUrl ?? '',
    }
  }

  onPersonSelected(id: number | string) {
    this.selectedPersonId = String(id); // convertir por seguridad
  }

  closeEditModal() {
    this.showEditModal = false;
    this.personToEdit = null;
  }

  closePanel() {
    this.selectedPersonId = null;
  }

  backToTree() {
    this.showManageRelatives = false;
    this.personToManage = null;
  }

  editPerson( person: PersonDetails ) {
    this.showEditModal = true;
    this.personToEdit = person;
  }

  loadTree(event: { id: number, type: TreeType }) {
    this.router.navigate(['/', event.id, event.type === TreeType.ASCENDANT ? 'ascendant' : 'descendant']).then(() => {
      // Aquí puedes realizar acciones adicionales después de la navegación, si es necesario
    });
  }
}