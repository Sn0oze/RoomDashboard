import {Component, OnInit, OnChanges, Input, SimpleChanges} from '@angular/core';
import {Job} from '../core/models/job.model';
import * as moment from 'moment';

@Component({
  selector: 'app-ui',
  templateUrl: './ui.component.html',
  styleUrls: ['./ui.component.scss']
})
export class UiComponent implements OnInit, OnChanges {
  @Input() floor: Object;

  rooms: string[];
  room: string;

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    const newFloor = changes.floor.currentValue;
    if (newFloor) {
      this.rooms = Object.keys(newFloor);
      this.room = this.rooms[0];

    } else {
      this.rooms = [];
      this.room = '';
    }
  }
}
