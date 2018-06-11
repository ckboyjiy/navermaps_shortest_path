import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'stripTag'
})
export class StripTagPipe implements PipeTransform {

  transform(value: string, args?: any): any {
    if (value) {
      return value.replace(/<[^>]+>/g, '');
    } else {
      return value;
    }

  }

}
