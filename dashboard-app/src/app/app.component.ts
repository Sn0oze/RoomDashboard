import { Component, OnInit } from '@angular/core';
import buildingData from '../data/buildingData.json';
import { Colors } from './core/constants/colors';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: []
})
export class AppComponent implements OnInit {
  floor = null;

  ngOnInit(): void {
  }

  onFloorSelected(floor): void {
    if (floor) {
      this.floor = buildingData[floor];
    } else {
      this.floor = null;
    }
  }
}
