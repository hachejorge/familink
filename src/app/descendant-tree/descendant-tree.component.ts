import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ViewChildren,
  QueryList,
  ElementRef,
  AfterViewInit
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { DescendantTree } from '../person.model';
import { NodoComponent } from '../nodo/nodo.component';

@Component({
  selector: 'app-descendant-tree',
  standalone: true,
  imports: [CommonModule, NodoComponent],
  templateUrl: './descendant-tree.component.html',
  styleUrl: './descendant-tree.component.css'
})
export class DescendantTreeComponent implements AfterViewInit {
  @Input() data!: DescendantTree;
  @Output() personSelected = new EventEmitter<string>();

  @ViewChild('treeContainer') container!: ElementRef;
  @ViewChild('rootNode') rootNode!: ElementRef;
  @ViewChild('spouseNode') spouseNode!: ElementRef;
  @ViewChild('coupleElement') coupleElement!: ElementRef;
  @ViewChildren(DescendantTreeComponent) childTrees!: QueryList<DescendantTreeComponent>;

  mainLine: { x: number; y1: number; y2: number } | null = null;
  horizontalLine: { x1: number; x2: number; y: number } | null = null;
  childrenLines: { x: number; y1: number; y2: number }[] = [];

  onSelectPerson(id: string) {
    this.personSelected.emit(id);
  }

  ngAfterViewInit(): void {
    const containerRect = this.container.nativeElement.getBoundingClientRect();
    const rootRect = this.rootNode.nativeElement.getBoundingClientRect();
    const spouseRect = this.spouseNode?.nativeElement?.getBoundingClientRect();

    const coupleCenterX = spouseRect
      ? (rootRect.left + rootRect.width / 2 + spouseRect.left + spouseRect.width / 2) / 2
      : rootRect.left + rootRect.width / 2;

    const coupleBottomY = Math.max(rootRect.bottom, spouseRect?.bottom ?? 0);

    const startX = coupleCenterX - containerRect.left;
    const startY = coupleBottomY - containerRect.top;

    const children = this.childTrees.toArray();
    if (children.length === 0) return;

    // Coordenadas centrales de los hijos
    const childCenters = children.map((child) => {
      const childRect = child.rootNode.nativeElement.getBoundingClientRect();
      return {
        x: childRect.left + childRect.width / 2 - containerRect.left,
        y: childRect.top - containerRect.top,
      };
    });

    const horizontalY = Math.min(...childCenters.map((c) => c.y)) - 20;

    this.mainLine = {
      x: startX,
      y1: startY,
      y2: horizontalY
    };

    this.horizontalLine = {
      x1: Math.min(...childCenters.map((c) => c.x)),
      x2: Math.max(...childCenters.map((c) => c.x)),
      y: horizontalY
    };

    this.childrenLines = childCenters.map((c) => ({
      x: c.x,
      y1: horizontalY,
      y2: c.y
    }));
  }
}
