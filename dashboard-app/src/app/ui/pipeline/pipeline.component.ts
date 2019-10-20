import {Component, OnInit, Input} from '@angular/core';
import {Job} from '../../core/models/job.model';

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

}
