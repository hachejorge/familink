import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AscendantTree, DescendantTree, Person, PersonDetails, TreeType } from '../person.model';
import { AscendantTreeComponent } from '../ascendant-tree/ascendant-tree.component';
import { TreeService } from '../ascendant-tree/tree.service';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HeaderComponent } from '../header/header.component';
import { PersonDetailComponent } from '../person-detail/person-detail.component';
import Panzoom from '@panzoom/panzoom';
import { ZoomWrapperComponent } from '../zoom-wrapper/zoom-wrapper.component';
import { DescendantTreeComponent } from '../descendant-tree/descendant-tree.component';
import { PersonEditComponent } from '../person-edit/person-edit.component';
import { PersonDetailsExtendedComponent } from '../person-details-extended/person-details-extended.component';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterOutlet, AscendantTreeComponent, DescendantTreeComponent
    , HttpClientModule, HeaderComponent, PersonDetailComponent, ZoomWrapperComponent, 
    PersonEditComponent, PersonDetailsExtendedComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  data: AscendantTree | null = null;
  data2: DescendantTree | null = null;
  loading = true;
  error: string | null = null;
  @ViewChild('treeWrapper', { static: false }) treeWrapper!: ElementRef;
  @ViewChild('panzoomContent', { static: false }) panzoomContent!: ElementRef;

  diagramName : string = '';

  constructor(
    private treeService: TreeService,
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  selectedPersonId: string | null = null;

  personToEdit : PersonDetails | null = null;

  showEditModal = false;

  showManageRelatives = false;

  personToManage: Person | null = null;

  editPerson( person: PersonDetails ) {
    this.showEditModal = true;
    this.personToEdit = person;
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

  closeEditModal() {
    this.showEditModal = false;
    this.personToEdit = null;
  }

  initTree() {

    const rootPersonId = this.auth.getRootPersonId();
    if (!rootPersonId) {
      this.error = 'No se pudo obtener el ID de la persona raíz.';
      this.loading = false;
      this.router.navigate(['/login']);
      return;
    }

    console.log('Raiz:' + rootPersonId);

    this.data2 = null; // Aseguramos que data2 esté vacía al iniciar
    this.treeService.getAscendantTree(rootPersonId).subscribe({
      next: (tree) => {
        this.data = tree;
        this.diagramName = `Ascendencia de ${tree.root.firstName} ${tree.root.lastName}`;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar el árbol genealógico.';
        this.loading = false;
        console.error(err);
        this.router.navigate(['/login']);
      }
    });
  }

  ngOnInit(): void {
    this.loading = true;
    this.data = null;
    this.data2 = null;
    this.showManageRelatives = false;

    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      const typeStr = params.get('type');

      if (id && (typeStr === 'ascendant' || typeStr === 'descendant')) {
        const treeType = typeStr === 'ascendant' ? TreeType.ASCENDANT : TreeType.DESCENDANT;
        console.log('Cargando árbol para ID:', id, 'Tipo:', treeType);

        this.loadTree({ id, type: treeType });
      } else {
        // si no hay parámetros, cargar el árbol por defecto
        console.log('Cargando árbol por defecto');
        this.initTree();
      }
    });
  }

  loadTree(event: { id: number, type: TreeType }) {
    this.loading = true;
    this.data = null;
    this.data2 = null;

    if (event.type === TreeType.ASCENDANT) {
      this.treeService.getAscendantTree(event.id).subscribe({
        next: (tree) => {
          this.data = tree;
          this.diagramName = `Ascendencia de ${tree.root.firstName} ${tree.root.lastName}`;
          this.loading = false;
          this.selectedPersonId = null;
        },
        error: (err) => {
          this.error = 'Error al cargar la ascendencia.';
          this.loading = false;
        }
      });
    } else if (event.type === TreeType.DESCENDANT) {
      this.treeService.getDescendantTree(event.id).subscribe({
        next: (tree) => {
          this.data2 = tree;
          this.diagramName = `Descendencia de ${tree.root.firstName} ${tree.root.lastName}`;
          this.loading = false;
          this.selectedPersonId = null;
        },
        error: (err) => {
          this.error = 'Error al cargar la descendencia.';
          this.loading = false;
        }
      });
    }
  }

  navigateTo(event: { id: number, type: TreeType }) {
    this.router.navigate([`/home/${event.id}/${event.type}`]);
  }

  onPersonSelected(id: number | string) {
    this.selectedPersonId = String(id); // convertir por seguridad
  }

  closePanel() {
    this.selectedPersonId = null;
  }

  backToTree() {
    this.showManageRelatives = false;
    this.personToManage = null;
    if(!this.data && this.data2?.root.id) {
      this.loadTree({ id: this.data2.root.id, type: TreeType.DESCENDANT });
    } else {
      if (this.data?.root.id !== undefined) {
        this.loadTree({ id: this.data.root.id, type: TreeType.ASCENDANT });
      }
    }
  }


}