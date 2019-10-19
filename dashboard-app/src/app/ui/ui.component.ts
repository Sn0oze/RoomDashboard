import {Component, OnInit, OnChanges, Input, SimpleChanges} from '@angular/core';

@Component({
  selector: 'app-ui',
  templateUrl: './ui.component.html',
  styleUrls: []
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
      console.log(Object.keys(newFloor));
      this.rooms = Object.keys(newFloor);
      this.room = this.rooms[0];

    } else {
      this.rooms = [];
      this.room = '';
    }
  }
}
