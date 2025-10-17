import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-pop-up',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './pop-up.component.html',
  styleUrl: './pop-up.component.css'
})
export class PopUpComponent {
  @Input() message!: string;

  @Output() closeEvent = new EventEmitter<void>();

  showPopup : boolean | undefined;

  onNgInit() {
    this.open();
  }

  // Flags para animación
  isEntering = false;
  isEnteringActive = false;
  isLeaving = false;
  isLeavingActive = false;

  open() {
    this.showPopup = true;
    this.isEntering = true;
    setTimeout(() => this.isEnteringActive = true, 10); // activar transición

    setTimeout(() => {
      this.isEntering = false;
      this.isEnteringActive = false;
    }, 310); // tiempo de transición
  }

  close() {
    this.isLeaving = true;
    setTimeout(() => this.isLeavingActive = true, 10);

    setTimeout(() => {
      this.isLeaving = false;
      this.isLeavingActive = false;
      this.showPopup = false;
    }, 310);
        
    this.closeEvent.emit();

  }

}
