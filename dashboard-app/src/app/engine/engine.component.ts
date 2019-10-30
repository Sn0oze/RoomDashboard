import {Component, ElementRef, OnInit, OnDestroy, ViewChild, Output, EventEmitter} from '@angular/core';
import { EngineService } from './engine.service';

@Component({
  selector: 'app-engine',
  templateUrl: './engine.component.html'
})
export class EngineComponent implements OnInit, OnDestroy {

  @ViewChild('rendererCanvas', { static: true })
  private rendererCanvas: ElementRef<HTMLCanvasElement>;
  @Output() floorSelected = new EventEmitter<string>();

  constructor(
    private engine: EngineService) { }

  ngOnInit() {
    this.engine.createScene(this.rendererCanvas);
    this.engine.animate();
    this.engine.floorClicked.subscribe(
      floor => {
         this.floorSelected.emit(floor);
      });
  }

  ngOnDestroy(): void {
    this.engine.floorClicked.unsubscribe();
  }
}
