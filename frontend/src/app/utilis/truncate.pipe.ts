import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate',
  standalone: true
})
export class TruncatePipe implements PipeTransform {

  transform(value: string, limit: number = 50): string {
    if (!value) return '';
    return value.length > limit ? value.substr(0, limit) + '...' : value;
  }

}
