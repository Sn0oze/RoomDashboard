import { Component, OnInit } from '@angular/core';
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
      this.floor = floorData;
    } else {
      this.floor = null;
    }
  }
}
