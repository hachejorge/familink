import { Component, Input, Output, ElementRef, ViewChild, ViewChildren, QueryList, AfterViewInit, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';


import { AscendantTree } from '../person.model';
import { NodoComponent } from '../nodo/nodo.component';

@Component({
  selector: 'app-ascendant-tree',
  standalone: true,
  imports: [CommonModule, NodoComponent, AscendantTreeComponent],
  templateUrl: './ascendant-tree.component.html',
  styleUrl: './ascendant-tree.component.css'
})
export class AscendantTreeComponent implements AfterViewInit {
  @Input() data!: AscendantTree;

  @ViewChild('nodeElement') nodeElement!: ElementRef;
  @ViewChild('treeContainer') container!: ElementRef;
  @ViewChildren(AscendantTreeComponent) childTrees!: QueryList<AscendantTreeComponent>;

  fatherLine: { x1: number; y1: number; x2: number; y2: number } | null = null;
  motherLine: { x1: number; y1: number; x2: number; y2: number } | null = null;

  @Output() personSelected = new EventEmitter<string>();

  onSelectPerson(id: string) {
    this.personSelected.emit(id); // notifica al padre
  }

  ngAfterViewInit() {
    const containerRect = this.container.nativeElement.getBoundingClientRect();
    const myCenter = this.getAnchorPoint(this.nodeElement, containerRect, 'center');

    const children = this.childTrees.toArray();

    let fatherTree: AscendantTreeComponent | undefined;
    let motherTree: AscendantTreeComponent | undefined;

    if (this.data.father && this.data.mother) {
      [fatherTree, motherTree] = children;
    } else if (this.data.father) {
      [fatherTree] = children;
    } else if (this.data.mother) {
      [motherTree] = children;
    }

    const offsetAboveBottom = -30;

    if (fatherTree) {
      const fatherEnd = this.getAnchorPoint(fatherTree.nodeElement, containerRect, 'bottom', offsetAboveBottom);
      this.fatherLine = {
        x1: fatherEnd.x,
        y1: fatherEnd.y,
        x2: myCenter.x,
        y2: myCenter.y
      };
    }

    if (motherTree) {
      const motherEnd = this.getAnchorPoint(motherTree.nodeElement, containerRect, 'bottom', offsetAboveBottom);
      this.motherLine = {
        x1: motherEnd.x,
        y1: motherEnd.y,
        x2: myCenter.x,
        y2: myCenter.y
      };
    }
  }
  

  getAnchorPoint(el: ElementRef, containerRect: DOMRect, vertical: 'top' | 'bottom' | 'center', yOffset = 0): { x: number; y: number } {
    const rect = el.nativeElement.getBoundingClientRect();
    const x = rect.left + rect.width / 2 - containerRect.left;
    let y = 0;

    switch (vertical) {
      case 'top':
        y = rect.top - containerRect.top + yOffset;
        break;
      case 'bottom':
        y = rect.bottom - containerRect.top + yOffset;
        break;
      case 'center':
      default:
        y = rect.top + rect.height / 2 - containerRect.top + yOffset;
        break;
    }

    return { x, y };
  }

  generateCurvePath(x1: number, y1: number, x2: number, y2: number): string {
    const controlX1 = x1;
    const controlY1 = y1 + (y2 - y1) / 2;
    const controlX2 = x2;
    const controlY2 = y1 + (y2 - y1) / 2;

    return `M ${x1},${y1} C ${controlX1},${controlY1} ${controlX2},${controlY2} ${x2},${y2}`;
  }
}
