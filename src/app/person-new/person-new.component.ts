import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PersonDetails } from '../person.model';
import { PersonEditService } from '../person-edit/person-edit.service';
import { PopUpComponent } from '../pop-up/pop-up.component';
import { NewPerson } from '../options.model';
import { ImageCropperModule } from 'ngx-image-cropper';

@Component({
  selector: 'app-person-new',
  standalone: true,
  imports: [CommonModule, FormsModule, PopUpComponent, ImageCropperModule],
  templateUrl: './person-new.component.html',
  styleUrl: './person-new.component.css'
})
export class PersonNewComponent {
  @Input() personToCreate!: NewPerson;

  @Output() closeModal = new EventEmitter<void>();

  person: any = {
    firstName: '',
    lastName: '',
    gender: 'M',
    originPlace: '',
    isAlive: true,
    birthDate: '',
    deathDate: '',
    biography: '',
    imageUrl: '',
  };

  showPopUp = false;
  imageUploading = false;
  personUploading = false;
  popUpMessage: string = '';

  constructor(private personEditService: PersonEditService) {}

  create() {
    this.personUploading = true;
    const creado = this.person.gender === 'F' ? 'creada' : 'creado';

    const request = this.getRequestObservableByRelation();

    if (!request) {
      this.popUpMessage = 'Tipo de relación no soportado';
      this.personUploading = false;
      this.showPopUp = true;
      return;
    }

    request.subscribe({
      next: (response: any) => {
        this.popUpMessage = `${this.person.firstName} ${creado} con éxito!`;
        this.personUploading = false;
        this.showPopUp = true;
      },
      error: (error: any) => {
        if(error.error.error == 'Referencia debe tener madre o padre para crear un hermano/a') {
          this.popUpMessage = 'Debes crear primero a la madre o padre de este hermano/a';
        } else {
          this.popUpMessage = `Error creando a ${this.person.firstName}`;
        }
        this.personUploading = false;
        this.showPopUp = true;
      }
    });
  }

  imageChangedEvent: any = null;
  croppedImage: Blob | null = null;
  showCropper: boolean = false;

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.imageChangedEvent = event;
      this.showCropper = true;
    }
  }

  imageCropped(event: any): void {
    console.log('Imagen recortada:', event);
    this.croppedImage = event.blob;
  }

  onCropperError() {
    console.error("Error al cargar la imagen para recorte");
  }


  uploadCroppedImage(): void {
    if (!this.croppedImage) {
      console.warn('No hay imagen recortada disponible');
      return;
    }

    this.imageUploading = true;
    this.showCropper = false;

    const file = new File([this.croppedImage], 'cropped-image.png', { type: 'image/png' });   

    this.personEditService.uploadFile(file).subscribe({
      next: (response) => {
        this.person.imageUrl = response.data.url;
        this.imageUploading = false;
      },
      error: (error) => {
        console.error('Error al subir la imagen recortada', error);
        this.imageUploading = false;
      }
    });
  }

  getRequestObservableByRelation() {
    switch (this.personToCreate.relation) {
      case 'child':
        return this.personEditService.createChild(String(this.personToCreate.rootPersonId), this.person);
      case 'sibling':
        return this.personEditService.createSibling(String(this.personToCreate.rootPersonId), this.person);
      case 'mother':
        return this.personEditService.createMother(String(this.personToCreate.rootPersonId), this.person);
      case 'father':
        return this.personEditService.createFather(String(this.personToCreate.rootPersonId), this.person);
      case 'spouse':
        return this.personEditService.createSpouse(String(this.personToCreate.rootPersonId), this.person);
      case 'root':
        // return this.personEditService.createRootPerson(this.person);
      default:
        return null;
    }
  }

  close() {
    this.closeModal.emit();
  }

  closePopUp() {
    this.showPopUp = false;
    this.close();
  }
}
