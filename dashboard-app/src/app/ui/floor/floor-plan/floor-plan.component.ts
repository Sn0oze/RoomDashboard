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
    const domainMin = 0;
    const domainMax = 100;
    const self = this;
    const element = this.chartContainer.nativeElement;
    const ratio = 0.417;
    const dimensions = {width: element.offsetWidth, height: element.offsetWidth * ratio};
    const data = this.getLayout(domainMax, 6); // ['room_1', 'room_2', 'room_3', 'room_4'];
    const backgroundImage: ImageData = {
      url: '../assets/images/floorplan2.png',
      width: dimensions.width,
      height: dimensions.height,
    };

    const svg = d3.select(element).append('svg')
      .attr('width', dimensions.width)
      .attr('height', dimensions.height);

    const xscale = d3.scaleLinear()
        .domain([domainMin, domainMax])
        .range([0, dimensions.width]);
    const yscale = d3.scaleLinear()
        .domain([domainMin, domainMax])
        .range([dimensions.height, 0]);
    console.log([xscale(0), xscale(50), xscale(100)]);
    svg.append('g')
      .append('image')
      .datum(backgroundImage)
      .attr('xlink:href', image => image.url)
      .attr('width', image => image.width)
      .attr('height', image => image.height);

    svg.selectAll('rect')
      .data(data)
      .enter()
      .append('rect')
      .attr('x', (d) => xscale(d.x))
      .attr('y', (d) => yscale( d.y))
      .attr('width', (d) => xscale(d.width))
      .attr('height', (d) => yscale(d.height))
      .attr('class', 'room')
      .style('fill', '#cccccc')
      .style('opacity', 0.67);

    const rooms = d3.selectAll('.room');
    rooms.on('click',  function(d: Room) {
      d3.selectAll('rect').style('fill', '#cccccc');
      d3.select(this).style('fill', '#313131');
      self.floorSelected.emit(d.data.id);
    });
  }

  getLayout(max: number, divisions: number): Room[] {
    const coords = [];
    const length = max / divisions;
    coords.push(new Room(0, max, max, max / 2, '0'));
    coords.push(new Room(0, max / 2, max, max / 2, '1'));

    return coords;
  }

}

interface ImageData {
  url: string;
  width: number;
  height: number;
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
