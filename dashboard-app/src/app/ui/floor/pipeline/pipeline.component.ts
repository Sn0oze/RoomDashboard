import {Component, OnInit, Input} from '@angular/core';
import {Job} from '../../../core/models/job.model';
import * as moment from 'moment';
import {TimeFormats} from '../../../core/constants/time-formats';
import {Moment} from 'moment';
import {DomSanitizer, SafeStyle} from '@angular/platform-browser';

@Component({
  selector: 'app-pipeline',
  templateUrl: './pipeline.component.html',
  styleUrls: ['./pipeline.component.scss']
})
export class PipelineComponent implements OnInit {

  @Input() job: Job;
  @Input() color = '#64C7CC';
  private now = moment.utc('2020-02-16T09:43:11Z');
  private lineWidth = 4;
  private start: Moment;
  private end: Moment;

  constructor(private sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.start = moment.utc(this.job.start);
    this.end = moment.utc(this.job.end);
  }

  formatTime(utcString): string {
    return moment.utc(utcString).format(TimeFormats.short);
  }

  progress(): SafeStyle {
    const percentage = Math.floor((this.now.diff(this.start) / this.end.diff(this.start)) * 100);
    const offset = percentage >= 50 ? this.lineWidth : 0;
    return this.sanitizer.bypassSecurityTrustStyle(`calc(${percentage}% - ${offset}px)`);
  }

  getIcon(): string {
    let icon = '';
    if (this.job.done && this.now.isAfter(this.end)) {
      icon = 'check_circle_outline';
    } else if (this.now.isAfter(this.end)) {
      icon = 'error_outline';
    }
    return icon;
  }

}
