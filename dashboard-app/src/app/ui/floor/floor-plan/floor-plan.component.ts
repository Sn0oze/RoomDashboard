import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-floor-plan',
  templateUrl: './floor-plan.component.html',
  styleUrls: ['./floor-plan.component.scss']
})
export class FloorPlanComponent implements OnInit {
  @ViewChild('svgContainer', {static: true})
  private chartContainer: ElementRef;

  constructor() { }

  ngOnInit() {
    /*
    console.log('init');
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
     */
  }

  getLayout(dimensions: {width: number, height: number}): Room[] {
    const coridorWidth = 20;
    const coords = [];
    coords.push(new Room(0, 0, dimensions.width / 2, dimensions.height / 2));
    coords.push(new Room(0, (dimensions.height / 2) + coridorWidth, dimensions.width / 2, dimensions.height));
    return coords;
  }

}

class Room {
  x: number;
  y: number;
  width: number;
  height: number;
  constructor(
    x: number,
    y: number,
    width: number,
    height: number
  ) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }
}
