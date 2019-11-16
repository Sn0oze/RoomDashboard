import { Component, OnInit } from '@angular/core';
import buildingData from '../data/buildingData.json';
import { Colors } from './core/constants/colors';
import {FloorUserData} from './core/models/floor-user-data.model';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: []
})
export class AppComponent implements OnInit {
  floor = null;

  ngOnInit(): void {
  }

  onFloorSelected(floorData: FloorUserData): void {
    if (floorData) {
      this.floor = buildingData[floorData.floor];
    } else {
      this.floor = null;
    }
  }
}
