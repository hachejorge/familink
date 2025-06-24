import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Person } from '../person.model';
import { CommonModule } from '@angular/common';
import { ActionOfNode, ActionType, RelativeType } from '../options.model';

@Component({
  selector: 'app-node-extended',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './node-extended.component.html',
  styleUrl: './node-extended.component.css'
})
export class NodeExtendedComponent {
  // ----------------- VARIABLES -----------------

  @Input() person: Person | null = null;
  @Input() typeOfNode!: RelativeType;

  @Output() actionToDo = new EventEmitter<ActionOfNode>();

  realPerson: boolean = true;

  readonly URL_DE_IMAGEN_POR_DEFECTO = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";

  readonly DEFAULT_PERSON: Person = {
    id: -1,
    firstName: '???',
    lastName: '',
    imageUrl: this.URL_DE_IMAGEN_POR_DEFECTO,
  }

  // ----------------- FUNCIONES -----------------

  ngOnInit() {
    if (!this.person) {
      this.person = this.DEFAULT_PERSON;
      this.realPerson = false;
    } else {
      this.realPerson = true;
      if (!this.person.imageUrl) {
        this.person.imageUrl = this.URL_DE_IMAGEN_POR_DEFECTO;
      }
    }
  }

  onEditPerson() {
    this.actionToDo.emit({
      id: this.person?.id ?? -1,
      action: ActionType.MODIFY,
      relative: this.typeOfNode
    })
  }

  onDeletePerson() {
    this.actionToDo.emit({
      id: this.person?.id ?? -1,
      action: ActionType.DELETE,
      relative: this.typeOfNode
    })
  }

  onCreatePerson() {
    this.actionToDo.emit({
      id: this.person?.id ?? -1,
      action: ActionType.NEW,
      relative: this.typeOfNode
    })
  }

}
