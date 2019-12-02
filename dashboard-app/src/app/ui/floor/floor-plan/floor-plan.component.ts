import {Component, ElementRef, OnInit, ViewChild, Output, EventEmitter, Input} from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-floor-plan',
  templateUrl: './floor-plan.component.html',
  styleUrls: ['./floor-plan.component.scss']
})
export class FloorPlanComponent implements OnInit {
  @Input() floor: any;
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
    const data = this.twoZoneLayout(domainMax, 6); // ['room_1', 'room_2', 'room_3', 'room_4'];
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
        .domain([domainMax, domainMin])
        .range([dimensions.height, 0]);

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
      .attr('class', 'zone')
      .style('fill', (d) => d.data.id === '0' ? '#313131' : '#cccccc')
      .style('opacity', 0.67);

    svg.selectAll('text')
      .data(data)
      .enter()
      .append('text')
      .attr('class', 'zone-label')
      .attr('x', d => xscale(d.x + (d.width / 2)))
      .attr('y', d => yscale(d.y + (d.height / 2)))
      .text(d => `Zone ${d.data.id}`);

    const rooms = d3.selectAll('.zone');
    rooms.on('click',  function(d: Room) {
      d3.selectAll('rect').style('fill', '#cccccc');
      d3.select(this).style('fill', '#313131');
      self.floorSelected.emit(d.data.id);
    });
  }

  twoZoneLayout(max: number, divisions: number): Room[] {
    const coords = [];
    coords.push(new Room(0, max / 2, max, max / 2, '0'));
    coords.push(new Room(0, 0, max, max / 2, '1'));
    // console.log(this.subDivide(max, divisions));
    // coords = this.subDivide(max, divisions);
    return coords;
  }
  subDivide(max: number, divisions: number): Room[] {
    const coords = [];
    const length = max / divisions;
    for (let i = 0; i < divisions; i++) {
      const x = i * length;
      const width = length;
      const y = max;
      const height = max / 2;
      coords.push(new Room(x, y, width, height, i.toString()));
    }

    return coords;
  }

}

interface Division {
  start: number;
  width: number;
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
