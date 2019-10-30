import {Component, OnInit, Input} from '@angular/core';
import {Job} from '../../../core/models/job.model';
import * as moment from 'moment';
import {TimeFormats} from '../../../core/constants/time-formats';

@Component({
  selector: 'app-pipeline',
  templateUrl: './pipeline.component.html',
  styleUrls: ['./pipeline.component.scss']
})
export class PipelineComponent implements OnInit {

  @Input() job: Job;
  @Input() color = '#64C7CC';

  constructor() { }

  ngOnInit() {
  }

  formatTime(utcString): string {
    return moment.utc(utcString).format(TimeFormats.short);
  }

}
