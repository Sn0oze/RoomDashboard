import { Pipe, PipeTransform } from '@angular/core';
import {readableFontColor} from '../utils/color.utils';

@Pipe({
  name: 'LegibleFont',
  pure: true
})
export class FontLegibilityPipe implements PipeTransform {

  transform(backgroundColor: string): string {
    return readableFontColor(backgroundColor);
  }
}
