import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Job} from '../../core/models/job.model';
import {TradeColors} from '../../core/constants/colors';
import {animate, animateChild, query, stagger, style, transition, trigger} from '@angular/animations';
import {FloorUserData} from '../../core/models/floor-user-data.model';
import moment from 'moment';
import {Zone} from '../../core/models/zone.model';

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
  now = moment.utc('2020-02-16T09:43:11Z');
  text = 'Default Text';
  colors = [TradeColors.NONE, TradeColors.NONE];

  constructor() { }

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges): void {
    const newFloor = changes.floor.currentValue;
    if (newFloor) {
      if (!this.zone) {
        this.zone = Object.keys(newFloor.data)[0];
      }
      this.pipeline = newFloor.data[this.zone].pipeline;
      this.setText();
      this.colors = [];
      Object.values(newFloor.data).forEach((zone: Zone, index) => {
        const result = zone.pipeline.find((job: Job) => {
          const start = moment.utc(job.start);
          const end = moment.utc(job.end);
          return this.now.isBetween(start, end);
        });
        if (result) {
          this.colors[index] = TradeColors[result.trade];
        } else {
          this.colors[index] = TradeColors.NONE;
        }
      });
    }
  }

  color(job: Job): string {
    return TradeColors[job.trade];
  }

  floorNumber(): number {
    return parseInt((this.floor.floor).split('_')[1], 10) + 1;
  }

  floorChanges(event): void {
    this.zone = `zone_${event}`;
    this.pipeline = this.floor.data[this.zone].pipeline;
    this.setText();
  }

  setText(): void {
    const start = moment.utc(this.pipeline[0].start);
    const end = moment.utc(this.pipeline[this.pipeline.length - 1].end);

    if (this.now.isBefore(start)) {
      this.text = 'Construction has not started';
    } else if ( this.now.isAfter(end)) {
      this.text = 'Construction is completed';
    } else {
      this.text = 'Construction is currently ongoing';
    }
  }

}
