import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Job} from '../../core/models/job.model';
import {TradeColors} from '../../core/constants/colors';
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
  // private now = moment.utc();

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    const newFloor = changes.floor.currentValue;
    if (newFloor) {
      if (!this.zone) {
        this.zone = Object.keys(newFloor.data)[0];
      }
      this.pipeline = newFloor.data[this.zone].pipeline;

    } else {
      this.pipeline = [];
      this.zone = '';
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
  }
}
