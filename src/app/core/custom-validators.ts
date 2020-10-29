import { FormControl } from '@angular/forms';

export class CustomValidators {
  public static notEmpty(control: FormControl) {
    const empty = (control.value || '').trim().length === 0;
    return !empty ? null : { empty: true };
  }
}
