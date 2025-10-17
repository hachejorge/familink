import {
  Component,
  Input,
  ViewChild,
  ElementRef,
  AfterViewInit,
  ContentChild,
  TemplateRef
} from '@angular/core';
import Panzoom from '@panzoom/panzoom';

@Component({
  selector: 'app-zoom-wrapper',
  standalone: true,
  imports: [],
  templateUrl: './zoom-wrapper.component.html',
  styleUrls: ['./zoom-wrapper.component.css'],
})
export class ZoomWrapperComponent implements AfterViewInit {
  @Input() diagramName!: string;

  @ViewChild('wrapper', { static: true }) wrapper!: ElementRef;
  @ViewChild('content', { static: true }) content!: ElementRef;

  panzoomInstance: any;
  initialTransform = { x: 0, y: 0, scale: 1 };


  ngAfterViewInit(): void {
    this.panzoomInstance = Panzoom(this.content.nativeElement, {
      maxScale: 4,
      minScale: 0.5,
      contain: 'outside',
    });

    this.wrapper.nativeElement.addEventListener(
      'wheel',
      this.panzoomInstance.zoomWithWheel
    );

    setTimeout(() => {
      const wrapper = this.wrapper.nativeElement;
      const content = this.content.nativeElement;

      const minScale = this.panzoomInstance.getOptions().minScale;

      const wrapperRect = wrapper.getBoundingClientRect();
      const contentWidth = content.offsetWidth;
      const contentHeight = content.offsetHeight;

      const scaledWidth = contentWidth * minScale;
      const scaledHeight = contentHeight * minScale;

      const x = (wrapperRect.width - scaledWidth) / 2;
      const y = (wrapperRect.height - scaledHeight) / 2;

      // Importante: Usamos .zoom() para establecer la escala mínima y centrar bien
      this.panzoomInstance.zoom(minScale, {
        animate: false,
        focal: {
          clientX: wrapperRect.width / 2,
          clientY: wrapperRect.height / 2,
        },
      });

      // Luego hacemos pan manual
      this.panzoomInstance.pan(x, y, { animate: false });

      // Guardamos transform inicial para usar en reset
      this.initialTransform = {
        x,
        y,
        scale: minScale,
      };
    }, 0);
  }



  zoomIn() {
    this.panzoomInstance?.zoomIn();
  }

  zoomOut() {
    this.panzoomInstance?.zoomOut();
  }

  resetZoom() {
    if (!this.panzoomInstance) return;

    const { x, y, scale } = this.initialTransform;

    this.panzoomInstance.zoom(scale, {
      animate: false,
      focal: {
        clientX: this.wrapper.nativeElement.clientWidth / 2,
        clientY: this.wrapper.nativeElement.clientHeight / 2,
      },
    });

    this.panzoomInstance.pan(x, y, { animate: false });
  }

  resetZoomDouble() {
    this.resetZoom();
    setTimeout(() => this.resetZoom(), 0);
  }

}