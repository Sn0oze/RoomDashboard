import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { EngineService } from './engine.service';
import { HostListener } from '@angular/core';

@Component({
  selector: 'app-engine',
  templateUrl: './engine.component.html'
})
export class EngineComponent implements OnInit {

  @ViewChild('rendererCanvas', { static: true })
  public rendererCanvas: ElementRef<HTMLCanvasElement>;

  constructor(private engServ: EngineService) { }

  ngOnInit() {
    this.engServ.createScene(this.rendererCanvas);
    this.engServ.animate();
  }
  onMousewheel( event ): void {
    this.engServ.onDocumentMouseWheel(event);
  }
  onMouseMove( event ): void{
  }
}
