import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PersonDetails } from '../../../person.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PersonEditService } from './person-edit.service';
import { PopUpComponent } from '../../../shared/pop-up/pop-up.component';
import { ImageCropperModule } from 'ngx-image-cropper';

@Component({
  selector: 'app-person-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, PopUpComponent, ImageCropperModule],
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
