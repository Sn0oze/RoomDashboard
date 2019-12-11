import {Job} from './job.model';

export interface Zone {
  pipeline: Job[];
  zone: number;
  zoneId: number;
}
