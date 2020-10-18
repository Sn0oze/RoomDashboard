import { Component, OnInit } from '@angular/core';
import {MatSliderChange} from '@angular/material';
import {Scene2Service} from './engine/scene2.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: []
})
export class AppComponent implements OnInit {
  levels: number[];
  minLevel: number;
  maxLevel: number;
  selectedLevel: number;

  constructor(private scene: Scene2Service) {
    this.levels = this.scene.buildingLevels;
    this.minLevel = this.levels[0];
    this.maxLevel = this.levels[this.levels.length - 1];
    this.selectedLevel = this.maxLevel;
  }

  ngOnInit(): void {
  }

  changeLevel(event: MatSliderChange) {
    this.scene.setLevelCut(this.levels.indexOf(event.value));
  }
}
