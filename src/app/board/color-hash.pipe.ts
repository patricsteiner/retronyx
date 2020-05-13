import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'colorHash',
})
export class ColorHashPipe implements PipeTransform {
  transform(value: string, contrast?: boolean): string {
    let hex = ColorHashPipe.intToHex(ColorHashPipe.hashCode(value));
    if (contrast) hex = ColorHashPipe.contrast(hex);
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

  private static contrast(hex) {
    const r = parseInt(hex.substr(1, 2), 16),
      g = parseInt(hex.substr(3, 2), 16),
      b = parseInt(hex.substr(5, 2), 16),
      yiq = (r * 299 + g * 587 + b * 114) / 1000;
    return yiq >= 128 ? '000000' : 'ffffff';
  }
}
