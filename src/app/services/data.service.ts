import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private weatherData: Subject<any> = new Subject();

  setWeatherData(data: any): any {
    this.weatherData.next(data);
  }

  getWeatherData(): Observable<any> {
    return this.weatherData.asObservable();
  }
}
