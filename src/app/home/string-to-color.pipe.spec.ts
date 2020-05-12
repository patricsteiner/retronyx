import { StringToColorPipe } from './string-to-color.pipe';

describe('StringToColorPipe', () => {
  it('create an instance', () => {
    const pipe = new StringToColorPipe();
    expect(pipe).toBeTruthy();
  });
});
