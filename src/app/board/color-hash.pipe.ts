import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'colorHash',
})
export class ColorHashPipe implements PipeTransform {
  transform(value: string, contrast?: boolean): string {
    if (!value) {
      return contrast ? '#EEEEEE' : '#AAAAAA';
    }
    let hex = ColorHashPipe.intToHex(ColorHashPipe.hashCode(value));
    if (contrast) {
      hex = ColorHashPipe.contrast(hex);
    }
    return '#' + hex;
  }

  private static hashCode(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
  }

  private static intToHex(i: number): string {
    let c = (i & 0x00ffffff).toString(16).toUpperCase();
    return '00000'.substring(0, 6 - c.length) + c;
  }

  private static contrast(hexcolor) {
    return parseInt(hexcolor, 16) > 0xffffff / 2 ? '000000' : 'ffffff';
  }
}
