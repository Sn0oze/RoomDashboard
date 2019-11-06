import {Component, ElementRef, OnInit, ViewChild, Output, EventEmitter} from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-floor-plan',
  templateUrl: './floor-plan.component.html',
  styleUrls: ['./floor-plan.component.scss']
})
export class FloorPlanComponent implements OnInit {
  @Output() floorSelected = new EventEmitter<string>();
  @ViewChild('svgContainer', {static: true})
  private chartContainer: ElementRef;

  constructor() { }

  ngOnInit() {
    /*
    const self = this;
    const element = this.chartContainer.nativeElement;
    const ratio = 0.5;
    const dimensions = {width: element.offsetWidth, height: element.offsetWidth * ratio};
    const data = this.getLayout(dimensions); // ['room_1', 'room_2', 'room_3', 'room_4'];

    const svg = d3.select(element).append('svg')
      .attr('width', dimensions.width)
      .attr('height', dimensions.height)
      .style('background-color', 'white');

    svg.selectAll('rect')
      .data(data)
      .enter()
      .append('rect')
      .attr('x', (d) => d.x)
      .attr('y', (d) => d.y)
      .attr('width', (d) => d.width)
      .attr('height', (d) => d.height)
      .attr('class', 'room');
    const rooms = d3.selectAll('.room');
    rooms.on('click',  function(d: Room) {
      d3.selectAll('rect').style('fill', '#ffffff');
      d3.select(this).style('fill', '#cccccc');
      self.floorSelected.emit(d.data.id);
    });

     */
  }

  getLayout(dimensions: {width: number, height: number}): Room[] {
    const corridorWidth = 20;
    const coords = [];
    const margin = 5;
    coords.push(new Room(margin, margin, (dimensions.width / 2), (dimensions.height / 2) - margin, '0'));
    coords.push(
      new Room(
        margin,
        (((dimensions.height / 2) + corridorWidth) - margin),
        dimensions.width / 2,
        (dimensions.height / 2) - margin - corridorWidth,
        '1'));
    return coords;
  }

}

class Room {
  x: number;
  y: number;
  width: number;
  height: number;
  data = new RoomData();
  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    id: string
  ) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.data.id = id;
  }
}

class RoomData {
  id: string;
}
