import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'distance'
})
export class DistancePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (value) {
      const temp = parseInt(value, 10);
      if (temp > 1000) {
        return `${(temp / 1000).toFixed(2)} km`;
      } else {
        return `${temp.toFixed(0)} m`;
      }
    } else {
      return value;
    }
  }

}
