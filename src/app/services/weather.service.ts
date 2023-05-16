import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  constructor(private _http: HttpClient) { }

  getWeather(busqueda: string): Observable<any> {
    return this._http.get<any>(`https://api.openweathermap.org/data/2.5/weather?q=${busqueda}&units=metric&appid=${process.env['APIKEYWEATHER']}`);
  }
}
