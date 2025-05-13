import { Pipe, PipeTransform } from '@angular/core';
import { I18nService } from '../services/i18n.service';


@Pipe({
  name: 'translate',
  pure: false,
})
export class TranslatePipe implements PipeTransform {
  constructor(private i18n: I18nService) {}

  transform(key: string): string {
    console.log(key,'key')
    return this.i18n.t(key);
  }
}
