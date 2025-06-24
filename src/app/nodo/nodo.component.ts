import { Component, ElementRef, EventEmitter, HostListener, Input, Output, ViewChild } from '@angular/core';
import { Person } from '../person.model';
import { HttpClient } from '@angular/common/http';  // Necesario para llamadas HTTP
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-node',
  animations: [
    trigger('slideInOutLeft', [
      state('hidden', style({
        opacity: 0,
        transform: 'translateX(-40px)'
      })),
      state('visible', style({
        opacity: 1,
        transform: 'translateX(0)'
      })),
      transition('hidden => visible', [
        animate('300ms ease-out')
      ]),
      transition('visible => hidden', [
        animate('300ms ease-in')
      ]),
    ]),
    trigger('slideInOutRight', [
      state('hidden', style({
        opacity: 0,
        transform: 'translateX(40px)'
      })),
      state('visible', style({
        opacity: 1,
        transform: 'translateX(0)'
      })),
      transition('hidden => visible', [
        animate('300ms ease-out')
      ]),
      transition('visible => hidden', [
        animate('300ms ease-in')
      ]),
    ])
  ],
  standalone: true,
  imports: [CommonModule],
  templateUrl: './nodo.component.html',
  styleUrls: ['./nodo.component.css']
})
export class NodoComponent {
  @Input() person!: Person;
  @Input() isMainNode = false; // NUEVO input para controlar la recursividad

  @Output() personClick = new EventEmitter<string>();

  @ViewChild('nodeElement') nodeRef!: ElementRef;
  @ViewChild('contextMenu') contextMenuRef!: ElementRef;


  showContextMenu = false;
  contextMenuPosition = { x: 0, y: 0 };

  showLeftSiblings = false;
  showRightSiblings = false;

  siblings: { left: Person[], right: Person[] } | null = null;
  private fetchSiblingsSub?: Subscription;

  URL_DE_IMAGEN_POR_DEFECTO = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";

  constructor(private http: HttpClient) {}

  ngOnInit() {
    if (!this.person.imageUrl) {
      this.person.imageUrl = this.URL_DE_IMAGEN_POR_DEFECTO;
    }
  }

  onClick(event?: MouseEvent) {
    event?.stopPropagation(); // Evita que el clic burbujee al padre
    this.personClick.emit(this.person.id.toString());
  }

  showSiblings() {
    if (!this.isMainNode) return;  // SOLO el nodo principal carga hermanos

    if (this.fetchSiblingsSub) {
      this.fetchSiblingsSub.unsubscribe();
    }

    this.showLeftSiblings = true;
    this.showRightSiblings = true;
    
    // Llamada a la API para obtener hermanos
    this.fetchSiblingsSub = this.http.get<Person[]>(`https://familink-back.onrender.com/persons/siblings/${this.person.id}`)
      .subscribe(siblingsList => {
        // Aquí vamos a dividir hermanos en izquierda y derecha para mostrar a ambos lados
        // Por simplicidad, ponemos la mitad izquierda y mitad derecha
        const half = Math.ceil(siblingsList.length / 2);
        this.siblings = {
          left: siblingsList.slice(0, half),
          right: siblingsList.slice(half)
        };
      });
  }

  hideSiblings() {
    if (!this.isMainNode) return;

    if (this.fetchSiblingsSub) {
      this.fetchSiblingsSub.unsubscribe();
    }
    this.siblings = null;
    this.showLeftSiblings = false;
    this.showRightSiblings = false;
  }
}
