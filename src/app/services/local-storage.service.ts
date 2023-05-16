import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  getItem(key: string): Storage | any {
    let local = localStorage.getItem(key);
    if(local){
      return JSON.parse(local);
    } else {
      return null;
    }
  }

  setItem(key: string, value: string) {
    localStorage.setItem(key, value);
  }
}
