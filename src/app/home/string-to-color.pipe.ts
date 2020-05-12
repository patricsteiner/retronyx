import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'stringToColor',
})
export class StringToColorPipe implements PipeTransform {
  transform(value: string): string {
    console.log(this.intToRGB(this.hashCode(value)));
    return this.intToRGB(this.hashCode(value));
  }

  private hashCode(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
  }

  private intToRGB(i): string {
    let c = (i & 0x00ffffff).toString(16).toUpperCase();
    return '00000'.substring(0, 6 - c.length) + c;
  }
}
