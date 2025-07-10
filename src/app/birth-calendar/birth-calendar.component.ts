import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { CommonModule } from '@angular/common';
import { BirthService } from '../services/birth.service'
import { PersonDetails } from '../person.model';
import { trigger, transition, style, animate, state } from '@angular/animations';

@Component({
  selector: 'app-birth-calendar',
  imports: [CommonModule, HeaderComponent],
  templateUrl: './birth-calendar.component.html',
  styleUrl: './birth-calendar.component.css',
  animations: [
    trigger('slideInOut', [
      state('in', style({ transform: 'translateX(10%)', opacity: 1 })),
      transition(':enter', [
        style({ transform: 'translateX(100%)', opacity: 0 }),
        animate('300ms ease-in')
      ]),
      transition(':leave', [
        animate('300ms ease-out', style({ transform: 'translateX(100%)', opacity: 0 }))
      ])
    ]),
    trigger('contentFade', [
      transition('* => *', [
        style({ opacity: 0 }),
        animate('300ms ease-in', style({ opacity: 1 }))
      ])
    ])
  ]
})
export class BirthCalendarComponent {
  constructor(private birthService : BirthService) {}

  error = '';
  loading = true;
  birthData: PersonDetails[] | null = null;

  birthdaysByMonthDay: { [key: string]: PersonDetails[] } = {};

  showBirthDates: Boolean = false;
  showLegend = false;

  toggleLegend() {
    this.showLegend = !this.showLegend;
  }

  ngOnInit() {
    this.birthService.getBirhtDates().subscribe({
      next: (births) => {
        this.birthData = births;
        this.loading = false;

        this.birthdaysByMonthDay = {};
        const currentYear = new Date().getFullYear();

        for (const person of births) {
          if (person.birthDate) {

            const birth = new Date(person.birthDate);

            // Key es con formato MM-DD
            const key = `${birth.getMonth() + 1}-${birth.getDate()}`; // Ej: "6-25"

            if (!this.birthdaysByMonthDay[key]) {
              this.birthdaysByMonthDay[key] = [];
            }

            // Opcional: calcular edad
            const age = currentYear - birth.getFullYear();
            (person as any).ageThisYear = age;

            this.birthdaysByMonthDay[key].push(person);
          }
        }
      },
      error: (err) => {
        this.error = 'Error al cargar el árbol genealógico.';
        this.loading = false;
        console.error(err);
      }
    });
  }

  months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  weekDays = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

  getDaysInMonth(monthIndex: number): number[] {
    const year = 2024; // año bisiesto por febrero
    const days = new Date(year, monthIndex + 1, 0).getDate();
    return Array.from({ length: days }, (_, i) => i + 1);
  }

  hasBirthday(month: number, day: number): boolean {
    const key = `${month}-${day}`;
    return this.birthdaysByMonthDay[key]?.length > 0;
  }

  numberOfBirthdays(month: number, day: number) {
    const key = `${month}-${day}`;
    return this.birthdaysByMonthDay[key]?.length;
  }

  isToday(month: number, day: number): boolean {
    const currentDate = new Date();
    const todayMonth = currentDate.getMonth() + 1; // getMonth() is zero-based
    const todayDay = currentDate.getDate();
    return todayMonth === month && todayDay === day;
  }

  getEmptyStartDays(monthIndex: number): any[] {
    const year = new Date().getFullYear();
    const firstDayOfMonth = new Date(year, monthIndex, 1).getDay(); // 0 (Dom) - 6 (Sáb)

    // Ajustamos para que el lunes sea el primer día
    const adjusted = (firstDayOfMonth + 6) % 7; // convierte 0 (Domingo) → 6, 1 (Lunes) → 0, etc.

    return Array(adjusted).fill(0); // retorna un array del tamaño necesario
  }

  selectedBirthDay: { month: number, day: number } | null = null;
  tooltipPositionW: 'left' | 'right' = 'right';
  tooltipPositionH: 'top' | 'bottom' = 'top';

  showBirthDateOf(month: number, day: number, event: MouseEvent) {
    const target = event.target as HTMLElement;
    const rect = target.getBoundingClientRect();

    // Determina si está en la zona derecha
    const isOnRightSide = rect.left > window.innerWidth * 0.7;
    // Determina si está en la zona inferior
    const isOnBottomSide = rect.top > window.innerHeight * 0.7;

    if (isOnBottomSide) {
      this.tooltipPositionH = 'bottom';
    } else if (isOnRightSide) {
      this.tooltipPositionW = 'left';
    } else {
      this.tooltipPositionW = 'right';
    }

    this.selectedBirthDay = { month, day };
    this.showBirthDates = true;
  }


  getTodayBirthdaysMessage(): string {
    const today = new Date();
    const day = today.getDate();
    const month = today.getMonth() + 1; // getMonth() es base 0
    const year = today.getFullYear();

    const key = `${month}-${day}`;
    const people = this.birthdaysByMonthDay[key];

    const todayStr = `${day.toString().padStart(2, '0')}-${month.toString().padStart(2, '0')}-${year}`;

    if (!people || people.length === 0) {
      return `Hoy ${todayStr} no hay cumpleaños.`;
    }

    const names = people.map(p => {
      const birthYear = p.birthDate ? new Date(p.birthDate).getFullYear() : 0;
      const age = birthYear ? year - birthYear : 'desconocida';
      return `${p.firstName} ${p.lastName} (${age} años)`;
    });

    const plural = names.length > 1 ? 'n' : '';
    return `Hoy ${todayStr} cumple${plural} años ${names.join(', ')}.`;
  }


}
