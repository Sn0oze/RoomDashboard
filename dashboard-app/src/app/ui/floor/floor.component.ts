import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import * as moment from 'moment';
import {Job} from '../../core/models/job.model';
import {Colors} from '../../core/constants/colors';
import {TimeFormats} from '../../core/constants/time-formats';
import {animate, animateChild, query, stagger, style, transition, trigger} from '@angular/animations';
import {FloorUserData} from '../../core/models/floor-user-data.model';

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
  @Input() floor: FloorUserData;
  zone: string;
  pipeline: Job[];
  private now = moment.utc('2019-10-21T21:20:20Z');

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    const newFloor = changes.floor.currentValue;
    if (newFloor) {
      this.zone = Object.keys(newFloor.data)[0];
      this.pipeline = newFloor.data[this.zone].pipeline;

    } else {
      this.pipeline = [];
      this.zone = '';
    }
  }

  getPipelineColor(utcString: string, currentJob: number): string {
    let color ; // = Colors.default;

    const deadline = moment.utc(utcString);

    if (deadline.isAfter(this.now)) {
      color = Colors.passive;
    } else {
      color = Colors.red;
    }

    return this.toHexString(color);
  }

  floorNumber(): number {
    return parseInt((this.floor.floor).split('_')[1], 10) + 1;
  }

  toHexString(value: number): string {
    return `#${value.toString(16)}`;
  }

  floorChanges(event): void {
    this.zone = `zone_${event}`;
    this.pipeline = this.floor.data[this.zone].pipeline;
  }
}
