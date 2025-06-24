import { Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { PersonDetails, PersonTree, TreeType } from '../person.model';
import { AuthService } from '../services/auth.service';
import {
  trigger,
  style,
  animate,
  transition,
  state,
  group
} from '@angular/animations';

@Component({
  selector: 'app-person-detail',
  standalone: true,
  templateUrl: './person-detail.component.html',
  styleUrls: ['./person-detail.component.css'],
  imports: [CommonModule ],
  animations: [
    trigger('slideInOut', [
      state('in', style({ transform: 'translateX(0%)', opacity: 1 })),
      transition(':enter', [
        style({ transform: 'translateX(100%)', opacity: 0 }),
        animate('300ms ease-in')
      ]),
      transition(':leave', [
        animate('300ms ease-out', style({ transform: 'translateX(100%)', opacity: 0 }))
      ])
    ]),
    trigger('contentFade', [
      transition('* => *', [ // se activa en cada cambio
        style({ opacity: 0 }),
        animate('300ms ease-in', style({ opacity: 1 }))
      ])
    ])
  ]
})
export class PersonDetailComponent implements OnInit {
  @Input() personId!: string;
  @Output() close = new EventEmitter<void>();
  @Output() personTree = new EventEmitter<PersonTree>();
  @Output() personEdit = new EventEmitter<PersonDetails>();
  @Output() manageRelatives = new EventEmitter<PersonDetails>();

  personDetails!: any;

  loading = true;
  isVisible = false;
  showOptionsPanel: boolean = false;

  constructor(private http: HttpClient, public auth: AuthService) {}


  URL_DE_IMAGEN_POR_DEFECTO = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";

  role = '';

  ngOnInit() {
    if (this.auth.getUserRole()) {
      this.role = this.auth.getUserRole() ?? '';
    }
  }


  ngOnChanges(changes: SimpleChanges): void {
    if (changes['personId'] && changes['personId'].currentValue) {
      this.performTransitionAndLoadNewData();
    }
  }

  async performTransitionAndLoadNewData() {
    this.personDetails = null;       // provoca animación de salida
    this.loading = true;

    await this.delay(250);           // espera que termine animación de salida (~300ms)

    this.http.get<PersonDetails>(`https://familink-back.onrender.com/persons/person-details/${this.personId}`).subscribe({
      next: (data) => {
        if (!data.imageUrl) {
          data.imageUrl = this.URL_DE_IMAGEN_POR_DEFECTO;
        }
        this.personDetails = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching person details:', err);
        this.loading = false;
      }
    });
  }

  onViewDescendants() {
    // Emitir el evento para ver los descendientes
    this.onClosePanel(); // Cierra el panel antes de emitir el evento
    this.personTree.emit({ id: Number(this.personId), type: TreeType.DESCENDANT });
  }
  onViewAscendants() {
    // Emitir el evento para ver los ascendientes
    this.onClosePanel(); // Cierra el panel antes de emitir el evento
    this.personTree.emit({ id: Number(this.personId), type: TreeType.ASCENDANT });
  }
  onEditPerson() {
    const personToEdit = this.personDetails;
    this.showOptionsPanel = false;
    this.onClosePanel();
    this.personEdit.emit(personToEdit)
  }

  onManageRelatives() {
    const personToManage = this.personDetails;
    this.showOptionsPanel = false;
    this.onClosePanel();
    this.manageRelatives.emit(personToManage);
  }

  onClosePanel() {
    this.personDetails = null; // activa la animación de salida
    setTimeout(() => {
      this.close.emit();
    }, 300); // espera la duración de la animación
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

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  onHoverShowOptions() {
    this.showOptionsPanel = true;
  }
}
