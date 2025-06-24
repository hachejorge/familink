import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PersonDetails } from '../person.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PersonEditService } from './person-edit.service';
import { PopUpComponent } from '../pop-up/pop-up.component';

@Component({
  selector: 'app-person-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, PopUpComponent],
  templateUrl: './person-edit.component.html',
  styleUrl: './person-edit.component.css'
})
export class PersonEditComponent {
  
  @Input() person! : PersonDetails;

  @Output() closeModal = new EventEmitter<void>();

  imageUploading = false;
  personUploading = false;
  showPopUp = false;

  popUpMessage : string = '';

  constructor(private personEditService: PersonEditService) {}


  ngOnInit() {
    if (this.person.birthDate) {
      this.person.birthDate = this.toISOFormat(this.person.birthDate);
    }

    if (this.person.deathDate) {
      this.person.deathDate = this.toISOFormat(this.person.deathDate);
    }
  }

  toISOFormat(dateStr: string): string {
    const [day, month, year] = dateStr.split('-');
    return `${year}-${month}-${day}`;
  }

  close() {
    this.closeModal.emit();
  }

  onImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.imageUploading = true;

      this.personEditService.uploadFile(file).subscribe({
        next: (response) => {
          // Suponemos que el backend devuelve la URL en response.data.url
          this.person.imageUrl = response.data.url;
          this.imageUploading = false;
        },
        error: (error) => {
          console.error('Error al subir la imagen', error);
          this.imageUploading = false;
        }
      });
    }
  }

  save() {
    console.log(this.person)
    this.personUploading = true;
    let modified = this.person.gender === "F" ? "modificada" : "modificado";

    this.personEditService.modifyPerson(this.person).subscribe({
      next: (response) => {
        // modificado exitosamente
        this.popUpMessage = this.person.firstName + " " + modified + " con éxito!";
        this.personUploading = false;
        this.showPopUp = true;
      },
      error: (error) => {
        // Informar error
        this.popUpMessage = "Error modificando a " + this.person.firstName;
        this.personUploading = false;
        this.showPopUp = true;
      }
    })
  }

  closePopUp() {
    this.showPopUp = false;
    this.close()
  }
}
