import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import * as moment from 'moment';
import {Job} from '../../core/models/job.model';
import {Colors} from '../../core/constants/colors';
import {TimeFormats} from '../../core/constants/time-formats';
import {animate, animateChild, query, stagger, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-floor',
  templateUrl: './floor.component.html',
  styleUrls: ['./floor.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: '0' }),
        animate('.5s ease-out', style({ opacity: '1' })),
      ]),
    ]),
    trigger('list', [
      transition(':enter', [
        query('@fadeIn', stagger(300, animateChild()))
      ]),
    ])
  ]
})
export class FloorComponent implements OnInit, OnChanges {
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

  getPipelineColor(utcString: string, currentJob: number): string {
    let color = Colors.default;

    const previousJob = this.jobs()[currentJob - 1];

    const deadline = moment.utc(utcString);

    if (deadline.isAfter(this.now)) {
      color = Colors.passive;
    } else {
      color = Colors.red;
    }
    /*
    if (previousJob) {
      const previousDeadline = moment.utc(previousJob.deadline);
      if (previousDeadline.isBefore(this.now)) {
        color = Colors.green;
      }
    }
     */

    return this.toHexString(color);
  }

  toHexString(value: number): string {
    return `#${value.toString(16)}`;
  }

  floorChanges(event): void {
    const floorNumber = this.room.split('_')[1][0];
    this.room = `room_${floorNumber}${event}`;
  }
}
