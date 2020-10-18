import {Component, ElementRef, OnInit, OnDestroy, ViewChild, Output, EventEmitter} from '@angular/core';
import { EngineService } from './engine.service';
import {FloorUserData} from '../core/models/floor-user-data.model';

@Component({
  selector: 'app-engine',
  templateUrl: './engine.component.html',
  styleUrls: ['./engine.component.scss']
})
export class EngineComponent implements OnInit, OnDestroy {

  @ViewChild('rendererCanvas', { static: true })
  private rendererCanvas: ElementRef<HTMLCanvasElement>;
  @ViewChild('canvasContainer', { static: true})
  private container: ElementRef<HTMLDivElement>;

  @Output() floorSelected = new EventEmitter<FloorUserData>();

  constructor(private engine: EngineService) { }

  ngOnInit() {
    const withContour = localStorage.getItem('contour') === 'true';
    this.engine.createScene(this.rendererCanvas, this.container, withContour);
    this.engine.animate();
  }

  ngOnDestroy(): void {
    this.engine.floorClicked.unsubscribe();
  }
}
