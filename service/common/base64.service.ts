import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Base64Service {
  decoded(value: string): string {
    let base64String: string = '';

    if (value && typeof value === 'string') {
      base64String = value
        .replace(/-/g, '+')
        .replace(/_/g, '/');
    }
    return atob(base64String);
  }

  encryption(value: string): string {

    return btoa(value);
  }
}
