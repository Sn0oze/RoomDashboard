import {Component, OnInit, OnChanges, Input, SimpleChanges} from '@angular/core';
import {Job} from '../core/models/job.model';
import * as moment from 'moment';
import {Colors} from '../core/constants/colors';
import {TimeFormats} from '../core/constants/time-formats';

@Component({
  selector: 'app-ui',
  templateUrl: './ui.component.html',
  styleUrls: ['./ui.component.scss']
})
export class UiComponent implements OnInit, OnChanges {
  @Input() floor: Object;

  rooms: string[];
  room: string;
  private now = moment.utc();

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

  jobs(): Job[] {
    return this.floor[this.room];
  }

  getPipelineColor(utcString): string {
    let color = Colors.default;
    const deadline = moment.utc(utcString);
    if (deadline.isAfter(this.now)) {
      color = Colors.green;
    } else {
      color = Colors.red;
    }
    return this.toHexString(color);
  }
  toHexString(value: number): string {
    return `#${value.toString(16)}`;
  }

  formatTime(utcString): string {
    return moment.utc(utcString).format(TimeFormats.short);
  }
}

